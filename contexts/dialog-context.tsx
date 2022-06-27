import { Dialog } from "@mui/material";
import { createContext, ReactNode, useContext, useState } from "react";

type DialogProviderProps = {
  children: ReactNode;
};

const DialogContext = createContext({
  onClose: () => {},
  updateDialog: (state: boolean, content: JSX.Element) => {},
});

export const useDialog = () => {
  return useContext(DialogContext);
};

export const DialogProvider = ({ children }: DialogProviderProps) => {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState<JSX.Element | null>(null);

  const onClose = () => {
    setOpen(false);
  };

  const updateDialog = (state: boolean, content: JSX.Element) => {
    setContent(content);
    setOpen(state);
  };

  const value = {
    updateDialog,
    onClose,
  };

  return (
    <DialogContext.Provider value={value}>
      {children}

      <Dialog onClose={onClose} open={open}>
        {content}
      </Dialog>
    </DialogContext.Provider>
  );
};
