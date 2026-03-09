import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { SectionTitle } from '../components/SectionTitle';
import type { LabContent } from '../types/content';

const defaultContent: LabContent = {
  labName: 'XX 大学 · XX 实验室',
  labSubtitle: 'Lab Name',
  nav: [
    { id: 'home', label: '首页' },
    { id: 'research', label: '研究' },
    { id: 'papers', label: '论文' },
    { id: 'people', label: '成员' },
    { id: 'join', label: '加入我们' },
  ],
  home: { title: '首页', description: '加载中…' },
  research: { title: '研究', content: '' },
  papers: { title: '论文', items: [] },
  members: { title: '成员', list: [] },
  join: { title: '加入我们', content: '' },
};

const enableEditor = import.meta.env.VITE_ENABLE_EDITOR === 'true';

export function Home() {
  const [content, setContent] = useState<LabContent | null>(null);

  useEffect(() => {
    const url = `${import.meta.env.BASE_URL}content.json`;
    fetch(url)
      .then((res) => res.json())
      .then((data: LabContent) => setContent(data))
      .catch(() => setContent(defaultContent));
  }, []);

  if (!content) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-600">加载中…</p>
      </div>
    );
  }

  const { labName, labSubtitle, nav, home, research, papers, members, join } = content;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar navItems={nav} labName={labName} labSubtitle={labSubtitle} />

      <main className="mx-auto max-w-6xl px-4">
        <section id="home" className="scroll-mt-16 py-20">
          <div>
            <h1 className="text-3xl font-semibold text-slate-800">{home.title}</h1>
            <div className="mt-2 h-0.5 w-14 rounded-full bg-teal-500" aria-hidden />
          </div>
          <p className="mt-4 max-w-2xl text-slate-600 whitespace-pre-line">{home.description}</p>
          {enableEditor && (
            <Link
              to="/edit-lab-content"
              className="mt-4 inline-block text-sm text-teal-600 hover:text-teal-700 hover:underline"
            >
              编辑内容 →
            </Link>
          )}
        </section>

        <section id="research" className="scroll-mt-16 py-20">
          <SectionTitle>{research.title}</SectionTitle>
          <p className="mt-4 text-slate-600 whitespace-pre-line">{research.content}</p>
        </section>

        <section id="papers" className="scroll-mt-16 py-20">
          <SectionTitle>{papers.title}</SectionTitle>
          <ul className="mt-4 space-y-3">
            {papers.items.map((item, i) => (
              <li key={i} className="rounded-lg border border-slate-200 bg-white p-3 text-slate-700">
                <div className="font-medium">{item.title}</div>
                <div className="mt-1 text-sm text-slate-500">
                  {item.authors} · {item.year}
                  {item.url && (
                    <a href={item.url} target="_blank" rel="noreferrer" className="ml-2 text-teal-600 hover:underline">
                      链接
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section id="people" className="scroll-mt-16 py-20">
          <SectionTitle>{members.title}</SectionTitle>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {members.list.map((m, i) => (
              <div key={i} className="rounded-lg border border-slate-200 bg-white p-4">
                {m.image ? (
                  <img
                    src={m.image.startsWith('data:') ? m.image : m.image}
                    alt={m.name}
                    className="h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-teal-100 text-xl font-semibold text-teal-700">
                    {m.name.slice(0, 1)}
                  </div>
                )}
                <div className="mt-3 font-semibold text-slate-800">{m.name}</div>
                <div className="text-sm text-teal-600">{m.role}</div>
                {m.bio && <p className="mt-2 text-sm text-slate-600">{m.bio}</p>}
              </div>
            ))}
          </div>
        </section>

        <section id="join" className="scroll-mt-16 py-20">
          <SectionTitle>{join.title}</SectionTitle>
          <p className="mt-4 text-slate-600 whitespace-pre-line">{join.content}</p>
        </section>
      </main>
    </div>
  );
}
