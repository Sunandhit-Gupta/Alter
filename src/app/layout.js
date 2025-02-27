// app/layout.js
import { Suspense } from "react";
import ClientProvider from "./components/ClientProvider"; // Import Client Component
import "./globals.css";
// Metadata export for setting the app name
export const metadata = {
  title: "QuizMate", // Change this to whatever name you want
  description: "Your awesome quiz app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}