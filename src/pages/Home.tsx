/// <reference types="vite/client" />
import { useEffect, useMemo, useRef, useState } from 'react';
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
  home: { title: '首页', description: '加载中…', videoUrl: '', videoPoster: '' },
  research: { title: '研究', content: '' },
  papers: { title: '论文', items: [] },
  members: { title: '成员', list: [] },
  join: { title: '加入我们', content: '' },
};

const enableEditor = import.meta.env.VITE_ENABLE_EDITOR === 'true';

function normalizeContent(data: unknown): LabContent {
  const d = (data ?? {}) as Partial<LabContent>;
  return {
    ...defaultContent,
    ...d,
    nav: Array.isArray(d.nav) && d.nav.length > 0 ? d.nav : defaultContent.nav,
    home: { ...defaultContent.home, ...(d.home ?? {}) },
    research: { ...defaultContent.research, ...(d.research ?? {}) },
    papers: {
      ...defaultContent.papers,
      ...(d.papers ?? {}),
      items: Array.isArray(d.papers?.items) ? d.papers!.items : defaultContent.papers.items,
    },
    members: {
      ...defaultContent.members,
      ...(d.members ?? {}),
      list: Array.isArray(d.members?.list) ? d.members!.list : defaultContent.members.list,
    },
    join: { ...defaultContent.join, ...(d.join ?? {}) },
  };
}

export function Home() {
  const [content, setContent] = useState<LabContent | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const url = `${import.meta.env.BASE_URL}content.json`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => setContent(normalizeContent(data)))
      .catch(() => setContent(defaultContent));
  }, []);

  const videoUrl = useMemo(() => content?.home.videoUrl?.trim() ?? '', [content]);
  const videoPoster = useMemo(() => content?.home.videoPoster?.trim() ?? '', [content]);
  const canShowVideo = useMemo(() => Boolean(videoUrl), [videoUrl]);
  const isYouTube = useMemo(() => videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be'), [videoUrl]);
  const embedUrl = useMemo(() => {
    if (!isYouTube) return '';
    try {
      const url = new URL(videoUrl);
      const videoId = url.searchParams.get('v') || url.pathname.split('/').pop();
      return `https://www.youtube.com/embed/${videoId}`;
    } catch {
      return '';
    }
  }, [videoUrl, isYouTube]);

  if (!content) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-600">加载中…</p>
      </div>
    );
  }

  const { labName, labSubtitle, nav, home, research, papers, members, join } = content;

  const togglePlay = async () => {
    const el = videoRef.current;
    if (!el) return;
    try {
      if (el.paused) {
        await el.play();
        setIsPlaying(true);
      } else {
        el.pause();
        setIsPlaying(false);
      }
    } catch {
      // autoplay / play() 可能被浏览器策略阻止，保持按钮可再次尝试
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar navItems={nav} labName={labName} labSubtitle={labSubtitle} />

      {canShowVideo && (
        <section className="mx-auto max-w-6xl px-4 pt-6">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="relative">
              {isYouTube ? (
                <iframe
                  src={embedUrl}
                  className="h-[220px] w-full bg-black sm:h-[320px] md:h-[420px]"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Lab Video"
                />
              ) : (
                <video
                  ref={videoRef}
                  className="h-[220px] w-full bg-black object-cover sm:h-[320px] md:h-[420px]"
                  src={videoUrl}
                  poster={videoPoster || undefined}
                  preload="metadata"
                  playsInline
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                />
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
            </div>
          </div>
        </section>
      )}

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
            {(papers.items ?? []).map((item, i) => (
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
            {(members.list ?? []).map((m, i) => (
              <div key={i} className="rounded-lg border border-slate-200 bg-white p-4">
                {m.image ? (
                  <img
                    src={m.image}
                    alt={m.name}
                    className="h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-teal-100 text-xl font-semibold text-teal-700">
                    {(m.name ?? '').slice(0, 1)}
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

      {canShowVideo && !isYouTube && (
        <button
          type="button"
          onClick={togglePlay}
          className="fixed bottom-6 right-6 z-50 rounded-full bg-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2"
          aria-label={isPlaying ? '暂停视频' : '播放视频'}
        >
          {isPlaying ? '暂停' : '播放'}
        </button>
      )}
    </div>
  );
}
