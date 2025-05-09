"use client";

import { useRef, useMemo } from "react";
import dynamic from "next/dynamic";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function JoditEditorWrapper({ value, onChange }: Props) {
  const editor = useRef(null);

  const config = useMemo(
    () => ({
      readonly: false,
      toolbarAdaptive: false,
      toolbarSticky: false,
      height: 300,
      buttons: [
        "source",
        "|",
        "font",
        "fontsize",
        "bold",
        "italic",
        "underline",
        "|",
        "brush",
        "paragraph",
        "align",
        "|",
        "ul",
        "ol",
        "outdent",
        "indent",
        "|",
        "link",
        "image",
        "video",
        "|",
        "hr",
        "undo",
        "redo",
        "eraser",
      ],
      style: {
        font: true,
      },
      font: {
        fontSize: true,
        fontFamily: true,
      },
      controls: {
        font: {
          list: {
            Arial: "Arial",
            Georgia: "Georgia",
            Impact: "Impact",
            Tahoma: "Tahoma",
            "Times New Roman": "Times New Roman",
            Verdana: "Verdana",
          },
        },
      },
    }),
    []
  );

  return (
    <JoditEditor
      ref={editor}
      value={value}
      config={config}
      onBlur={(newContent) => onChange(newContent)}
    />
  );
}
