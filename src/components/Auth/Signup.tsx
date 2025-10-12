import { useState } from "react";
import { SignupForm } from "../signup-form";
import { toast } from "sonner";
import { createAccount } from "../../appwrite/auth";
// import { createAccount } from "../../appwrite/auth";
// import { toast } from "sonner";
import { useNavigate } from "react-router";
export default function Signup() {
    const navigate = useNavigate();
    const formHandler = async (data: { name: string; email: string; password: string }) => {
        try {
            const response = await createAccount(data.email, data.password, data.name);
            toast.success("Account created successfully!");
            console.log(response);
            setTimeout(() => {
                navigate("/");
            }, 2000);
        } catch (error) {
            console.log(error);
            toast.error("Error creating account." + error);
        }
    }

    const handleSignupData = async (data: { name: string; email: string; password: string }) => {

        await formHandler(data);
    }

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <SignupForm onSignupHandle={handleSignupData} />
            </div>
        </div>
    )
}
