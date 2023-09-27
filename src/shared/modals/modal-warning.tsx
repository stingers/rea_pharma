import { ModalBase } from "asv-hlps-react/lib/cjs/reacts/minton/modals";

type TobType = {
  show: boolean;
  title?;
  content;
  onCloseModal;
};

// export const ModalWarning = ({ show = false, onCloseModal, title }) => {
export const ModalWarning = ({ show, title, content, onCloseModal }: TobType) => {
  return (
    <ModalBase
      show={show}
      fullscreen="xl-down"
      // onCloseModal={() => setModal(false)}
      onCloseModal={onCloseModal}
      onCancel={onCloseModal}
      hasApprove={false}
      cancelLabel={"ok"}
      title={
        <>
          <span className="text-uppercase text-center ">
            <i className="text-warning fas fa-exclamation-triangle me-2"></i>
            <span className="fs-6">{title ? `${title}` : `action non permise`}</span>
          </span>
        </>
      }
      // title={formatTitle()}
      content={<div className="text-center" dangerouslySetInnerHTML={{ __html: content ? content : "message informative" }}></div>}
    />
  );
};
