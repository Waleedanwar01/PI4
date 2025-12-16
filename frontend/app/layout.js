import { Libre_Franklin } from "next/font/google";
import { apiUrl } from "./lib/api";
import dynamic from "next/dynamic";
const Navbar = dynamic(() => import("./components/Navbar"), { ssr: false });
const Footer = dynamic(() => import("./components/Footer"), { ssr: false });
import LoaderOverlay from "./components/LoaderOverlay";
import "./globals.css";

const libreFranklin = Libre_Franklin({
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export async function generateMetadata() {
  try {
    const res = await fetch(apiUrl("/api/site-config"), { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      const v = encodeURIComponent(data.updated_at || Date.now());
      const favicon = data.favicon_url ? `${data.favicon_url}${data.favicon_url.includes('?') ? '&' : '?'}v=${v}` : undefined;
      return {
        title: data.site_name || "Gaspar Insurance Services",
        description: data.footer_about || "",
        icons: favicon ? { icon: [favicon] } : undefined,
      };
    }
  } catch {}
  return { title: "Gaspar Insurance Services" };
}

export default async function RootLayout({ children }) {
  let config = {};
  try {
    const res = await fetch(apiUrl("/api/site-config"), { cache: "no-store" });
    if (res.ok) config = await res.json();
  } catch {}
  return (
    <html lang="en">
      <head>
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className={libreFranklin.className}>
        <LoaderOverlay />
        <Navbar config={config} />
        {children}
        <Footer config={config} />
      </body>
    </html>
  );
}
