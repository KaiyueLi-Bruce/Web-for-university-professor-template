import type { LabContent, MemberItem, PaperItem, ResearchItem } from '../types/content';

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

/**
 * Creates a normalizer factory for handling partial item objects
 * Ensures all required fields have default values
 */
function createNormalizer<T extends { id?: string }>(
  fieldDefaults: Record<string, any>,
  idPrefix: string
): (item: Partial<T>, index: number) => T {
  return (item: Partial<T>, index: number): T => {
    const result: any = { ...fieldDefaults, ...item };
    if (!result.id || !result.id.trim?.()) {
      result.id = `${idPrefix}-${index + 1}`;
    } else {
      result.id = result.id.trim();
    }
    return result as T;
  };
}

const normalizePaper = createNormalizer<PaperItem>(
  { title: '', authors: '', year: '', url: '' },
  'paper'
);

const normalizeMember = createNormalizer<MemberItem>(
  { name: '', role: '', image: '', bio: '' },
  'member'
);

const normalizeResearch = createNormalizer<ResearchItem>(
  { title: '', description: '', image: '' },
  'research'
);

export function normalizeContent(data: unknown): LabContent {
  const d = (data ?? {}) as Partial<LabContent>;
  const papersItems = Array.isArray(d.papers?.items)
    ? d.papers.items.map((item, index) => normalizePaper(item as Partial<PaperItem>, index))
    : defaultContent.papers.items;
  const membersList = Array.isArray(d.members?.list)
    ? d.members.list.map((item, index) => normalizeMember(item as Partial<MemberItem>, index))
    : defaultContent.members.list;
  const researchItems = Array.isArray(d.research?.items)
    ? d.research.items.map((item, index) => normalizeResearch(item as Partial<ResearchItem>, index))
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
