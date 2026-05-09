import "./globals.css";

export const metadata = {
  title: "MediBook",
  description: "Premium hospital appointment system frontend for SanTech."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>{children}</body>
    </html>
  );
}
