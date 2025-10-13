import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { CheckCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

'use client'


export default function Success() {
    const navigate = useNavigate()

    useEffect(() => {
        // Redirect to dashboard after 5 seconds
        const timeout = setTimeout(() => {
            navigate('/dashboard')
        }, 5000)

        return () => clearTimeout(timeout)
    }, [])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Card className="w-full max-w-md p-8 space-y-6">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="rounded-full bg-green-100 p-3">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>

                    <h1 className="text-2xl font-semibold text-gray-900">
                        Success!
                    </h1>

                    <p className="text-gray-500">
                        Your action has been completed successfully. You will be redirected to the dashboard in a few seconds.
                    </p>

                    <div className="animate-pulse mt-4">
                        <div className="h-2 w-24 bg-green-200 rounded"></div>
                    </div>
                </div>

                <Button
                    className="w-full"
                    onClick={() => navigate('/dashboard')}
                >
                    Go to Dashboard Now
                </Button>
            </Card>
        </div>
    )
}