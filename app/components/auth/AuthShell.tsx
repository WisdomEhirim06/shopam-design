import Image from 'next/image';
import Link from 'next/link';

export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
  align = 'left',
}: {
  title: string;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  align?: 'left' | 'center';
}) {
  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      {/* Left — cover image (desktop only) */}
      <div className="relative hidden w-1/2 overflow-hidden lg:block">
        <Image
          src="/images/auth-cover.jpg"
          alt=""
          fill
          priority
          sizes="50vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-black/20" />
        <Link href="/" className="absolute left-10 top-10 z-10 transition-transform hover:scale-105 active:scale-95">
          <Image
            src="/images/shopam-logo.png"
            alt="ShopAm"
            width={124}
            height={40}
            className="h-9 w-auto object-contain"
          />
        </Link>
      </div>

      {/* Right — form */}
      <div className="flex w-full flex-col min-h-screen bg-[#F8F9FA] justify-start sm:justify-center px-6 sm:px-10 py-8 sm:py-12 lg:w-1/2 lg:px-16 xl:px-20">
        <div className="w-full max-w-sm sm:max-w-md mx-auto">
          {/* Mobile logo — left-aligned, sitting naturally directly above the heading */}
          <div className={`mb-7 sm:mb-8 lg:hidden ${align === 'center' ? 'flex justify-center' : 'flex justify-start'}`}>
            <Link href="/" className="inline-block transition-transform hover:scale-105 active:scale-95">
              <Image
                src="/images/black-logo.png"
                alt="ShopAm"
                width={130}
                height={38}
                className="h-8 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Heading — left aligned with increased font size */}
          <div className={align === 'center' ? 'text-center' : 'text-left'}>
            <h1 className={`font-bricolage text-3xl sm:text-4xl lg:text-[44px] font-black tracking-tight text-ink leading-tight ${align === 'center' ? 'text-center' : 'text-left'}`}>
              {title}
            </h1>
            {subtitle && (
              <p className={`mt-2 sm:mt-2.5 text-base sm:text-lg text-slate-500 leading-relaxed ${align === 'center' ? 'text-center' : 'text-left'}`}>
                {subtitle}
              </p>
            )}
          </div>

          {/* Form */}
          <div className="mt-6 sm:mt-7">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="mt-7 sm:mt-8 text-center text-sm text-slate-500">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
