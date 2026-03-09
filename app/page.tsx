import { ReportForm } from "@/components/ReportForm";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
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

        {/* Report Form */}
        <div className="flex justify-center px-2 md:px-0 animate-fade-up animate-delay-[400ms] animate-ease-out">
          <ReportForm copyText={copyText} />
        </div>

        {/* Footer */}
      </div>
    </div>
  );
}
