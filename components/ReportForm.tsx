"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CopyIcon } from "@/components/CopyIcon";

interface ReportFormProps {
  copyText: string;
}

export function ReportForm({ copyText }: ReportFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    nationalId: "",
    collegeId: "",
    contactNumber: "",
    issue: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    if (
      (name === "nationalId" ||
        name === "collegeId" ||
        name === "contactNumber") &&
      !/^\d*$/.test(value)
    ) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    // Client-side validation
    if (
      !formData.name.trim() ||
      !formData.nationalId.trim() ||
      !formData.collegeId.trim() ||
      !formData.contactNumber.trim() ||
      !formData.issue.trim()
    ) {
      setMessage("جميع الحقول مطلوبة");
      setIsSubmitting(false);
      return;
    }

    if (
      !/^\d+$/.test(formData.nationalId) ||
      !/^\d+$/.test(formData.collegeId) ||
      !/^\d+$/.test(formData.contactNumber)
    ) {
      setMessage(
        "رقم الهوية الوطنية ورقم الكلية ورقم الهاتف يجب أن تحتوي على أرقام فقط",
      );
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage("شكراً لك, تم تقديم الشكوى أو التقرير بنجاح!");
        setFormData({
          name: "",
          nationalId: "",
          collegeId: "",
          contactNumber: "",
          issue: "",
        });
      } else {
        const error = await response.json();
        let errorMessage = "فشل في تقديم الشكوى أو التقرير";

        if (error.error) {
          if (error.error.includes("required")) {
            errorMessage = "جميع الحقول مطلوبة";
          } else if (error.error.includes("digits")) {
            errorMessage =
              "رقم الهوية الوطنية ورقم الكلية ورقم الهاتف يجب أن تحتوي على أرقام فقط";
          } else if (error.error.includes("server error")) {
            errorMessage = "خطأ في الخادم، يرجى المحاولة مرة أخرى";
          } else {
            errorMessage = error.error;
          }
        }

        setMessage(errorMessage);
      }
    } catch {
      setMessage("حدث خطأ أثناء تقديم الشكوى أو التقرير");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto" dir="rtl">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-xl md:text-2xl font-bold text-right">
              تقديم شكوى أو تقرير مشكلة
            </CardTitle>
            <CardDescription className="text-right">
              يرجى ملء النموذج أدناه بكامل التفاصيل لتقديم شكوى أو تقرير
              بالمشكلة
            </CardDescription>
            <CardDescription className="text-right">
              هذا الform من قبل طلاب وليس ادارة الجامعة بشكل مباشر{" "}
            </CardDescription>
            <CardDescription className="text-right">
              المعلومات الغرض منها فقط هو التحقق من أن مقدم الشكوى هو صاحب
              العلاقة
            </CardDescription>
          </div>
          <div className="flex-shrink-0 mr-4">
            <CopyIcon textToCopy={copyText} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-right">
              الاسم الكامل *
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleInputChange}
              placeholder="أدخل اسمك الكامل"
              className="text-right"
            />
          </div>

          {/* <div className='space-y-2'>
            <Label htmlFor='nationalId' className="text-right">الرقم الوطني *</Label>
            <Input
              id='nationalId'
              name='nationalId'
              type='text'
              required
              value={formData.nationalId}
              onChange={handleInputChange}
              placeholder='أدخل رقمك الوطني'
              className="text-right"
            />
          </div> */}

          <div className="space-y-2">
            <Label htmlFor="collegeId" className="text-right">
              {" "}
              الرقم الجامعي*
            </Label>
            <Input
              id="collegeId"
              name="collegeId"
              type="text"
              required
              value={formData.collegeId}
              onChange={handleInputChange}
              placeholder="أدخل رقمك الجامعي"
              className="text-right"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactNumber" className="text-right">
              رقم الهاتف *
            </Label>
            <Input
              id="contactNumber"
              name="contactNumber"
              type="text"
              required
              value={formData.contactNumber}
              onChange={handleInputChange}
              placeholder="أدخل رقم هاتفك"
              className="text-right"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="issue" className="text-right">
              وصف الشكوى أو المشكلة *
            </Label>
            <Textarea
              id="issue"
              name="issue"
              required
              value={formData.issue}
              onChange={handleInputChange}
              placeholder="اوصف شكواك أو مشكلتك بالتفصيل,
              (الدكتور فلان شرحو سيء وما بيفهّم، خطو سيء، صوتو غير مسموع، مافي مرجع ندرس منه، لوح سيء….الخ)"
              rows={4}
              className="text-right"
            />
          </div>

          {message && (
            <div
              className={`p-3 rounded-md text-right ${
                message.includes("successfully") || message.includes("تم")
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-red-100 text-red-800 border border-red-200"
              }`}
            >
              {message}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "جاري التقديم..." : "تقديم الشكوى أو التقرير"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
