import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import RootProviders from "@/components/providers/RootProviders";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wealthe Wave",
  description: "dobr9k",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        //Тема за замовчуванням
        className="dark"
        style={{
          colorScheme: "dark",
        }}
      >
        <body className={inter.className}>
          {/* <header>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header> */}
          <main>
            <RootProviders>{children}</RootProviders>
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
