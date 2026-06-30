export type WordPressCategory = {
  id: number;
  name: string;
  slug: string;
  count?: number;
};

export type DraftPayload = {
  title: string;
  excerpt: string;
  content: string;
  categoryId: number;
  tags: string[];
};

export type CreatedPost = {
  id: number;
  link: string;
  status: string;
  title?: { rendered: string };
};
