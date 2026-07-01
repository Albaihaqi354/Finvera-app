import { IBM_Plex_Sans, Roboto } from "next/font/google";
import { ThemeProvider } from "@/components/desktop/ThemeProvider";
import { I18nProvider } from "@/lib/i18n";
import { ToastProvider } from "@/components/ui/Toast";
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

const themeInitScript = `(function(){try{var t=localStorage.getItem('finvera_theme');var d=t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);}catch(e){}})();`

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${ibmPlexSans.variable} ${roboto.variable} antialiased`}>
        <ThemeProvider>
          <I18nProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
