import { ReportForm } from "@/components/ReportForm";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  const reportCount = await prisma.report.count();
  const copyText = `حرصًا على تنظيم الشكوى، تم إنشاء موقع إلكتروني مخصص لتقديم الشكاوى بشكل رسمي ومرتب.
من خلال هذا الموقع، يمكن لأي شخص متضرر تعبئة البيانات المطلوبة وتوضيح الشكوى، مع إضافة أي تفاصيل إضافية في الشكوى تساعد في تعزيز فرص متابعة الشكوى والرد عليها.

🔹 رابط الموقع:
https://iust-report.vercel.app

نؤكد أن جميع المعلومات المدخلة تبقى سرية تمامًا ولا تتم مشاركتها مع أي طرف آخر سوى الادارة، والغرض منها فقط هو التحقق من أن مقدم الشكوى هو صاحب العلاقة 
حيث سيتم رفع هذه الشكاوى بشكل مباشر إلى الادارة طالما أن الأمر يتعلق بالجامعة;`;

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100"
      dir="rtl"
    >
      <div className="container mx-auto px-4 py-4 md:py-8 relative">
        {/* Header with Logo */}
        <div className="text-center mb-6 md:mb-8 ">
          <Link
            href="/reports"
            className="animate-fade-down animate-ease-out inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full mb-4"
          >
            <Image
              src={"/iust-logo.webp"}
              alt="logo"
              width={100}
              height={100}
            ></Image>
          </Link>
          <h1 className="animate-fade-down animate-ease-out animate-delay-[100ms] text-center text-2xl md:text-4xl font-bold text-[#005072] mb-2 ">
            الجامعة الدولية للعلوم والتكنولوجيا
          </h1>
          <p className="animate-fade-down animate-ease-out text-center text-gray-600 text-base md:text-lg animate-delay-[200ms]">
            نظام الشكاوي والإبلاغ عن المشاكل في الجامعة الدولية للعلوم
            والتكنولوجيا
          </p>
          <p className="animate-fade-down animate-ease-out text-center text-gray-600 text-base md:text-lg animate-delay-[200ms]">
            هذا الform من قبل الطلاب وليس ادارة الجامعة بشكل مباشر{" "}
          </p>
        </div>
        <div className="pb-6 flex flex-col items-center px-2 md:px-0 animate-fade-up animate-delay-[400ms] animate-ease-out gap-4">
          {/* Progress bar - نسبة الطلاب */}
          <div className="w-full max-w-md space-y-2">
            <p className="text-center text-gray-600 text-sm font-medium">
              نسبة الطلاب المقدمة للشكاوى ({reportCount}/150 طالب) —{" "}
              {Math.round(Math.min((reportCount / 150) * 100, 100))}%
            </p>
            <div className="relative">
              <div className="relative h-6 rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#005072] to-teal-600 transition-all duration-500"
                  style={{
                    width: `${Math.min((reportCount / 150) * 100, 100)}%`,
                  }}
                />
                {/* Center marker - small | at 50% */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-600 text-sm font-bold">
                  |
                </div>
              </div>
              <p className="text-center text-gray-500 text-xs mt-1">
                على الاقل 75 شكوى
              </p>
            </div>
          </div>{" "}
        </div>
        {/* Report Form */}
        <div className="flex flex-col items-center px-2 md:px-0 animate-fade-up animate-delay-[400ms] animate-ease-out gap-4">
          <ReportForm copyText={copyText} />
        </div>

        {/* Footer */}
      </div>
    </div>
  );
}
