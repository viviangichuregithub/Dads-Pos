import "./globals.css";
import { AuthProvider } from "../context/AuthContext";

export const metadata = {
  title: "POS System",
  description: "A modern POS system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
