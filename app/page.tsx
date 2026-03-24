import { ReportForm } from "@/components/ReportForm";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function Home() {
  const reportCount = await prisma.report.count();
  const copyText = `حرصًا على تنظيم الشكوى، تم إنشاء موقع إلكتروني مخصص لتقديم الشكاوى بشكل رسمي ومرتب.
من خلال هذا الموقع، يمكن لأي شخص متضرر تعبئة البيانات المطلوبة وتوضيح الشكوى، مع إضافة أي تفاصيل إضافية في الشكوى تساعد في تعزيز فرص متابعة الشكوى والرد عليها.

🔹 رابط الموقع:
https://iust-report.vercel.app

نؤكد أن جميع المعلومات المدخلة تبقى سرية تمامًا ولا تتم مشاركتها مع أي طرف آخر سوى الادارة، والغرض منها فقط هو التحقق من أن مقدم الشكوى هو صاحب العلاقة 
حيث سيتم رفع هذه الشكاوى بشكل مباشر إلى الادارة طالما أن الأمر يتعلق بالجامعة;`;

  const progressPercent = Math.min((reportCount / 150) * 100, 100);

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-[#005072]/5 to-teal-50"
      dir="rtl"
    >
      <div className="container mx-auto px-4 py-6 md:py-10 relative">
        {/* Logo - subtle brand element */}
        <div className="flex justify-center mb-4 md:mb-6">
          <Link
            href="/reports"
            className="animate-fade-down animate-ease-out inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden ring-2 ring-[#005072]/20 hover:ring-[#005072]/40 transition-all"
          >
            <Image
              src={"/iust-logo.webp"}
              alt="الجامعة الدولية للعلوم والتكنولوجيا"
              width={64}
              height={64}
              className="object-cover"
            />
          </Link>
        </div>

        {/* Hero section */}
        <div className="text-center mb-8 md:mb-10 animate-fade-down animate-ease-out">
          <div className="inline-flex items-center gap-2 justify-center mb-3">
            <CheckCircle className="size-8 md:size-10 text-[#005072] shrink-0" />
            <h1 className="text-3xl md:text-5xl font-bold text-[#005072] tracking-tight">
              تم تقديم الشكاوي
            </h1>
          </div>
          {/* <p className="text-gray-600 text-base md:text-lg max-w-md mx-auto">
            انضم للطلاب الذين قدموا شكاويهم عبر نظام الإبلاغ
          </p> */}
        </div>

        {/* Progress card */}
        <div className="max-w-lg mx-auto mb-8 md:mb-10 animate-fade-up animate-delay-[200ms] animate-ease-out">
          <Card className="border-[#005072]/20 shadow-lg shadow-[#005072]/5 overflow-hidden">
            <CardContent className="pt-6 pb-6 px-6 md:px-8">
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-[#005072]">
                    {reportCount} <span className="text-gray-500 font-normal text-xl md:text-2xl">/ 150</span> شكوى
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    نسبة الإنجاز: {Math.round(progressPercent)}%
                  </p>
                </div>
                <div className="relative">
                  <div className="h-4 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-l from-teal-600 to-[#005072] transition-all duration-700 ease-out"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium">
                    50%
                  </div>
                </div>
                <p className="text-center text-gray-500 text-sm">
                  الهدف: على الأقل 75 شكوى
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Form */}
        {/* <div className="max-w-2xl mx-auto animate-fade-up animate-delay-[400ms] animate-ease-out">
          <p className="text-center text-gray-500 text-sm mb-4">
            هذا النموذج من قبل الطلاب وليس إدارة الجامعة بشكل مباشر
          </p>
          <ReportForm copyText={copyText} />
        </div> */}
      </div>
    </div>
  );
}
