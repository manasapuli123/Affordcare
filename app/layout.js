import "./globals.css";

export const metadata = {
  title: "AffordCare — Intelligent patient affordability platform",
  description:
    "Estimate medication costs, discover financial assistance programs, enroll digitally, upload documents, and track your application from one place.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
