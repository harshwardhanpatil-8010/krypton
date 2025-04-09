import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from 'sonner'
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Krypton",
  description: "Crypto asset management system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
         <Toaster position="top-center" richColors />
       <ThemeProvider
            attribute="class"
            defaultTheme="dark">
              
              <main>
        {children}
     
        </main>
       
        </ThemeProvider>
      </body>
    </html>
  );
}
