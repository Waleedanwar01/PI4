export async function generateMetadata() {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/about/page", { cache: "no-store" });
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

