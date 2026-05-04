import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createStableId, defaultContent, normalizeContent } from '../lib/content';
import { getAssetUrl, IMAGE_ERROR_PLACEHOLDER, toBase64 } from '../utils/common';
import { useListManager } from '../hooks/useListManager';
import type { LabContent, MemberItem, PaperItem, ResearchItem } from '../types/content';

const SIDEBAR_SECTIONS = [
  { id: 'branding', label: '导航与名称' },
  { id: 'home', label: '首页' },
  { id: 'research', label: '研究' },
  { id: 'papers', label: '论文' },
  { id: 'people', label: '成员' },
  { id: 'join', label: '加入我们' },
];

export function EditLabContent() {
  const [content, setContent] = useState<LabContent>(defaultContent);
  const [activeSection, setActiveSection] = useState('branding');
  const [loaded, setLoaded] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [imageLoadErrors, setImageLoadErrors] = useState<Map<string, string>>(new Map());

  const members = useListManager<MemberItem>(
    content.members.list,
    'member',
    () => ({ id: '', name: '', role: '', image: '', bio: '' })
  );

  const papers = useListManager<PaperItem>(
    content.papers.items,
    'paper',
    () => ({ id: '', title: '', authors: '', year: '', url: '' })
  );

  const research = useListManager<ResearchItem>(
    content.research.items,
    'research',
    () => ({ id: '', title: '', description: '', image: '' })
  );

  useEffect(() => {
    const url = `${import.meta.env.BASE_URL}content.json`;
    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load content.json: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setContent(normalizeContent(data));
        setLoaded(true);
      })
      .catch(() => {
        setContent(defaultContent);
        setLoaded(true);
      });
  }, []);

  // Sync list managers when content changes
  useEffect(() => {
    members.setItems(content.members.list);
  }, [content.members.list]);

  useEffect(() => {
    papers.setItems(content.papers.items);
  }, [content.papers.items]);

  useEffect(() => {
    research.setItems(content.research.items);
  }, [content.research.items]);

  const update = (partial: Partial<LabContent>) => {
    setContent((prev) => ({ ...prev, ...partial }));
  };

  const handleImageLoadError = (imageId: string, imageUrl: string) => {
    setImageErrors((prev) => new Set([...prev, imageId]));
    setImageLoadErrors((prev) => new Map([...prev, [imageId, imageUrl]]));
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const onMemberImageFile = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await toBase64(file);
      members.updateItem(index, { image: base64 } as Partial<MemberItem>);
      setImageErrors((prev) => {
        const updated = new Set(prev);
        updated.delete(`member-${index}`);
        return updated;
      });
      setImageLoadErrors((prev) => {
        const updated = new Map(prev);
        updated.delete(`member-${index}`);
        return updated;
      });
    } catch {
      alert('图片读取失败');
    }
    e.target.value = '';
  };

  const onResearchImageFile = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await toBase64(file);
      research.updateItem(index, { image: base64 } as Partial<ResearchItem>);
      setImageErrors((prev) => {
        const updated = new Set(prev);
        updated.delete(`research-${index}`);
        return updated;
      });
      setImageLoadErrors((prev) => {
        const updated = new Map(prev);
        updated.delete(`research-${index}`);
        return updated;
      });
    } catch {
      alert('图片读取失败');
    }
    e.target.value = '';
  };

  const syncListsToContent = () => {
    setContent((prev) => ({
      ...prev,
      members: { ...prev.members, list: members.items },
      papers: { ...prev.papers, items: papers.items },
      research: { ...prev.research, items: research.items },
    }));
  };

  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-slate-600">加载中…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-teal-600 hover:text-teal-700 hover:underline">
              ← 返回主页
            </Link>
            <span className="text-slate-400">|</span>
            <span className="font-semibold text-slate-800">实验室内容编辑</span>
          </div>
          <button
            type="button"
            onClick={() => {
              syncListsToContent();
              handleExport();
            }}
            className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 transition"
          >
            导出内容.json
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-6 px-4 py-6">
        <aside className="w-52 shrink-0">
          <nav className="sticky top-24 flex flex-col gap-0.5 rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
            {SIDEBAR_SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveSection(s.id)}
                className={`
                  rounded-md px-3 py-2 text-left text-sm font-medium transition-colors
                  ${activeSection === s.id ? 'bg-teal-600 text-white' : 'text-slate-700 hover:bg-slate-100'}
                `}
              >
                {s.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          {activeSection === 'branding' && (
            <section>
              <h2 className="text-lg font-semibold text-slate-800">导航与实验室名称</h2>
              <div className="mt-2 h-0.5 w-12 rounded-full bg-teal-500" />
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">实验室名称</label>
                  <input
                    type="text"
                    value={content.labName}
                    onChange={(e) => update({ labName: e.target.value })}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">副标题（如英文名）</label>
                  <input
                    type="text"
                    value={content.labSubtitle}
                    onChange={(e) => update({ labSubtitle: e.target.value })}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>
            </section>
          )}

          {activeSection === 'home' && (
            <section>
              <h2 className="text-lg font-semibold text-slate-800">首页</h2>
              <div className="mt-2 h-0.5 w-12 rounded-full bg-teal-500" />
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">标题</label>
                  <input
                    type="text"
                    value={content.home.title}
                    onChange={(e) => update({ home: { ...content.home, title: e.target.value } })}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">描述</label>
                  <textarea
                    value={content.home.description}
                    onChange={(e) => update({ home: { ...content.home, description: e.target.value } })}
                    className="mt-1 h-24 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">视频URL或iframe代码</label>
                  <textarea
                    value={content.home.videoUrl}
                    onChange={(e) => update({ home: { ...content.home, videoUrl: e.target.value } })}
                    className="mt-1 h-20 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">视频封面URL</label>
                  <input
                    type="text"
                    value={content.home.videoPoster}
                    onChange={(e) => update({ home: { ...content.home, videoPoster: e.target.value } })}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>
            </section>
          )}

          {activeSection === 'research' && (
            <section>
              <h2 className="text-lg font-semibold text-slate-800">研究</h2>
              <div className="mt-2 h-0.5 w-12 rounded-full bg-teal-500" />
              <button
                type="button"
                onClick={() => {
                  research.addItem();
                  setContent((prev) => ({
                    ...prev,
                    research: { ...prev.research, items: [...research.items, { id: '', title: '', description: '', image: '' }] },
                  }));
                }}
                className="mt-4 rounded-md bg-teal-600 px-3 py-2 text-sm font-medium text-white hover:bg-teal-700 transition"
              >
                + 添加研究项目
              </button>
              <div className="mt-6 space-y-6">
                {research.items.map((item, idx) => (
                  <div key={item.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <input
                      type="text"
                      value={item.title}
                      placeholder="标题"
                      onChange={(e) => research.updateItem(idx, { title: e.target.value } as Partial<ResearchItem>)}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                    <textarea
                      value={item.description}
                      placeholder="描述"
                      onChange={(e) => research.updateItem(idx, { description: e.target.value } as Partial<ResearchItem>)}
                      className="mt-2 h-20 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                    <input
                      type="text"
                      value={item.image}
                      placeholder="图片URL或base64"
                      onChange={(e) => research.updateItem(idx, { image: e.target.value } as Partial<ResearchItem>)}
                      className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                    <div className="mt-2 flex gap-2">
                      <label className="flex cursor-pointer items-center gap-2 rounded-md bg-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-300 transition">
                        <span>上传图片</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => onResearchImageFile(idx, e)}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          research.removeItem(idx);
                          setContent((prev) => ({
                            ...prev,
                            research: { ...prev.research, items: prev.research.items.filter((_, i) => i !== idx) },
                          }));
                        }}
                        className="rounded-md bg-red-100 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-200 transition"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeSection === 'papers' && (
            <section>
              <h2 className="text-lg font-semibold text-slate-800">论文</h2>
              <div className="mt-2 h-0.5 w-12 rounded-full bg-teal-500" />
              <button
                type="button"
                onClick={() => {
                  papers.addItem();
                  setContent((prev) => ({
                    ...prev,
                    papers: { ...prev.papers, items: [...papers.items, { id: '', title: '', authors: '', year: '', url: '' }] },
                  }));
                }}
                className="mt-4 rounded-md bg-teal-600 px-3 py-2 text-sm font-medium text-white hover:bg-teal-700 transition"
              >
                + 添加论文
              </button>
              <div className="mt-6 space-y-4">
                {papers.items.map((item, idx) => (
                  <div key={item.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <input
                      type="text"
                      value={item.title}
                      placeholder="论文标题"
                      onChange={(e) => papers.updateItem(idx, { title: e.target.value } as Partial<PaperItem>)}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                    <input
                      type="text"
                      value={item.authors}
                      placeholder="作者"
                      onChange={(e) => papers.updateItem(idx, { authors: e.target.value } as Partial<PaperItem>)}
                      className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                    <input
                      type="text"
                      value={item.year}
                      placeholder="年份"
                      onChange={(e) => papers.updateItem(idx, { year: e.target.value } as Partial<PaperItem>)}
                      className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                    <input
                      type="url"
                      value={item.url}
                      placeholder="论文链接URL"
                      onChange={(e) => papers.updateItem(idx, { url: e.target.value } as Partial<PaperItem>)}
                      className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        papers.removeItem(idx);
                        setContent((prev) => ({
                          ...prev,
                          papers: { ...prev.papers, items: prev.papers.items.filter((_, i) => i !== idx) },
                        }));
                      }}
                      className="mt-3 rounded-md bg-red-100 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-200 transition"
                    >
                      删除
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeSection === 'people' && (
            <section>
              <h2 className="text-lg font-semibold text-slate-800">成员</h2>
              <div className="mt-2 h-0.5 w-12 rounded-full bg-teal-500" />
              <button
                type="button"
                onClick={() => {
                  members.addItem();
                  setContent((prev) => ({
                    ...prev,
                    members: { ...prev.members, list: [...members.items, { id: '', name: '', role: '', image: '', bio: '' }] },
                  }));
                }}
                className="mt-4 rounded-md bg-teal-600 px-3 py-2 text-sm font-medium text-white hover:bg-teal-700 transition"
              >
                + 添加成员
              </button>
              <div className="mt-6 space-y-4">
                {members.items.map((item, idx) => (
                  <div key={item.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <input
                      type="text"
                      value={item.name}
                      placeholder="姓名"
                      onChange={(e) => members.updateItem(idx, { name: e.target.value } as Partial<MemberItem>)}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                    <input
                      type="text"
                      value={item.role}
                      placeholder="职位/角色"
                      onChange={(e) => members.updateItem(idx, { role: e.target.value } as Partial<MemberItem>)}
                      className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                    <textarea
                      value={item.bio}
                      placeholder="个人简介"
                      onChange={(e) => members.updateItem(idx, { bio: e.target.value } as Partial<MemberItem>)}
                      className="mt-2 h-16 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                    <input
                      type="text"
                      value={item.image}
                      placeholder="头像URL或base64"
                      onChange={(e) => members.updateItem(idx, { image: e.target.value } as Partial<MemberItem>)}
                      className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                    <div className="mt-2 flex gap-2">
                      <label className="flex cursor-pointer items-center gap-2 rounded-md bg-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-300 transition">
                        <span>上传头像</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => onMemberImageFile(idx, e)}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          members.removeItem(idx);
                          setContent((prev) => ({
                            ...prev,
                            members: { ...prev.members, list: prev.members.list.filter((_, i) => i !== idx) },
                          }));
                        }}
                        className="rounded-md bg-red-100 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-200 transition"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeSection === 'join' && (
            <section>
              <h2 className="text-lg font-semibold text-slate-800">加入我们</h2>
              <div className="mt-2 h-0.5 w-12 rounded-full bg-teal-500" />
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">标题</label>
                  <input
                    type="text"
                    value={content.join.title}
                    onChange={(e) => update({ join: { ...content.join, title: e.target.value } })}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">内容</label>
                  <textarea
                    value={content.join.content}
                    onChange={(e) => update({ join: { ...content.join, content: e.target.value } })}
                    className="mt-1 h-32 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
