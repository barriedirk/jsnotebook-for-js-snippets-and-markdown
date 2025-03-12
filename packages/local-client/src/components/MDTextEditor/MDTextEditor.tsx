import "./MDTextEditor.css";

import { useState, useEffect, useRef } from "react";
import MDEditor from "@uiw/react-md-editor";

import { Cell } from "@state/index";

import { useActions } from "@hooks/useActions";

interface MDTextEditorProps {
  cell: Cell;
}

const MDTextEditor: React.FC<MDTextEditorProps> = ({ cell }) => {
  const { updateCell } = useActions();
  const [editing, setEditing] = useState(false);
  const refEditingMD = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (
        refEditingMD.current &&
        event.target &&
        refEditingMD.current.contains(event.target as Node)
      ) {
        // element clicked on is inside editor
        return;
      }

      setEditing(false);
    };

    document.addEventListener("click", listener, { capture: true });

    return () => {
      document.removeEventListener("click", listener, { capture: true });
    };
  }, []);

  if (editing) {
    return (
      <div className="text-editor" ref={refEditingMD}>
        <MDEditor
          value={cell.content ?? ""}
          onChange={(newValue) => updateCell(cell.id, newValue ?? "")}
        />
      </div>
    );
  }

  return (
    <div className="text-editor card" onClick={() => setEditing(true)}>
      <div className="card-content">
        <MDEditor.Markdown source={cell.content || "Click to Edit"} />
      </div>
    </div>
  );
};

export default MDTextEditor;
