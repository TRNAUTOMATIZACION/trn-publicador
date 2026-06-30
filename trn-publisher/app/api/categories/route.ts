import { NextResponse } from 'next/server';
import { getCategories } from '@/lib/wordpress/client';

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'No se pudieron cargar las categorías.' },
      { status: 500 }
    );
  }
}
