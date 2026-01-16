import { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import siteMetadata from '@/contents/siteMetadata';
import { title, description } from '@/contents/siteLocaleMetadata';
//import { dir } from 'i18next';
import { locales } from '@/i18n/i18nLocales';
import { LocaleTypes } from '@/i18n/i18nConfig';
//import { Geist, Geist_Mono, Noto_Sans_JP } from 'next/font/google';
import '../../styles/globals.css';

import { HeaderClient } from '@/components/layouts/HeaderClient';

// export default async function Layout({ children, params }: any) {
//   const { locale } = await params;

//   return (
//     <>
//       <HeaderClient locale={locale} />
//       {/* 헤더가 fixed라서 상단 여백 필요 */}
//       <div className="pt-20">{children}</div>
//     </>
//   );
// }

// const notoSansJP = Noto_Sans_JP({
//   variable: '--font-noto-sans-jp',
//   subsets: ['latin'],
// });

// const geistMono = Geist_Mono({
//   variable: '--font-geist-mono',
//   subsets: ['latin'],
// });

// const geistSans = Geist({
//   variable: '--font-geist-sans',
//   subsets: ['latin'],
// });

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: LocaleTypes }>;
}): Promise<Metadata> {
  const locale = (await params).locale;

  return {
    metadataBase: new URL(siteMetadata.siteUrl),
    title: {
      default: title[locale],
      template: `%s | ${title[locale]}`,
    },
    description: description[locale],
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <HeaderClient locale={locale} />
          <div className="pt-20">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
