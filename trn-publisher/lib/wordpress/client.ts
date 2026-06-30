import type { CreatedPost, DraftPayload, WordPressCategory } from '@/types/wordpress';

function getConfig() {
  const siteUrl = process.env.WP_URL?.replace(/\/$/, '');
  const secret = process.env.TRN_PUBLISHER_SECRET;

  if (!siteUrl || !secret) {
    throw new Error('Faltan variables de entorno: WP_URL o TRN_PUBLISHER_SECRET.');
  }

  return { siteUrl, secret };
}

async function wpFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { siteUrl } = getConfig();

  const response = await fetch(`${siteUrl}/wp-json/wp/v2${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
    cache: 'no-store',
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.message ?? `Error de WordPress (${response.status})`;
    throw new Error(message);
  }

  return data as T;
}

async function trnPublisherFetch<T>(path: string, formData: FormData): Promise<T> {
  const { siteUrl, secret } = getConfig();

  const response = await fetch(`${siteUrl}/wp-json/trn-publisher/v1${path}`, {
    method: 'POST',
    headers: {
      'x-trn-secret': secret,
    },
    body: formData,
    cache: 'no-store',
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.message ?? `Error de TRN Publisher API (${response.status})`;
    throw new Error(message);
  }

  return data as T;
}

export async function getCategories(): Promise<WordPressCategory[]> {
  return wpFetch<WordPressCategory[]>('/categories?per_page=100&orderby=name&order=asc');
}

export async function createDraft(
  payload: DraftPayload,
  featuredImage?: File | null
): Promise<CreatedPost> {
  const formData = new FormData();

  formData.append('title', payload.title);
  formData.append('excerpt', payload.excerpt);
  formData.append('content', payload.content);
  formData.append('categoryId', String(payload.categoryId));
  formData.append('tags', payload.tags.join(','));
  formData.append('slug', payload.slug ?? '');

  if (featuredImage && featuredImage.size > 0) {
    formData.append('featuredImage', featuredImage);
  }

  return trnPublisherFetch<CreatedPost>('/draft', formData);
}