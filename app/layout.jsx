import { IBM_Plex_Sans, Roboto } from "next/font/google";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata = {
  title: "Finvera App",
  description: "A premium financial application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${ibmPlexSans.variable} ${roboto.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
