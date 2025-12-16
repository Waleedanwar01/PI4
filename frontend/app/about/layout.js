import { apiUrl } from "@/app/lib/api";

export async function generateMetadata() {
  try {
    const res = await fetch(apiUrl("/api/about/page"), { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      return {
        title: data.meta_title || data.title || "About Us",
        description: data.meta_description || "",
      };
    }
  } catch {}
  return { title: "About Us" };
}

export default function AboutLayout({ children }) {
  return children;
}

