import "./Header.css";

import { useCallback, useEffect, useRef, useState } from "react";

import useDebounce from "@hooks/useDebounce";
import { useActions } from "@hooks/useActions";
import useGetNotebooks from "@hooks/useGetNotebooks";

import { Notebook } from "@state/notebook";

const Header = () => {
  // @todo add error in the layout
  const { files, activeFileId, loading, error } = useGetNotebooks();
  const { createNotebook, setNotebook, deleteNotebook, updateNoteboolTitle } =
    useActions();

  const [activeNotebook, setActiveNotebook] = useState<Notebook | null>(null);
  const [selectedFileId, setSelectedFileId] = useState<string>("");
  const titleRef = useRef<HTMLInputElement | null>(null);
  const updateTitleText = useDebounce(activeNotebook?.title ?? "", 500);

  const selectNotebook = useCallback(
    (fileId: string | null | undefined) => {
      if (!fileId) {
        setActiveNotebook(null);

        return;
      }

      const notebook = files.find((file) => file.fileId === fileId);

      if (notebook) {
        setNotebook(notebook.fileId);
        setSelectedFileId(fileId);
      }

      setActiveNotebook(notebook ?? null);

      setTimeout(() => {
        if (titleRef.current) {
          titleRef.current.focus();
          titleRef.current.select();
        }
      }, 0);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [files],
  );

  useEffect(() => {
    selectNotebook(activeFileId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFileId]);

  useEffect(() => {
    if (
      activeFileId &&
      !!activeNotebook &&
      updateTitleText === activeNotebook.title
    ) {
      updateNoteboolTitle(updateTitleText, activeFileId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateTitleText, activeNotebook, selectedFileId, activeFileId]);

  const handleSelectChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    evt.preventDefault();

    const fileId = evt.target.value;
    selectNotebook(fileId);
  };

  const onDeleteNotebook = (
    evt: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    evt.preventDefault();

    if (!selectedFileId) return;

    deleteNotebook(selectedFileId);
  };

  const onNewNoteBook = (
    evt: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    evt.preventDefault();

    createNotebook();
  };

  const onChangeTitle = (evt: React.ChangeEvent<HTMLInputElement>) => {
    if (activeFileId) {
      setActiveNotebook((prev) => {
        if (prev) return { ...prev, title: evt.target.value };

        return prev;
      });
    }
  };

  return (
    <header className="header-notebook">
      <img src="/images/the-white-cat.png" className="header-logo" />

      <div className="header-new-notebook">
        <button
          disabled={loading}
          className="button is-rounded is-primary is-small"
          onClick={onNewNoteBook}
        >
          New Notebook
        </button>
      </div>

      <div className="header-input">
        <input
          disabled={!activeFileId || loading}
          ref={titleRef}
          className="is-rounded"
          type="text"
          maxLength={40}
          value={activeNotebook?.title ?? ""}
          onChange={onChangeTitle}
        />
        <button
          disabled={!activeFileId}
          className="button is-rounded is-primary is-small"
          onClick={onDeleteNotebook}
        >
          Delete
        </button>
      </div>
      <div className="header-select">
        <label htmlFor="notebook-list">Notebook List</label>
        <select
          id="notebook-list"
          value={selectedFileId}
          onChange={handleSelectChange}
        >
          <option value={""}>Select Notebook ...</option>
          {files.map(({ fileId, title }) => {
            return (
              <option key={fileId} value={fileId}>
                {title}
              </option>
            );
          })}
        </select>
      </div>
      {loading && (
        <div>
          <i className="fa fa-spinner"></i>
        </div>
      )}
      {error && (<div><p className="error">Check error: {error}</p></div>)}
    </header>
  );
};

export default Header;
