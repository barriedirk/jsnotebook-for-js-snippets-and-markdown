import "./CellList.css";

import { Fragment, FC, useEffect } from "react";

import { useTypedSelector } from "@hooks/useTypedSelector";
import { useActions } from "@hooks/useActions";

import AddCell from "@components/AddCell/AddCell";
import CellListItem from "./CellListItem";
import SelectNotebook from "./SelectNotebook";

const CellList: FC = () => {
  const { fetchCells } = useActions();
  const { cells, activeFileId } = useTypedSelector(({ cells, notebooks }) => {
    const { order, data } = cells!;

    return {
      activeFileId: notebooks!.fileNotebooks?.activeFileId,
      cells: order.map((id) => data[id]),
    };
  });

  useEffect(() => {
    if (activeFileId) {
      fetchCells();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFileId]);

  if (!activeFileId) {
    return <SelectNotebook />;
  }

  const renderedCells = cells.map((cell) => (
    <Fragment key={cell.id}>
      <CellListItem cell={cell} />
      <AddCell previousCellId={cell.id} />
    </Fragment>
  ));

  return (
    <div className="cell-list">
      <AddCell forceVisible={cells.length === 0} previousCellId={null} />
      {renderedCells}
    </div>
  );
};

export default CellList;
