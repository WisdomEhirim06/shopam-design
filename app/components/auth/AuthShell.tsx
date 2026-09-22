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
      <div className="flex w-full flex-col bg-[#F8F9FA] lg:w-1/2">
        {/* Mobile logo */}
        <div className="flex justify-start px-6 pt-10 sm:px-10 lg:hidden">
          <Link href="/" className="transition-transform hover:scale-105 active:scale-95">
            <Image src="/images/black-logo.png" alt="ShopAm" width={130} height={38} className="h-8 w-auto object-contain" />
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10 lg:px-16">
          <div className="w-full max-w-md">
            <div className={align === 'left' ? 'text-left' : 'text-center'}>
              <h1 className="font-bricolage text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-ink leading-tight">
                {title}
              </h1>
              {subtitle && <p className="mt-2 text-sm sm:text-base text-slate-500 leading-relaxed">{subtitle}</p>}
            </div>

            <div className="mt-7">{children}</div>

            {footer && <div className="mt-8 text-center text-sm text-slate-500">{footer}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
