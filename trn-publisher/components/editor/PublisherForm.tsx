'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import RichEditor from '@/components/editor/RichEditor';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import type { WordPressCategory } from '@/types/wordpress';

type Status = {
  type: 'idle' | 'loading' | 'success' | 'error';
  message: string;
  link?: string;
};

function getWordCountFromHtml(html: string) {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ');
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function generateSlug(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function PublisherForm() {
  const [categories, setCategories] = useState<WordPressCategory[]>([]);
  const [status, setStatus] = useState<Status>({ type: 'idle', message: '' });
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [featuredImagePreview, setFeaturedImagePreview] = useState<string | null>(null);
  const [featuredImageName, setFeaturedImageName] = useState('');

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data.categories ?? []))
      .catch(() =>
        setStatus({
          type: 'error',
          message: 'No se pudieron cargar las categorías.',
        })
      );
  }, []);

  const wordCount = useMemo(() => getWordCountFromHtml(content), [content]);

  function handleFeaturedImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      setFeaturedImagePreview(null);
      setFeaturedImageName('');
      return;
    }

    setFeaturedImageName(file.name);
    setFeaturedImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setStatus({
      type: 'loading',
      message: 'Creando borrador en WordPress...',
    });

    const formData = new FormData(event.currentTarget);
    const publishFormData = new FormData();

    publishFormData.append('title', title);
    publishFormData.append('excerpt', String(formData.get('excerpt') ?? ''));
    publishFormData.append('content', content);
    publishFormData.append('categoryId', String(formData.get('categoryId') ?? ''));
    publishFormData.append('tags', String(formData.get('tags') ?? ''));
    publishFormData.append('slug', slug);

    const featuredImage = formData.get('featuredImage');

    if (featuredImage instanceof File && featuredImage.size > 0) {
      publishFormData.append('featuredImage', featuredImage);
    }

    const response = await fetch('/api/publish', {
      method: 'POST',
      body: publishFormData,
    });

    const data = await response.json();

    if (!response.ok) {
      setStatus({
        type: 'error',
        message: data.error ?? 'No se pudo crear el borrador.',
      });
      return;
    }

    setStatus({
      type: 'success',
      message: 'Borrador creado correctamente.',
      link: data.post?.link,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-7 rounded-3xl bg-white p-6 shadow-soft ring-1 ring-slate-200 md:p-8"
    >
      <div className="grid gap-6 md:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Field label="Título">
            <input
              name="title"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setSlug(generateSlug(event.target.value));
              }}
              className="w-full rounded-2xl border-slate-200 px-4 py-3 text-lg font-semibold shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Los pueblos andaluces con más encanto..."
            />
          </Field>

          <Field
            label="Extracto SEO"
            hint="Resumen breve que irá como extracto del borrador."
          >
            <textarea
              name="excerpt"
              rows={3}
              className="w-full rounded-2xl border-slate-200 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Escribe un extracto atractivo para buscadores y redes sociales."
            />
          </Field>

          <Field
            label="Slug"
            hint="Puedes modificar la URL del artículo antes de publicarlo."
          >
            <input
              name="slug"
              value={slug}
              onChange={(event) => setSlug(generateSlug(event.target.value))}
              className="w-full rounded-2xl border-slate-200 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="url-del-articulo"
            />
          </Field>

          <Field label="Contenido">
            <RichEditor value={content} onChange={setContent} />
          </Field>
        </div>

        <aside className="space-y-6 rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200">
          <Field
            label="Imagen destacada"
            hint="Se subirá a WordPress y quedará asignada al borrador."
          >
            <label className="block cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 bg-white p-4 text-center transition hover:border-blue-400 hover:bg-blue-50">
              {featuredImagePreview ? (
                <img
                  src={featuredImagePreview}
                  alt="Vista previa de imagen destacada"
                  className="mb-3 h-40 w-full rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-40 items-center justify-center rounded-xl bg-slate-100 text-sm text-slate-500">
                  Seleccionar imagen
                </div>
              )}

              <span className="text-sm font-semibold text-blue-700">
                {featuredImageName || 'Elegir archivo'}
              </span>

              <input
                name="featuredImage"
                type="file"
                accept="image/*"
                onChange={handleFeaturedImageChange}
                className="hidden"
              />
            </label>
          </Field>

          <Field label="Categoría">
            <select
              name="categoryId"
              className="w-full rounded-xl border-slate-200 px-3 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Selecciona categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Etiquetas" hint="Separadas por comas. Si no existen, se crearán.">
            <input
              name="tags"
              className="w-full rounded-xl border-slate-200 px-3 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Andalucía, turismo, pueblos"
            />
          </Field>

          <div className="rounded-2xl bg-white p-4 text-sm text-slate-600 ring-1 ring-slate-200">
            <p className="font-semibold text-slate-900">Resumen</p>
            <p>{wordCount} palabras</p>
            <p>{Math.max(1, Math.ceil(wordCount / 220))} min de lectura</p>
            <p>{slug ? `Slug: ${slug}` : 'Sin slug'}</p>
            <p>
              {featuredImageName
                ? 'Imagen destacada seleccionada'
                : 'Sin imagen destacada'}
            </p>
          </div>

          <Button
            type="submit"
            disabled={status.type === 'loading'}
            className="w-full"
          >
            {status.type === 'loading'
              ? 'Publicando...'
              : 'Publicar como borrador'}
          </Button>
        </aside>
      </div>

      {status.message ? (
        <div
          className={
            status.type === 'error'
              ? 'rounded-2xl bg-red-50 p-4 text-sm text-red-700'
              : 'rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700'
          }
        >
          {status.message}{' '}
          {status.link ? (
            <a
              className="font-semibold underline"
              href={status.link}
              target="_blank"
            >
              Abrir borrador
            </a>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}