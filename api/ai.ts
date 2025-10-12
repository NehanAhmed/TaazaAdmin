// api/ai.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

// -----------------------------
// Rate limiting types
// -----------------------------
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// -----------------------------
// Helpers
// -----------------------------
function getRateLimitKey(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded
    ? (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : forwarded[0])
    : req.headers['x-real-ip'] || 'unknown';
  return ip as string;
}

function checkRateLimit(identifier: string, maxRequests = 20): RateLimitResult {
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const record = rateLimitMap.get(identifier);

  // Cleanup expired entries
  if (rateLimitMap.size > 10000) {
    // Use forEach to avoid requiring --downlevelIteration or ES2015 target
    rateLimitMap.forEach((value, key) => {
      if (value.resetTime < now) rateLimitMap.delete(key);
    });
  }

  if (!record || record.resetTime < now) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetTime: now + windowMs };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }

  record.count++;
  return { allowed: true, remaining: maxRequests - record.count, resetTime: record.resetTime };
}

function sanitizePrompt(prompt: string): string {
  return prompt
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/\0/g, '');
}

// -----------------------------
// Main handler
// -----------------------------
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. CORS setup
  const origin = req.headers.origin;
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:8080',
    process.env.NEXT_PUBLIC_SITE_URL,
  ].filter(Boolean);

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400');
  }

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // 2. Rate limiting
  const key = getRateLimitKey(req);
  const rateLimit = checkRateLimit(key, 20);

  res.setHeader('X-RateLimit-Limit', '20');
  res.setHeader('X-RateLimit-Remaining', String(rateLimit.remaining));
  res.setHeader('X-RateLimit-Reset', new Date(rateLimit.resetTime).toISOString());

  if (!rateLimit.allowed) {
    const retryAfter = Math.ceil((rateLimit.resetTime - Date.now()) / 1000);
    res.setHeader('Retry-After', String(retryAfter));
    return res.status(429).json({
      error: 'Too many requests',
      retryAfter,
      message: 'Rate limit exceeded. Try again later.',
    });
  }

  // 3. Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // 4. Input validation
  const { prompt } = req.body as {
    prompt?: string | {
      title?: string;
      desc?: string;
      servings?: number;
      // diet?: string;
      difficulty?: string;
    };
  };

  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

  // 5. Generate final prompt
  let finalPrompt = '';

  if (typeof prompt === 'string') {
    finalPrompt = sanitizePrompt(prompt);
  } else if (typeof prompt === 'object') {
    const { title, desc, servings, difficulty } = prompt;

    finalPrompt = `
You are a MasterChef AI. Create a detailed recipe based on the following user input:

Title: ${title || 'Untitled Recipe'}
Description: ${desc || 'No description provided'}
Servings: ${servings || 'Any'}
Difficulty: ${difficulty || 'Medium'}

Provide a complete recipe including:
- Title
- Short description
- Ingredients (with measurements)
- Step-by-step instructions
- Optional tips or variations
`.trim();
  } else {
    return res.status(400).json({ error: 'Invalid prompt format' });
  }

  if (finalPrompt.length === 0)
    return res.status(400).json({ error: 'Prompt cannot be empty' });
  if (finalPrompt.length > 10000)
    return res.status(400).json({
      error: 'Prompt exceeds maximum length',
      maxLength: 10000,
      currentLength: finalPrompt.length,
    });

  // 6. API Key validation
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error('OPENROUTER_API_KEY not configured');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // 7. Request to OpenRouter
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': process.env.NEXT_PUBLIC_SITE_NAME || 'TaazaChef',
      },
      body: JSON.stringify({
        model: '@preset/taaza-chef',
        messages: [{ role: 'user', content: finalPrompt }],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errorData: any = await response.json().catch(() => ({}));
      console.error('OpenRouter API error:', {
        status: response.status,
        error: errorData,
        ip: key,
        timestamp: new Date().toISOString(),
      });

      return res.status(response.status >= 500 ? 500 : response.status).json({
        error: 'AI service error',
        message: response.status >= 500
          ? 'The AI service is temporarily unavailable'
          : 'Unable to process request',
        details: errorData.error?.message || 'Unknown error',
      });
    }

  const data: any = await response.json();

    if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
      console.error('Invalid response structure');
      return res.status(500).json({ error: 'Invalid response from AI service' });
    }

    console.log('AI Request Success:', {
      ip: key,
      model: '@preset/taaza-chef',
      promptLength: finalPrompt.length,
      tokensUsed: data.usage?.total_tokens || 0,
      timestamp: new Date().toISOString(),
    });

    return res.status(200).json(data);
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      console.error('Request timeout:', { ip: key, timestamp: new Date().toISOString() });
      return res.status(504).json({ error: 'Request timeout' });
    }

    console.error('Request failed:', {
      error: err instanceof Error ? err.message : 'Unknown error',
      ip: key,
      timestamp: new Date().toISOString(),
    });

    return res.status(500).json({ error: 'Request failed', message: 'Unexpected error' });
  }
}
