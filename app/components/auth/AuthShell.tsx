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
    <div className="flex min-h-[100dvh] bg-[#F8F9FA]">
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

      {/* Right — form (vertically centered on all sizes) */}
      <div className="flex w-full flex-1 flex-col lg:w-1/2">
        <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-10 sm:py-16 lg:px-16 xl:px-20">
          <div className="mx-auto w-full max-w-sm sm:max-w-md">
            {/* Mobile logo */}
            <div
              className={`mb-8 sm:mb-9 lg:hidden ${
                align === 'center' ? 'flex justify-center' : 'flex justify-start'
              }`}
            >
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

            {/* Heading */}
            <div className={align === 'center' ? 'text-center' : 'text-left'}>
              <h1
                className={`font-bricolage text-[28px] font-black leading-[1.12] tracking-tight text-ink sm:text-4xl lg:text-[44px] ${
                  align === 'center' ? 'text-center' : 'text-left'
                }`}
              >
                {title}
              </h1>
              {subtitle && (
                <p
                  className={`mt-3 text-base leading-relaxed text-slate-500 sm:mt-3.5 sm:text-lg ${
                    align === 'center' ? 'text-center' : 'text-left'
                  }`}
                >
                  {subtitle}
                </p>
              )}
            </div>

            {/* Form */}
            <div className="mt-8">{children}</div>

            {/* Footer */}
            {footer && (
              <div className="mt-8 text-center text-sm text-slate-500">{footer}</div>
            )}
          </div>
        </div>

        {/* Safe area for notched devices */}
        <div className="pb-[env(safe-area-inset-bottom)]" />
      </div>
    </div>
  );
}
