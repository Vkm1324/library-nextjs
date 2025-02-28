import type { Metadata } from "next";
import "./globals.css";
import { EdgeStoreProvider } from "../lib/edgestore";
import { inter } from "@/components/ui/font";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

export const metadata: Metadata = {
  title: "Library-App",
  description: "dev by Veeresh M",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  return (
    <html lang={locale}>
      <body className={`${inter.className} antialiased`}>
        {
          <NextIntlClientProvider messages={messages}>
            <EdgeStoreProvider>{children}</EdgeStoreProvider>
          </NextIntlClientProvider>
        }
      </body>
    </html>
  );
}
