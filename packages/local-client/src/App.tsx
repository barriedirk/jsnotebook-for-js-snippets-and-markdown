import { useEffect } from "react";

import { useActions } from "@hooks/useActions";

import Header from "@components/Header/Header";
import CellList from "@components/CellList/CellList";

export default function App() {
  const { fetchNotebooks } = useActions();

  useEffect(() => {
    fetchNotebooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Header />
      <CellList />
    </>
  );
}
