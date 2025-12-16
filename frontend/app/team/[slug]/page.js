export const dynamic = 'force-dynamic';

function toSlug(name = '') {
  return String(name).toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
}

async function fetchTeams() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/teams/groups', { cache: 'no-store' });
    if (!res.ok) return { groups: [] };
    return res.json();
  } catch {
    return { groups: [] };
  }
}

async function fetchConfig() {
  try {
    const res = await fetch(apiUrl('/api/site-config'), { cache: 'no-store' });
    if (!res.ok) return {};
    return res.json();
  } catch {
    return {};
  }
}

export default async function Page({ params }) {
  const { slug } = params || {};
  const [teamsData, config] = await Promise.all([fetchTeams(), fetchConfig()]);
  const groups = teamsData.groups || [];
  const flat = groups.flatMap((g) => (g.members || []).map((m) => ({ ...m, group: g.name })));
  const member = flat.find((m) => toSlug(m.name) === slug);
  const others = flat.filter((m) => toSlug(m.name) !== slug);
  const memberPhone = (member && member.phone) || '';
  const memberEmail = (member && member.email) || '';
  const phoneDisplay = memberPhone || config.phone || '1-818-302-3060';
  const phoneHrefSource = memberPhone ? memberPhone : (config.phone || '+18183023060');
  const phoneHref = `tel:${String(phoneHrefSource).replace(/[^+\d]/g, '')}`;
  const emailDisplay = memberEmail || config.email || '';
  const emailHref = emailDisplay ? `mailto:${emailDisplay}` : '';
  const heroSrc = '/images/about-home-page.png';

  return (
    <section className="bg-white">
      <div className="relative w-full h-40 sm:h-56 md:h-64 lg:h-72 overflow-hidden" style={{ backgroundImage: `url(${heroSrc})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-blue-900/70" />
        <div className="relative z-10 h-full flex items-center justify-center">
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-extrabold">Meet Our Team</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {member ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{member.name}</h2>
              <div className="mt-1 inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-100 text-xs font-semibold">{member.rank || 'Team Member'}</div>
              <p className="mt-6 text-slate-700 leading-relaxed text-sm sm:text-base">{member.group ? `Group: ${member.group}` : ''}</p>
              {member?.description ? (
                <p className="mt-3 text-slate-600 text-sm">{member.description}</p>
              ) : (
                <p className="mt-3 text-slate-600 text-sm">We proudly serve clients with responsive support and expert insurance advice across personal and commercial lines.</p>
              )}
            </div>
            <div>
              <div className="rounded-xl overflow-hidden ring-1 ring-slate-200 bg-white shadow">
                {member.photo_url ? (
                  <Image src={member.photo_url} alt={member.name} width={800} height={1000} className="w-full h-96 object-cover" />
                ) : (
                  <div className="w-full h-96 bg-slate-100" />
                )}
              </div>
            </div>
            <div>
              <div className="rounded-xl overflow-hidden ring-1 ring-slate-200 bg-gradient-to-br from-blue-700 to-blue-600 text-white shadow p-6">
                <p className="text-sm font-semibold">Phone</p>
                <a href={phoneHref} className="block text-lg font-extrabold mt-1">{phoneDisplay}</a>
                        {emailDisplay && (
                          <>
                            <p className="mt-4 text-sm font-semibold">E-mail</p>
                            <a href={emailHref} className="block text-sm font-semibold mt-1">{emailDisplay}</a>
                          </>
                        )}
                {member.linkedin_url && (
                  <a href={member.linkedin_url} target="_blank" rel="noopener" className="mt-6 inline-flex items-center justify-center w-9 h-9 rounded-md bg-white/20 hover:bg-white/30 transition text-white font-bold">in</a>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">Team member not found.</p>
        )}

        {others.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-6">Rest of the Team</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 justify-items-center">
              {others.map((m, i) => (
                <Link key={i} href={`/team/${toSlug(m.name)}`} className="w-64 rounded-xl overflow-hidden border border-gray-200 shadow bg-white">
                  <div className="relative h-64 w-full bg-slate-100">
                    {m.photo_url ? (
                      <Image src={m.photo_url} alt={m.name} width={600} height={800} className="w-full h-64 object-cover" />
                    ) : (
                      <div className="w-full h-64 bg-slate-100" />
                    )}
                  </div>
                  <div className="p-4">
                    <div className="text-slate-900 font-bold leading-snug">{m.name}</div>
                    <div className="text-xs text-slate-500">{m.rank}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
import Link from 'next/link';
import Image from 'next/image';
