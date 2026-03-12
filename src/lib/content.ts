import type { LabContent, MemberItem, PaperItem } from '../types/content';

export const defaultContent: LabContent = {
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
  research: { title: '研究', items: [] },
  papers: { title: '论文', items: [] },
  members: { title: '成员', list: [] },
  join: { title: '加入我们', content: '' },
};

export function createStableId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizePaper(item: Partial<PaperItem>, index: number): PaperItem {
  return {
    id: item.id?.trim() || `paper-${index + 1}`,
    title: item.title ?? '',
    authors: item.authors ?? '',
    year: item.year ?? '',
    url: item.url ?? '',
  };
}

function normalizeMember(item: Partial<MemberItem>, index: number): MemberItem {
  return {
    id: item.id?.trim() || `member-${index + 1}`,
    name: item.name ?? '',
    role: item.role ?? '',
    image: item.image ?? '',
    bio: item.bio ?? '',
  };
}

function normalizeResearch(item: Partial<any>, index: number): any {
  return {
    id: item.id?.trim() || `research-${index + 1}`,
    title: item.title ?? '',
    description: item.description ?? '',
    image: item.image ?? '',
  };
}

export function normalizeContent(data: unknown): LabContent {
  const d = (data ?? {}) as Partial<LabContent>;
  const papersItems = Array.isArray(d.papers?.items)
    ? d.papers.items.map((item, index) => normalizePaper(item, index))
    : defaultContent.papers.items;
  const membersList = Array.isArray(d.members?.list)
    ? d.members.list.map((item, index) => normalizeMember(item, index))
    : defaultContent.members.list;
  const researchItems = Array.isArray(d.research?.items)
    ? d.research.items.map((item, index) => normalizeResearch(item, index))
    : defaultContent.research.items;

  return {
    ...defaultContent,
    ...d,
    nav: Array.isArray(d.nav) && d.nav.length > 0 ? d.nav : defaultContent.nav,
    home: { ...defaultContent.home, ...(d.home ?? {}) },
    research: {
      ...defaultContent.research,
      ...(d.research ?? {}),
      items: researchItems,
    },
    papers: {
      ...defaultContent.papers,
      ...(d.papers ?? {}),
      items: papersItems,
    },
    members: {
      ...defaultContent.members,
      ...(d.members ?? {}),
      list: membersList,
    },
    join: { ...defaultContent.join, ...(d.join ?? {}) },
  };
}