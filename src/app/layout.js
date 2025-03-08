// app/layout.js
import { Suspense } from "react";
import ClientProvider from "./components/ClientProvider";
import "./globals.css";
import { metadata as createQuizMetadata } from './pages/createQuiz/metadata';
import { metadata as teacherDashboardMetadata } from './pages/dashboard/teacher/metadata';
import { metadata as studentDashboardMetadata } from './pages/dashboard/student/metadata';
import { metadata as teacherHistoryMetadata } from './pages/history/metadata';
import { metadata as pendingQuizMetadata } from './pages/pendingQuiz/metadata';
import { metadata as profileMetadata } from './pages/profile/metadata';


export const metadata = {
  title: "QuizMate - Create & Manage Quizzes Easily",
  description:
    "QuizMate helps teachers create, manage, and evaluate quizzes effortlessly. Say goodbye to paper quizzes and automate grading with ease.",
  keywords: "QuizMate, online quizzes, quiz platform, teacher quizzes, automatic grading",
  openGraph: {
    title: "QuizMate - Create & Manage Quizzes",
    description:
      "QuizMate is a powerful tool for teachers to create, manage, and evaluate quizzes easily.",
    url: "https://nitj-quizmate.vercel.app",
    type: "website",
    images: [
      {
        url: "https://nitj-quizmate.vercel.app/favicon.ico", // Change to an actual image
        width: 1200,
        height: 630,
        alt: "QuizMate Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@SunandhitGupta", // Replace with your Twitter handle
    title: "QuizMate - Create & Manage Quizzes",
    description:
      "QuizMate helps teachers create and manage quizzes easily with automated grading.",
    images: ["https://nitj-quizmate.vercel.app/favicon.ico"], // Change this
  },
  ...createQuizMetadata,
  ...teacherDashboardMetadata,
  ...studentDashboardMetadata,
  ...teacherHistoryMetadata,
  ...pendingQuizMetadata,
  ...profileMetadata,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Schema Markup for Google SEO */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "QuizMate",
          "url": "https://nitj-quizmate.vercel.app",
          "description": "An intuitive quiz management platform for teachers and students.",
          "applicationCategory": "EducationalApplication",
          "operatingSystem": "Web",
          "creator": {
            "@type": "Organization",
            "name": "QuizMate Team"
          }
        })}} />
      </head>
      <body>
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
