import type { Metadata } from "next";
import "./globals.css";
import "./archive-theme.css";

export const metadata: Metadata = {
  title: "LUMINOUS | 루미너스 공략 아카이브",
  description: "공략과 게임 데이터, 함께 만드는 루미너스 티어리스트.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
