import "./CellListItem.css";

import { Cell } from "@state/index";

import CodeCell from "@components/CodeCell/CodeCell";
import MDTextEditor from "@components/MDTextEditor/MDTextEditor";
import ActionBar from "@components/ActionBar/ActionBar";

interface CellListItemProps {
  cell: Cell;
}

const CellListItem: React.FC<CellListItemProps> = ({ cell }) => {
  let child: React.JSX.Element;

  if (cell.type === "text")
    child = (
      <>
        <div className="action-bar-wrapper">
          <ActionBar id={cell.id} />
        </div>
        <MDTextEditor cell={cell} />
      </>
    );
  else
    child = (
      <>
        <CodeCell cell={cell} />
        <ActionBar id={cell.id} />
      </>
    );

  return (
    <div className="cell-list-item">
      {child}
      <ActionBar id={cell.id} />
    </div>
  );
};

export default CellListItem;
