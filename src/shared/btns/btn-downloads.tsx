import { BtnAction, BtnType, DropMenuType } from "asv-hlps-react";

type TobType = {
  tob: any;
  onGenPdf;
  drop?: boolean;
  icon?: boolean;
};

const BtnDownloads = ({ tob, onGenPdf, drop, icon }: TobType) => {
  const btns: BtnType[] = [
    { id: 1, icon: "fas fa-print", label: "", size: "sm", variant: "link", btnClass: "p-0" },
    { id: 2, icon: "fas fa-download", label: "", size: "sm", variant: "link", btnClass: "p-0" },
    { id: 3, icon: "fas fa-eye", label: "", size: "sm", variant: "link", btnClass: "p-0" },
  ];

  const drops: BtnType[] = [
    { id: 1, icon: "fas fa-print", label: "Imprimer", size: "sm", variant: "link", btnClass: "p-0" },
    { id: 2, icon: "fas fa-download", label: "Télécharger", size: "sm", variant: "link", btnClass: "p-0" },
    { id: 3, icon: "fas fa-eye", label: "Consulter", size: "sm", variant: "link", btnClass: "p-0" },
  ];

  const dropMenu: DropMenuType = {
    ellipsis: "v",
    // icon: "fas fa-print",
    drops: drops,
  };
  const dropMenuIcon: DropMenuType = {
    icon: "fas fa-print",
    drops: drops,
  };

  const handleBtn = (value) => {
    switch (value) {
      case 1:
        return onGenPdf({ action: "print", tob });
      case 2:
        return onGenPdf({ action: "download", tob });
      case 3:
        return onGenPdf({ action: "open", tob });
      default:
        return onGenPdf({ action: "print", tob });
    }
  };

  return (
    <>
      {!drop && <BtnAction btns={btns} onBtn={handleBtn} />}
      {drop && !icon && <BtnAction elpDrop dropMenu={dropMenu} onDrop={handleBtn} />}
      {drop && icon && <BtnAction elpDrop dropMenu={dropMenuIcon} onDrop={handleBtn} />}
    </>
  );
};

export default BtnDownloads;
