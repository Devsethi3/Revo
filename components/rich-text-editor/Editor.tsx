"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import { editorExtensions } from "./extensions";
import Menubar from "./Menubar";
import { ReactNode } from "react";

interface RichTextEditorProps {
  field: any;
  sendButton: ReactNode;
  footerLeft?: ReactNode;
}

const RichTextEditor = ({
  field,
  sendButton,
  footerLeft,
}: RichTextEditorProps) => {
  const editor = useEditor({
    immediatelyRender: false,
    content: (() => {
      if (!field?.value) return "";

      try {
        return JSON.parse(field.value);
      } catch (error) {
        return "";
      }
    })(),
    onUpdate: ({ editor }) => {
      if (field.onChange) {
        field.onChange(JSON.stringify(editor.getJSON()));
      }
    },
    extensions: editorExtensions,
    editorProps: {
      attributes: {
        class:
          "max-w-none min-h-[80px] sm:min-h-[100px] md:min-h-[125px] focus:outline-none p-2.5 sm:p-3 md:p-4 prose prose-sm sm:prose-base dark:prose-invert w-full marker:text-primary",
      },
    },
  });

  return (
    <>
      <div className="relative w-full border border-input rounded-lg overflow-hidden dark:bg-input/30 flex flex-col">
        <Menubar editor={editor} />
        <EditorContent
          editor={editor}
          className="max-h-[150px] sm:max-h-[175px] md:max-h-[200px] overflow-y-auto"
        />

        <div className="flex items-center justify-between gap-2 px-2 sm:px-3 py-1.5 sm:py-2 border-t border-input bg-card">
          <div className="min-h-7 sm:min-h-8 flex items-center overflow-hidden">
            {footerLeft}
          </div>
          <div className="shrink-0">{sendButton}</div>
        </div>
      </div>
    </>
  );
};

export default RichTextEditor;