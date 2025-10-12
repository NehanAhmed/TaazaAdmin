import { useState } from "react";
import { Button } from "./ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "./ui/field"
import { Input } from "./ui/input"
import { toast } from "sonner";
import { googleLogin } from "../appwrite/googleAuth";

interface SignupFormProps extends React.ComponentProps<typeof Card> {
  onSignupHandle: (data: { name: string; email: string; password: string }) => void;
}


export function SignupForm({
  onSignupHandle,
  
  ...props }: SignupFormProps) {
  const [name, setname] = useState("")
  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")
  const [confirmPassword, setconfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

interface FormData {
  email: string;
  password: string;
  name: string;
}

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // setIsLoading(true);
    if (password !== confirmPassword) {

      toast.error("Passwords do not match");
      return;
    }
    const data: FormData = {
      name: name,
      email: email,
      password: password,
    };
    onSignupHandle(data);
    // setIsLoading(false);
  };

  const handleGoogleSignup = async() => {
    try {
      await googleLogin().then(() => {
        toast.success("Redirecting to Google Sign-In...");
      });
    } catch (error) {
      toast.error("Failed to login with Google: " + error);
    }
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input disabled={isLoading} value={name} onChange={(e) => setname(e.target.value)} id="name" type="text" placeholder="John Doe" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                disabled={isLoading}
                value={email}
                onChange={(e) => setemail(e.target.value)}
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
              <FieldDescription>
                We&apos;ll use this to contact you. We will not share your email
                with anyone else.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input disabled={isLoading} value={password} onChange={(e) => setpassword(e.target.value)} id="password" type="password" required />
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <Input disabled={isLoading} value={confirmPassword} onChange={(e) => setconfirmPassword(e.target.value)} id="confirm-password" type="password" required />
              <FieldDescription>Please confirm your password.</FieldDescription>
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit" disabled={isLoading}>Create Account</Button>
                {/* <Button onClick={handleGoogleSignup} variant="outline" type="button" disabled={isLoading}>
                  <img src="/Google_G_logo.svg.png" alt="Google Logo" className="mr-2 w-5" />
                  Sign up with Google
                </Button> */}
                <FieldDescription className="px-6 text-center">
                  Already have an account? <a href="#">Sign in</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
