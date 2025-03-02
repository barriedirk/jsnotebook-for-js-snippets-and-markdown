import "./CodeEditor.css";
import "./syntax.css";

import { useRef } from "react";

import MonacoEditor, { OnChange, OnMount } from "@monaco-editor/react";

import prettier from "prettier/standalone";
import parserBabel from "prettier/plugins/babel";
import estreeParser from "prettier/plugins/estree";

import codeShift from "jscodeshift";
import Highlighter from "monaco-jsx-highlighter";

interface CodeEditorProps {
  initialValue: string;
  onChange(value: string): void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ onChange, initialValue }) => {
  const editorRef = useRef<any>(undefined);

  const onMountEditor: OnMount = (editor) => {
    editorRef.current = editor;

    // @todo, fix issue with those libraries used inside of the try
    try {
      const highlighter = new Highlighter(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        window.monaco,
        codeShift,
        editor,
      );

      highlighter.highLightOnDidChangeModelContent(100);
      highlighter.addJSXCommentCommand();
      // highlighter.highLightOnDidChangeModelContent(
      //   () => {},
      //   () => {},
      //   undefined,
      //   () => {},
      // );
    } catch (err) {
      console.error(err);
    }
  };

  const onChangeEditor: OnChange = (value) => {
    onChange(value ?? "");
  };

  const onFormatClick = async () => {
    if (!editorRef.current) return;

    try {
      const unformatted = editorRef.current.getModel().getValue();

      const formatted = await prettier
        .format(unformatted, {
          parser: "babel",
          plugins: [parserBabel, estreeParser],
          useTabs: false,
          semi: true,
          singleQuote: true,
        })
        .then((value) => value.replace(/\n$/, ""));

      editorRef.current.setValue(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="editor-wrapper">
      <button
        className="button button-format is-primary is-small"
        onClick={onFormatClick}
      >
        Format
      </button>
      <MonacoEditor
        onChange={onChangeEditor}
        value={initialValue}
        theme="vs-dark"
        language="javascript"
        height="100%"
        onMount={onMountEditor}
        options={{
          wordWrap: "on",
          minimap: { enabled: false },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
        }}
      />
    </div>
  );
};

export default CodeEditor;
