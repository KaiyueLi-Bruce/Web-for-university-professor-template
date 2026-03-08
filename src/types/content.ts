export interface NavItem {
  id: string;
  label: string;
}

export interface HomeContent {
  title: string;
  description: string;
}

export interface ResearchContent {
  title: string;
  content: string;
}

export interface PaperItem {
  title: string;
  authors: string;
  year: string;
  url: string;
}

export interface PapersContent {
  title: string;
  items: PaperItem[];
}

export interface MemberItem {
  name: string;
  role: string;
  image: string;
  bio: string;
}

export interface MembersContent {
  title: string;
  list: MemberItem[];
}

export interface JoinContent {
  title: string;
  content: string;
}

export interface LabContent {
  labName: string;
  labSubtitle: string;
  nav: NavItem[];
  home: HomeContent;
  research: ResearchContent;
  papers: PapersContent;
  members: MembersContent;
  join: JoinContent;
}
