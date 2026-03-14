/// <reference types="vite/client" />
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { SectionTitle } from '../components/SectionTitle';
import { defaultContent, normalizeContent } from '../lib/content';
import type { LabContent } from '../types/content';

const enableEditor = import.meta.env.VITE_ENABLE_EDITOR === 'true';

function getAssetUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('data:') || path.startsWith('http')) return path;
  const base = import.meta.env.BASE_URL;
  return base + path.replace(/^\//, '');
}

const IMAGE_ERROR_PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%23e2e8f0"/%3E%3Ctext x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui" font-size="14" fill="%2394a3b8"%3E加载失败%3C/text%3E%3C/svg%3E';

export function Home() {
  const [content, setContent] = useState<LabContent | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [imageErrorMessages, setImageErrorMessages] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    const url = `${import.meta.env.BASE_URL}content.json`;
    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load content.json: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setContent(normalizeContent(data)))
      .catch(() => setContent(defaultContent));
  }, []);

  const rawVideoInput = useMemo(() => content?.home.videoUrl?.trim() ?? '', [content]);

  const videoUrl = useMemo(() => {
    if (!rawVideoInput) return '';

    const iframeSrcMatch = rawVideoInput.match(/<iframe[^>]*\ssrc=["']([^"']+)["'][^>]*>/i);
    const candidate = (iframeSrcMatch?.[1] ?? rawVideoInput).trim();

    if (candidate.startsWith('//')) {
      return `https:${candidate}`;
    }
    return candidate;
  }, [rawVideoInput]);

  const videoPoster = useMemo(() => content?.home.videoPoster?.trim() ?? '', [content]);
  const canShowVideo = useMemo(() => Boolean(videoUrl), [videoUrl]);
  const isYouTube = useMemo(() => videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be'), [videoUrl]);
  const isIFrameVideo = useMemo(() => isYouTube || videoUrl.includes('player.bilibili.com'), [isYouTube, videoUrl]);
  const embedUrl = useMemo(() => {
    if (!isIFrameVideo) return '';

    if (videoUrl.includes('player.bilibili.com')) {
      return videoUrl;
    }

    try {
      const url = new URL(videoUrl);
      const videoId = url.searchParams.get('v') || url.pathname.split('/').filter(Boolean).pop();
      if (!videoId) return '';
      return `https://www.youtube.com/embed/${videoId}`;
    } catch {
      return '';
    }
  }, [videoUrl, isIFrameVideo]);

  const handleImageLoadError = (imageId: string, imageUrl: string) => {
    setImageErrors((prev) => new Set([...prev, imageId]));
    setImageErrorMessages((prev) => new Map([...prev, [imageId, imageUrl]]));
  };

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
              {isIFrameVideo ? (
                <iframe
                  src={embedUrl}
                  className="h-[220px] w-full bg-black sm:h-[320px] md:h-[420px]"
                  loading="lazy"
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
          <div className="mt-8 space-y-12">
            {(research.items ?? []).map((item) => (
              <div key={item.id} className="flex flex-col items-center gap-6 md:flex-row md:gap-8">
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold text-slate-800">{item.title}</h3>
                  <p className="mt-3 text-slate-600 whitespace-pre-line leading-relaxed">{item.description}</p>
                </div>
                {item.image && (
                  <div className="flex-shrink-0 w-full md:w-80">
                    {imageErrors.has(`research-${item.id}`) ? (
                      <div className="relative">
                        <img
                          src={IMAGE_ERROR_PLACEHOLDER}
                          alt={item.title}
                          className="w-full rounded-lg object-cover shadow-md"
                        />
                        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/40">
                          <p className="text-sm text-white text-center px-2">
                            图片加载失败<br/>{item.image}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={getAssetUrl(item.image)}
                        alt={item.title}
                        className="w-full rounded-lg object-cover shadow-md"
                        onError={() => handleImageLoadError(`research-${item.id}`, item.image)}
                      />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section id="papers" className="scroll-mt-16 py-20">
          <SectionTitle>{papers.title}</SectionTitle>
          <ul className="mt-4 space-y-3">
            {(papers.items ?? []).map((item) => (
              <li key={item.id} className="rounded-lg border border-slate-200 bg-white p-3 text-slate-700">
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
            {(members.list ?? []).map((m) => (
              <div key={m.id} className="rounded-lg border border-slate-200 bg-white p-4">
                {m.image ? (
                  <div className="relative inline-block">
                    {imageErrors.has(`member-${m.id}`) ? (
                      <div className="relative">
                        <img
                          src={IMAGE_ERROR_PLACEHOLDER}
                          alt={m.name}
                          className="h-24 w-24 rounded-full object-cover"
                        />
                        <div className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                          ✕
                        </div>
                      </div>
                    ) : (
                      <img
                        src={getAssetUrl(m.image)}
                        alt={m.name}
                        className="h-24 w-24 rounded-full object-cover"
                        onError={() => handleImageLoadError(`member-${m.id}`, m.image)}
                      />
                    )}
                  </div>
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

      {canShowVideo && !isIFrameVideo && (
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
