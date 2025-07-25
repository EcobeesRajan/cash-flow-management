'use client';

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/(auth)/AuthContext";

import InputField from "@/components/field/InputField";
import LoginButton from "@/components/buttons/Buttons";
import {
  LoginSchema,
  type LoginInput,
  type LoginErrors,
} from "@/app/zod/auth/loginSchema";
import { ZodIssue } from "zod";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState<LoginInput>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<LoginErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name as keyof LoginInput]: undefined }));
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError("");

    const result = LoginSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: LoginErrors = {};
      result.error.issues.forEach((issue: ZodIssue) => {
        const field = issue.path[0] as keyof LoginInput;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      await login(formData.email, formData.password);
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Login failed:", err.message);
        setSubmitError("Invalid email or password.");
      } else {
        setSubmitError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md sm:max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <InputField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            error={errors.email}
            className="w-full"
          />
          <InputField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            error={errors.password}
            className="w-full"
          />
          {submitError && (
            <div className="text-red-600 font-semibold text-sm">{submitError}</div>
          )}
          <LoginButton loading={loading} disabled={loading} label="Login" />
        </form>
      </div>
    </div>
  );
}
