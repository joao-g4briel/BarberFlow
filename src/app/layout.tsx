import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BarberFlow",
  description: "MVP minimalista para gerenciar barbearias.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body>{children}</body>
    </html>
  );
}
