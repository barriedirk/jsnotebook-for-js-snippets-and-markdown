import "./CodeCell.css";

import { useEffect } from "react";

import CodeEditor from "@components/CodeEditor/CodeEditor";
import Preview from "@components/Preview/Preview";
import Resizable from "@components/Resisable/Resizable";

import { Cell } from "@state/index";

import { useActions } from "@hooks/useActions";
import { useTypedSelector } from "@hooks/useTypedSelector";
import { useCumulativeCode } from "@hooks/useCumulativeCode";

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const { updateCell, createBundle } = useActions();
  const bundle = useTypedSelector((state) => state.blundes[cell.id]);
  const cumulativeCode = useCumulativeCode(cell.id);

  useEffect(() => {
    // we did this to avoid a second blink for rendering
    if (!bundle) {
      createBundle(cell.id, cumulativeCode);

      return;
    }

    const timer = setTimeout(async () => {
      createBundle(cell.id, cumulativeCode);
    }, 750);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cumulativeCode, cell.id, createBundle]);

  return (
    <Resizable direction="vertical">
      <div
        style={{
          height: "calc(100% - 10px)",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue={cell.content}
            onChange={(value) => updateCell(cell.id, value)}
          />
        </Resizable>
        <div className="progress-wrap">
          {!bundle || bundle.loading ? (
            <div className="progress-cover">
              <progress className="progress is-small is-primary" max="100">
                Loading
              </progress>
            </div>
          ) : (
            <Preview code={bundle.code} bundlingStatus={bundle.err} />
          )}
        </div>
      </div>
    </Resizable>
  );
};

export default CodeCell;
