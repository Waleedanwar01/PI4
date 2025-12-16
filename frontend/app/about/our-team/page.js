import { apiUrl } from "../../lib/api";

async function fetchTeams() {
  const res = await fetch(apiUrl("/api/teams/groups"), { next: { revalidate: 10 } });
  if (!res.ok) return { groups: [] };
  return res.json();
}

import Reveal from "../../components/Reveal";
import Link from "next/link";
import Image from "next/image";

function toSlug(name = "") {
  return String(name)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function fetchConfig() {
  try {
    const res = await fetch(apiUrl("/api/site-config"), { cache: "no-store" });
    if (!res.ok) return {};
    return res.json();
  } catch {
    return {};
  }
}

export default async function Page() {
  const [data, config] = await Promise.all([fetchTeams(), fetchConfig()]);
  const slug = "about/our-team";
  const meta = ((config.pages_meta || []).find((m) => (m.slug || "") === slug || (m.slug || "") === "our-team")) || null;
  const pageTitle = meta?.title || "Meet Our Team";
  const groups = data.groups || [];
  return (
    <section className="bg-white">
      <div
        className="relative w-full h-40 sm:h-56 md:h-64 lg:h-72 overflow-hidden"
        style={{ backgroundImage: "url(/images/about-home-page.png)", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-blue-900/70" />
        <div className="relative z-10 h-full flex items-center justify-center">
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-extrabold">{pageTitle}</h1>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {groups.length === 0 ? (
          <p className="text-gray-600 text-center">No team data available yet. Add teams in Django admin.</p>
        ) : (
          groups.map((g) => (
            <div key={g.slug} className="mb-14">
              <Reveal>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-8 text-center">{g.name}</h2>
              </Reveal>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 justify-items-center">
                {g.members.map((m) => (
                  <Reveal key={`${g.slug}-${m.name}`} className="w-64">
                    <Link href={`/team/${toSlug(m.name)}`} className="rounded-xl overflow-hidden border border-gray-200 shadow bg-white">
                      <div className="aspect-[3/4] bg-gray-100">
                        <Image
                          src={m.photo_url || "/images/team/TL-Web-1024x1536.jpg"}
                          alt={m.name}
                          width={600}
                          height={800}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="px-4 py-3">
                        <div className="text-gray-900 font-semibold">{m.name}</div>
                        {m.rank && <div className="text-gray-600 text-sm">{m.rank}</div>}
                        <div className="mt-2 h-0.5 w-10 bg-blue-600" />
                        {m.linkedin_url && (
                          <a href={m.linkedin_url} target="_blank" rel="noopener" className="inline-block mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium">
                            LinkedIn
                          </a>
                        )}
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export async function generateMetadata() {
  try {
    const config = await fetchConfig();
    const slug = "about/our-team";
    const meta = ((config.pages_meta || []).find((m) => (m.slug || "") === slug || (m.slug || "") === "our-team")) || null;
    if (meta) {
      return {
        title: meta.meta_title || meta.title || "Meet Our Team",
        description: meta.meta_description || undefined,
      };
    }
  } catch {}
  return { title: "Meet Our Team" };
}
