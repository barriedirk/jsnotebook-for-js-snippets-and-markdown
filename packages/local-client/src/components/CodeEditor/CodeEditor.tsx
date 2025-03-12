import "./CodeEditor.css";
import "./syntax.css";

import { useRef } from "react";

/* Note:
 * I have installed monaco-editor, only to get this property and using
 * correctly the typing, if you don't case about using <any>
 * in const editorRef = useRef<any>, you don't need to install this packages
 */
import { editor } from "monaco-editor";
import MonacoEditor, { OnChange, OnMount } from "@monaco-editor/react";

import prettier from "prettier/standalone";
import parserBabel from "prettier/plugins/babel";
import estreeParser from "prettier/plugins/estree";

const options: editor.IStandaloneEditorConstructionOptions = {
  wordWrap: "on",
  minimap: { enabled: false },
  showUnused: false,
  folding: false,
  lineNumbersMinChars: 3,
  fontSize: 16,
  scrollBeyondLastLine: false,
  automaticLayout: true,
  tabSize: 2,
};

interface CodeEditorProps {
  initialValue: string;
  onChange(value: string): void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ onChange, initialValue }) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(undefined);

  const onMountEditor: OnMount = (
    editor: editor.IStandaloneCodeEditor,
    monaco: typeof import("monaco-editor"),
  ) => {
    editorRef.current = editor;

    try {
      const model = editor.getModel();

      if (monaco && editorRef.current && model) {
        monaco.editor.setModelLanguage(model, "javascript");
      }
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
      const unformatted = editorRef.current!.getModel()!.getValue();

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
        options={options}
      />
    </div>
  );
};

export default CodeEditor;
