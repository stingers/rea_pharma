import { ModalConfirm } from "asv-hlps-react/lib/cjs/reacts/minton/modals";
import { createContext, useCallback, useContext, useRef, useState } from "react";

const confirmAction = {
  current: () => Promise.resolve(true),
};

const defaultFunction = (p) => Promise.resolve(true);
const defaultValue = {
  confirmRef: {
    current: defaultFunction,
  },
};

const ConfirmContext = createContext(defaultValue);

export const ConfirmContextProvider = ({ children }) => {
  const confirmRef = useRef(defaultFunction);
  return (
    <ConfirmContext.Provider value={{ confirmRef }}>
      {children}
      <ConfirmDialogWithContext />
    </ConfirmContext.Provider>
  );
};

const ConfirmDialogWithContext = () => {
  const [open, setOpen] = useState(false);
  const [props, setProps] = useState({});
  const { confirmRef } = useContext(ConfirmContext);
  const resolveRef = useRef((v) => {});
  confirmRef.current = () =>
    new Promise((resolve) => {
      setOpen(true);
      setProps(props);
      resolveRef.current = resolve;
    });
  return (
    <ModalConfirm
      show={open}
      onApprove={() => {
        resolveRef.current(true);
        setOpen(false);
      }}
      onCloseModal={() => {
        resolveRef.current(false);
        setOpen(false);
      }}
      {...props}
    />
  );
};

export const useConfirm = () => {
  const { confirmRef } = useContext(ConfirmContext);
  return {
    confirm: useCallback((p) => {
      return confirmRef.current(p);
    }, []),
  };
};

/* const ModalConfirmGlobal = () => {
  const [open, setOpen] = useState(false);
  confirmAction.current = () =>
    new Promise((resolve) => {
      setOpen(true);
    });
  return <ModalConfirm show={open} onApprove={() => console.log} onCloseModal={() => console.log} />;
  // return <ModalBase title={"test"} show={open}  onCloseModal={() => console.log} />;
}; */

export default ConfirmDialogWithContext;
