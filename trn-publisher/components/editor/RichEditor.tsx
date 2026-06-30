'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';

type Props = {
  value: string;
  onChange: (html: string) => void;
};

export default function RichEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link,
      Placeholder.configure({
        placeholder: 'Pega o escribe aquí el artículo completo...',
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          'min-h-[420px] px-5 py-4 outline-none prose prose-slate max-w-none leading-7',
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className="rounded-lg px-3 py-1 text-sm font-semibold hover:bg-white">
          B
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className="rounded-lg px-3 py-1 text-sm italic hover:bg-white">
          I
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className="rounded-lg px-3 py-1 text-sm hover:bg-white">
          H2
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className="rounded-lg px-3 py-1 text-sm hover:bg-white">
          H3
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className="rounded-lg px-3 py-1 text-sm hover:bg-white">
          Lista
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className="rounded-lg px-3 py-1 text-sm hover:bg-white">
          Cita
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
