const test = async () => {
  const res = await fetch("http://localhost:3000/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: "Give me a dinner recipe" }),
  });

  console.log("Status:", res.status);
  const text = await res.text();
  console.log("Raw response:", text);

  try {
    const data = JSON.parse(text);
    console.log("Parsed:", data);
  } catch (err) {
    console.error("Invalid JSON:", err.message);
  }
};

test();
