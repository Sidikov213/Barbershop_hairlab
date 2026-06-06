import type { Metadata } from "next";
import { Courier_Prime, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { inter, raleway } from "@/styles/fonts";
import { Providers } from "@/components/Providers";
import { MOBILE_THEME_BREAKPOINT } from "@/lib/theme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const courierPrime = Courier_Prime({
  subsets: ['latin'],
  variable: '--font-courier',
  display: 'swap',
  weight: ['400', '700'],   // явно перечисляем нужные
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: "Hair Lab — Стиль. Уход. Красота.",
  description: "Hair Lab — барбершоп и салон красоты",
  keywords: "Hair Lab, HAIRLAB, парикмахерская, барбершоп, стрижка, окрашивание, укладка",
  icons: {
    icon: [
      {
        url: '/assets/icons/golova.svg',
        href: '/assets/icons/golova.svg',
      }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${courierPrime.variable} ${raleway.variable} ${inter.variable}`}>
      <body suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('theme');if(s==='dark'||s==='light'){document.body.setAttribute('data-theme',s);}else if(window.innerWidth<=${MOBILE_THEME_BREAKPOINT}){document.body.setAttribute('data-theme','light');}else{document.body.setAttribute('data-theme','dark');}}catch(e){document.body.setAttribute('data-theme',window.innerWidth<=${MOBILE_THEME_BREAKPOINT}?'light':'dark');}})();`,
          }}
        />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
