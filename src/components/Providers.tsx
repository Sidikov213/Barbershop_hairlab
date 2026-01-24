'use client';

import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { BookingModalProvider } from "@/contexts/BookingModalContext";
import { LoginModalProvider } from "@/contexts/LoginModalContext";
import { ProfileModalProvider } from "@/contexts/ProfileModalContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <BookingModalProvider>
          <LoginModalProvider>
            <ProfileModalProvider>
              {children}
            </ProfileModalProvider>
          </LoginModalProvider>
        </BookingModalProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
