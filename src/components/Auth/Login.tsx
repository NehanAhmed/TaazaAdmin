import { LoginForm } from "@/components/login-form"
import { googleLogin } from "../../appwrite/googleAuth";
import { account } from "../../lib/appwrite";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export default function Login() {
    const navigate = useNavigate();
    const handleLogin = async (data: { email: string; password: string }) => {
        try {
            await account.createEmailPasswordSession({
                email: data.email,
                password: data.password
            });
            toast.success("Login successful!");
            navigate("/");
        } catch (error) {
            toast.error("Login failed: " + error);
        }
    }
    const handleLoginData = async (data: { email: string; password: string }) => {
        await handleLogin(data);
    };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm onLogin={handleLoginData} />
      </div>
    </div>
  )
}
