import "./globals.css"; // ✅ THIS WAS MISSING

export const metadata = {
  title: "InterviewAI – Smart Mock Interview Platform",
  description: "Practice interviews",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
