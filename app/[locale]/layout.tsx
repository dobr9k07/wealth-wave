import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import RootProviders from "@/components/providers/RootProviders";
import { Toaster } from "@/components/ui/sonner";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wealthe Wave",
  description: "dobr9k",
};

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  return (
    <ClerkProvider>
      <html
        lang={locale}
        //Тема за замовчуванням
        className="dark"
        style={{
          colorScheme: "dark",
        }}
      >
        <body className={inter.className} suppressContentEditableWarning={true}>
          <Toaster richColors position="bottom-right" />
          {/* <RootProviders>{children}</RootProviders> */}
          <NextIntlClientProvider messages={messages}>
            <RootProviders>{children}</RootProviders>
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
