import { z } from 'zod';

export const draftSchema = z.object({
  title: z.string().trim().min(5, 'El título debe tener al menos 5 caracteres.'),
  excerpt: z.string().trim().min(20, 'El extracto SEO debe tener al menos 20 caracteres.'),
  content: z.string().trim().min(80, 'El contenido debe tener al menos 80 caracteres.'),
  categoryId: z.coerce.number().int().positive('Selecciona una categoría.'),
  slug: z.string().trim().optional(),
  tags: z.string().optional().transform((value) =>
    (value ?? '')
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
  ),
});

export type DraftFormInput = z.input<typeof draftSchema>;
