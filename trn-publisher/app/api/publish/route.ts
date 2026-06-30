import { NextResponse } from 'next/server';
import { createDraft } from '@/lib/wordpress/client';
import { draftSchema } from '@/lib/validation/post';

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') ?? '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();

      const featuredImage = formData.get('featuredImage');

      const payload = {
        title: String(formData.get('title') ?? ''),
        excerpt: String(formData.get('excerpt') ?? ''),
        content: String(formData.get('content') ?? ''),
        categoryId: Number(formData.get('categoryId')),
        tags: String(formData.get('tags') ?? ''),
      };

      const parsed = draftSchema.safeParse(payload);

      if (!parsed.success) {
        return NextResponse.json(
          { error: parsed.error.errors[0]?.message ?? 'Formulario no válido.' },
          { status: 400 }
        );
      }

      const post = await createDraft(
        parsed.data,
        featuredImage instanceof File ? featuredImage : null
      );

      return NextResponse.json({ post });
    }

    const body = await request.json();
    const parsed = draftSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? 'Formulario no válido.' },
        { status: 400 }
      );
    }

    const post = await createDraft(parsed.data);
    return NextResponse.json({ post });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'No se pudo publicar el borrador.',
      },
      { status: 500 }
    );
  }
}