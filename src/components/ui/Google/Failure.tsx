import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { XCircle } from "lucide-react";

"use client";


export default function FailurePage() {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/");
        }, 5000); // Redirect after 5 seconds

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center space-y-6">
                <div className="flex justify-center">
                    <XCircle className="h-24 w-24 text-red-500" />
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900">Authentication Failed</h1>
                
                <p className="text-gray-600">
                    We couldn't authenticate your credentials. You will be redirected to the dashboard in a few seconds.
                </p>

                <div className="space-y-4">
                    <Button 
                        variant="default" 
                        className="w-full"
                        onClick={() => navigate("/")}
                    >
                        Return to Dashboard
                    </Button>
                    
                    <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => navigate("/login")}
                    >
                        Try Again
                    </Button>
                </div>
            </div>
        </div>
    );
}