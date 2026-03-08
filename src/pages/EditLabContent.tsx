import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { LabContent, MemberItem, PaperItem } from '../types/content';

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
  home: { title: '首页', description: '' },
  research: { title: '研究', content: '' },
  papers: { title: '论文', items: [] },
  members: { title: '成员', list: [] },
  join: { title: '加入我们', content: '' },
};

const SIDEBAR_SECTIONS = [
  { id: 'branding', label: '导航与名称' },
  { id: 'home', label: '首页' },
  { id: 'research', label: '研究' },
  { id: 'papers', label: '论文' },
  { id: 'people', label: '成员' },
  { id: 'join', label: '加入我们' },
];

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function EditLabContent() {
  const [content, setContent] = useState<LabContent>(defaultContent);
  const [activeSection, setActiveSection] = useState('branding');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/content.json')
      .then((res) => res.json())
      .then((data: LabContent) => {
        setContent(data);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const update = (partial: Partial<LabContent>) => {
    setContent((prev) => ({ ...prev, ...partial }));
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

  const addMember = () => {
    setContent((prev) => ({
      ...prev,
      members: {
        ...prev.members,
        list: [...prev.members.list, { name: '', role: '', image: '', bio: '' }],
      },
    }));
  };

  const removeMember = (index: number) => {
    setContent((prev) => ({
      ...prev,
      members: {
        ...prev.members,
        list: prev.members.list.filter((_, i) => i !== index),
      },
    }));
  };

  const updateMember = (index: number, field: keyof MemberItem, value: string) => {
    setContent((prev) => {
      const list = [...prev.members.list];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, members: { ...prev.members, list } };
    });
  };

  const onMemberImageFile = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await toBase64(file);
      updateMember(index, 'image', base64);
    } catch {
      alert('图片读取失败');
    }
    e.target.value = '';
  };

  const addPaper = () => {
    setContent((prev) => ({
      ...prev,
      papers: {
        ...prev.papers,
        items: [...prev.papers.items, { title: '', authors: '', year: '', url: '' }],
      },
    }));
  };

  const removePaper = (index: number) => {
    setContent((prev) => ({
      ...prev,
      papers: {
        ...prev.papers,
        items: prev.papers.items.filter((_, i) => i !== index),
      },
    }));
  };

  const updatePaper = (index: number, field: keyof PaperItem, value: string) => {
    setContent((prev) => {
      const items = [...prev.papers.items];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, papers: { ...prev.papers, items } };
    });
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
                  <label className="block text-sm font-medium text-slate-700">简介</label>
                  <textarea
                    value={content.home.description}
                    onChange={(e) => update({ home: { ...content.home, description: e.target.value } })}
                    rows={6}
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
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">标题</label>
                  <input
                    type="text"
                    value={content.research.title}
                    onChange={(e) => update({ research: { ...content.research, title: e.target.value } })}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">内容</label>
                  <textarea
                    value={content.research.content}
                    onChange={(e) => update({ research: { ...content.research, content: e.target.value } })}
                    rows={8}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>
            </section>
          )}

          {activeSection === 'papers' && (
            <section>
              <h2 className="text-lg font-semibold text-slate-800">论文</h2>
              <div className="mt-2 h-0.5 w-12 rounded-full bg-teal-500" />
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">板块标题</label>
                  <input
                    type="text"
                    value={content.papers.title}
                    onChange={(e) => update({ papers: { ...content.papers, title: e.target.value } })}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">论文列表</span>
                    <button
                      type="button"
                      onClick={addPaper}
                      className="rounded-md bg-teal-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-700"
                    >
                      添加一条
                    </button>
                  </div>
                  <ul className="mt-2 space-y-3">
                    {content.papers.items.map((item, i) => (
                      <li key={i} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => removePaper(i)}
                            className="text-sm text-red-600 hover:underline"
                          >
                            删除
                          </button>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2">
                          <input
                            placeholder="论文标题"
                            value={item.title}
                            onChange={(e) => updatePaper(i, 'title', e.target.value)}
                            className="rounded border border-slate-300 px-2 py-1.5 text-sm"
                          />
                          <input
                            placeholder="作者"
                            value={item.authors}
                            onChange={(e) => updatePaper(i, 'authors', e.target.value)}
                            className="rounded border border-slate-300 px-2 py-1.5 text-sm"
                          />
                          <input
                            placeholder="年份"
                            value={item.year}
                            onChange={(e) => updatePaper(i, 'year', e.target.value)}
                            className="rounded border border-slate-300 px-2 py-1.5 text-sm"
                          />
                          <input
                            placeholder="链接 URL"
                            value={item.url}
                            onChange={(e) => updatePaper(i, 'url', e.target.value)}
                            className="rounded border border-slate-300 px-2 py-1.5 text-sm"
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          )}

          {activeSection === 'people' && (
            <section>
              <h2 className="text-lg font-semibold text-slate-800">成员</h2>
              <div className="mt-2 h-0.5 w-12 rounded-full bg-teal-500" />
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">板块标题</label>
                  <input
                    type="text"
                    value={content.members.title}
                    onChange={(e) => update({ members: { ...content.members, title: e.target.value } })}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">成员列表</span>
                    <button
                      type="button"
                      onClick={addMember}
                      className="rounded-md bg-teal-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-700"
                    >
                      添加成员
                    </button>
                  </div>
                  <ul className="mt-2 space-y-4">
                    {content.members.list.map((m, i) => (
                      <li key={i} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => removeMember(i)}
                            className="text-sm text-red-600 hover:underline"
                          >
                            删除
                          </button>
                        </div>
                        <div className="flex gap-4">
                          <div className="shrink-0">
                            {m.image ? (
                              <img
                                src={m.image}
                                alt={m.name || '成员'}
                                className="h-20 w-20 rounded-full object-cover"
                              />
                            ) : (
                              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-100 text-teal-600">
                                暂无
                              </div>
                            )}
                            <div className="mt-2 flex flex-col gap-1">
                              <label className="text-xs text-slate-500">上传图片（Base64）</label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => onMemberImageFile(i, e)}
                                className="text-xs"
                              />
                              <span className="text-xs text-slate-500">或填写路径：</span>
                              <input
                                type="text"
                                placeholder="/images/xxx.jpg"
                                value={m.image.startsWith('data:') ? '' : m.image}
                                onChange={(e) => updateMember(i, 'image', e.target.value)}
                                className="rounded border border-slate-300 px-2 py-1 text-xs"
                              />
                            </div>
                          </div>
                          <div className="min-w-0 flex-1 space-y-2">
                            <input
                              placeholder="姓名"
                              value={m.name}
                              onChange={(e) => updateMember(i, 'name', e.target.value)}
                              className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                            />
                            <input
                              placeholder="职位/角色"
                              value={m.role}
                              onChange={(e) => updateMember(i, 'role', e.target.value)}
                              className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                            />
                            <textarea
                              placeholder="简介"
                              value={m.bio}
                              onChange={(e) => updateMember(i, 'bio', e.target.value)}
                              rows={2}
                              className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                            />
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
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
                    rows={6}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>
            </section>
          )}
        </div>
      </div>

      <div className="border-t border-slate-200 bg-white px-4 py-6">
        <div className="mx-auto max-w-6xl">
          <button
            type="button"
            onClick={handleExport}
            className="w-full rounded-lg bg-teal-600 px-4 py-3 font-semibold text-white shadow-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:w-auto sm:min-w-[280px]"
          >
            生成并下载配置文件 (content.json)
          </button>
          <p className="mt-2 text-sm text-slate-500">
            下载后可将 content.json 放入项目的 public 目录并替换原文件，刷新主页即可看到更新。
          </p>
        </div>
      </div>
    </div>
  );
}
