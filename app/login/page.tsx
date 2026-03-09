"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      console.log("Sign in result:", result); // Debug log

      if (result?.error) {
        console.error("Sign in error:", result.error); // Debug log
        setError("Invalid email or password");
      } else if (result?.ok) {
        // Check if user is admin and redirect accordingly
        const session = await getSession();
        console.log("Session:", session); // Debug log
        if (session?.user?.isAdmin) {
          router.push("/reports");
        } else {
          router.push("/");
        }
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error); // Debug log
      setError("An error occurred during login: " + error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4"
      dir="rtl"
    >
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20  rounded-full mb-4 mx-auto"
          >
            <Image
              src={"/iust-logo.webp"}
              alt="logo"
              width={100}
              height={100}
            ></Image>
          </Link>
          <CardTitle className="text-xl md:text-2xl font-bold text-[#005072] text-right">
            تسجيل دخول الإدارة
          </CardTitle>
          <CardDescription className="text-right">
            سجل الدخول للوصول إلى لوحة الإدارة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-right">
                البريد الإلكتروني
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="أدخل بريدك الإلكتروني"
                className="text-right"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-right">
                كلمة المرور
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="أدخل كلمة المرور"
                className="text-right"
              />
            </div>

            {error && (
              <div className="p-3 rounded-md bg-red-100 text-red-800 border border-red-200 text-right">
                {error.includes("Invalid")
                  ? "البريد الإلكتروني أو كلمة المرور غير صحيحة"
                  : error.includes("error")
                    ? "حدث خطأ أثناء تسجيل الدخول"
                    : error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
