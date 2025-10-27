import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight, common } from "lowlight";

// Initialize lowlight once
const lowlight = createLowlight(common);

/* Small toolbar button */
const Tb = ({ onClick, active, children, title }) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    className={
      "h-8 min-w-[2rem] px-2 rounded-md border text-sm " +
      (active
        ? "bg-neutral-200/70 dark:bg-neutral-700/70 border-neutral-300 dark:border-neutral-600"
        : "bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800")
    }
  >
    {children}
  </button>
);

const ContentEditor = ({ content = "<p></p>", onUpdate, label = "Content" }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // Use CodeBlockLowlight
        heading: { levels: [1, 2, 3] }, // Enable H1-H3
      }),
      Underline,
      Link.configure({ openOnClick: false }),
      Image.configure({ allowBase64: true, inline: true }),
      Placeholder.configure({
        placeholder: "Write something awesome...",
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: "javascript",
      }),
    ],
    content,
    onUpdate: ({ editor }) => onUpdate?.(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose max-w-none dark:prose-invert prose-neutral " +
          "min-h-[220px] rounded-md border border-neutral-200 bg-white p-3.5 text-sm " +
          "dark:border-neutral-800 dark:bg-neutral-900",
      },
    },
  });

  if (!editor) return null;

  const is = (name, opts = {}) => editor.isActive(name, opts);

  return (
    <section className="space-y-2">
      <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
        {label}
      </label>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-t-md">
        {/* Formatting */}
        <Tb title="Bold" active={is("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <span className="font-semibold">B</span>
        </Tb>
        <Tb title="Italic" active={is("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <span className="italic">I</span>
        </Tb>
        <Tb title="Underline" active={is("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <span className="underline">U</span>
        </Tb>
        <Tb title="Strike" active={is("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <span className="line-through">S</span>
        </Tb>

        <div className="mx-2 h-6 w-px bg-neutral-200 dark:bg-neutral-700" />

        {/* Lists */}
        <Tb title="Ordered list" active={is("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          1.
        </Tb>
        <Tb title="Bullet list" active={is("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          •
        </Tb>

        <div className="mx-2 h-6 w-px bg-neutral-200 dark:bg-neutral-700" />

        {/* Headings */}
        <Tb title="Heading 1" active={is("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
          H1
        </Tb>
        <Tb title="Heading 2" active={is("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </Tb>
        <Tb title="Heading 3" active={is("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          H3
        </Tb>

        <div className="mx-2 h-6 w-px bg-neutral-200 dark:bg-neutral-700" />

        {/* Align */}
        <Tb title="Align left" onClick={() => editor.chain().focus().setTextAlign("left").run()}>⟸</Tb>
        <Tb title="Align center" onClick={() => editor.chain().focus().setTextAlign("center").run()}>⟷</Tb>
        <Tb title="Align right" onClick={() => editor.chain().focus().setTextAlign("right").run()}>⟹</Tb>

        <div className="mx-2 h-6 w-px bg-neutral-200 dark:bg-neutral-700" />

        {/* Link/Image */}
        <Tb title="Link" active={is("link")} onClick={() => {
          const url = window.prompt("URL");
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }}>🔗</Tb>
        <Tb title="Image" onClick={() => {
          const url = window.prompt("Image URL");
          const alt = window.prompt("Alt text (optional)");
          if (url) editor.chain().focus().setImage({ src: url, alt: alt || "" }).run();
        }}>🖼️</Tb>

        <div className="mx-2 h-6 w-px bg-neutral-200 dark:bg-neutral-700" />

        {/* Code */}
        <Tb title="Code block" active={is("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          {"</>"}
        </Tb>

        <div className="mx-2 h-6 w-px bg-neutral-200 dark:bg-neutral-700" />

        {/* Undo/Redo */}
        <Tb title="Undo" onClick={() => editor.chain().focus().undo().run()}>↺</Tb>
        <Tb title="Redo" onClick={() => editor.chain().focus().redo().run()}>↻</Tb>
      </div>
      {/* Editor */}
      <EditorContent editor={editor} />
      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
        Tip: Use the toolbar to format text, insert links/images (via URL), and code blocks.
      </p>
    </section>
  );
};

export default ContentEditor;