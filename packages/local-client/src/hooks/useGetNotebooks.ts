import { useTypedSelector } from "@hooks/useTypedSelector";
import { Notebook } from "@state/notebook";

interface useGetNotebooksProps {
  loading: boolean;
  error: string | null;
  activeFileId: string | undefined | null;
  files: Notebook[];
}

export default function useGetNotebooks(): useGetNotebooksProps {
  const { activeFileId, files, loading, error } = useTypedSelector(
    ({ notebooks }) => {
      const {
        loading,
        error,
        fileNotebooks: { activeFileId, files = [] },
      } = notebooks;

      return { loading, error, activeFileId, files };
    },
  );

  return { activeFileId, files, loading, error };
}
