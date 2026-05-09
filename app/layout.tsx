import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  title: 'ChatGPT Clone',
  description: 'ChatGPT clone created for Turing Technologies',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} dark`}
      // className={`${manrope.variable}  h-full antialiased`}
    >
      <body
        className={`${manrope.variable} font-sans min-h-full flex flex-col`}
      >
        {children}
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
