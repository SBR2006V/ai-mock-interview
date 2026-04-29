import "./globals.css"; // ✅ THIS WAS MISSING

export const metadata = {
  title: "CareerLaunch - AI-Powered Placement Readiness Platform",
  description: "Practice interviews",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
