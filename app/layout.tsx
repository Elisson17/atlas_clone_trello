import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { BoardProvider } from "@/contexts/BoardContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Atlas - Gerenciador de Projetos",
  description: "Organize seus projetos e tarefas com o Atlas, um poderoso clone do Trello.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            <BoardProvider>
              <NotificationProvider>
                {children}
                <Toaster position="bottom-right" richColors />
              </NotificationProvider>
            </BoardProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
