import { Toastify } from "asv-hlps-react";
import DisplayTooltip from "asv-hlps-react/lib/cjs/reacts/displays/display-tooltip";
import { WithModal } from "asv-hlps-react/lib/cjs/reacts/links/link-tob";
import { ModalBase, ModalConfirm } from "asv-hlps-react/lib/cjs/reacts/minton/modals";
import React, { useState } from "react";
import { Row } from "react-bootstrap";

import authService from "../../../auth/services/authService";
import httpService from "../../../services/httpService";
import DisplayBlockquote from "../../../shared/displays/display-blockquote";
import AdditStrNbrSelect from "../../../shared/forms/addit-str-nbr-select";
import ListBillWithoutEntry from "../entries/list-bill-without-entry";
import ListWrongEntry from "../entries/list-wrong-entry";

interface BazarType {
  id: number;
  label: any;
  subLabel?: any;
  pulse?: boolean;
  readonly?: boolean;
  action: true;
  auth?: boolean;
  withModal?: WithModal;
  authParamAction?: boolean;
}

const ListComptaBazar = () => {
  const [modal, setModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [confirmContent, setConfirmContent] = useState(null);
  const [billWithoutEntryModal, setBillWithoutEntryModal] = useState(false);
  const [wrongEntryModal, setWrongEntryModal] = useState(false);
  const [genOrReGenBillEntryModal, setGenOrReGenBillEntryModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const bazars: BazarType[] = [
    {
      id: 1,
      label: "Les factures sans écritures",
      pulse: false,
      readonly: true,
      action: true,
      auth: authService.getAuth({ roles: ["adm", "ceo", "acp", "cpt"] }),
      // withModal: {},

      // authParamAction: { roles: ["adm", "ceo"] },
    },
    {
      id: 2,
      label: "Les écritures à problemes",
      pulse: false,
      readonly: true,
      action: true,
      auth: authService.getAuth({ roles: ["adm", "ceo", "acp", "cpt"] }),
      // authParamAction: { roles: ["adm", "ceo"] },
    },
    {
      id: 3,
      // label: "corriger les compte clients  41110000",
      label: (
        <span>
          mettre à jours les comptes clients <span className="text-danger">41110000</span>
        </span>
      ),
      subLabel: "41110000",
      pulse: false,
      action: true,
      auth: authService.getAuth({ roles: ["adm", "ceo", "acp", "cpt"] }),
      // authParamAction: { roles: ["adm", "ceo", "acp", "cpt"] },
    },
    {
      id: 5,
      label: (
        <span>
          mettre à jours les comptes fournisseurs <span className="text-danger">40110000</span>
        </span>
      ),
      subLabel: "40110000",
      pulse: false,
      action: true,
      auth: authService.getAuth({ roles: ["adm", "ceo", "acp", "cpt"] }),
      // authParamAction: { roles: ["adm", "ceo", "acp", "cpt"] },
    },
    {
      id: 4,
      label: "générer une écriture de facture",
      // subLabel: "defaut",
      pulse: false,
      action: true,
      auth: authService.getAuth({ roles: ["adm", "ceo", "acp", "cpt"] }),
      // authParamAction: { roles: ["adm", "ceo", "acp", "cpt"] },
    },

    {
      id: 6,
      label: "recréer les références des ecritures",
      // subLabel: "defaut",
      pulse: false,
      action: true,
      auth: authService.getAuth({ roles: ["adm", "ceo", "acp", "cpt"] }),
      // authParamAction: { roles: ["adm", "ceo", "acp", "cpt"] },
    },

    {
      id: 7,
      label: "générer code compta pour un client",
      // subLabel: "defaut",
      pulse: false,
      action: true,
      auth: authService.getAuth({ roles: ["adm", "ceo", "acp", "cpt"] }),
      // authParamAction: { roles: ["adm", "ceo", "acp", "cpt"] },
    },
    {
      id: 8,
      label: "générer code compta pour un fournisseur",
      // subLabel: "defaut",
      pulse: false,
      action: true,
      auth: authService.getAuth({ roles: ["adm", "ceo", "acp", "cpt"] }),
      // authParamAction: { roles: ["adm", "ceo", "acp", "cpt"] },
    },
    {
      id: 9,
      label: "Mettre à jour le code compta Ohada",
      // subLabel: "defaut",
      pulse: false,
      action: true,
      auth: authService.getAuth({ roles: ["adm", "ceo", "acp", "cpt"] }),
      // authParamAction: { roles: ["adm", "ceo", "acp", "cpt"] },
    },
  ];

  const onStickview = (id: number) => {
    switch (id) {
      case 1:
        onBillWithoutEntry();
        break;
      case 2:
        onWrongEntry();
        break;
      /* case 3:
        this.onRestoreAccountComptaClient();
        break; */
    }
  };

  const onStickAction = (id: number) => {
    switch (id) {
      case 3:
        onUpdateAccountComptaClients();
        break;
      case 4:
        onGenOrReGenBillEntry();
        break;
      case 5:
        onUpdateAccountComptaPVDs();
        break;
      case 6:
        onReGenEntriesRef();
        break;
      case 7:
        onGenCodeComptaClient();
        break;
      case 8:
        onGenCodeComptaPvd();
        break;
      case 9:
        onUpdateCodeComptaOhada();
        break;
    }
  };

  const onBillWithoutEntry = () => {
    setBillWithoutEntryModal(true);
  };

  const onWrongEntry = () => {
    setWrongEntryModal(true);
  };
  // --------------------
  const onReGenEntriesRef = () => {
    setModal(true);
  };
  const handleReGenEntriesRef = async ({ str }) => {
    if (str && str.length === 4 && parseInt(str)) {
      setModal(false);
      setLoading(true);
      httpService
        .postBody({ year: str }, "entries/reGenEntriesRef")
        .then((data) => {
          if (data) {
            setLoading(false);
            Toastify.success();
          }
        })
        .catch((error) => {
          Toastify.error();
        });
    } else {
      Toastify.error("Année incorrect");
    }
  };
  // --------------------
  const onUpdateAccountComptaClients = async () => {
    setLoading(true);
    try {
      const { data } = await httpService.get("zut/updateEntrylineAccountsCLientByUsername");
      if (data) {
        setLoading(false);
        Toastify.success();
      }
    } catch (error) {
      setLoading(false);
      Toastify.error();
    }
  };
  const onUpdateAccountComptaPVDs = async () => {
    setLoading(true);
    try {
      const { data } = await httpService.get("zut/updateEntrylineAccountsPVDs");
      if (data) {
        setLoading(false);
        Toastify.success();
      }
    } catch (error) {
      setLoading(false);
      Toastify.error();
    }
  };
  // ------ genOrReGenBillEntry ------
  const onGenOrReGenBillEntry = () => {
    setGenOrReGenBillEntryModal(true);
  };
  const handleGenOrReGenBillEntry = async ({ str }) => {
    if (str && str.trim().length === 10) {
      setGenOrReGenBillEntryModal(false);
      setLoading(true);
      httpService
        .postBody({ billRef: str.trim() }, "bills/genMissingBillEntry")
        .then(({ data }) => {
          if (data.msg === "noSalesForThisBill") {
            setLoading(false);
            Toastify.error(`la facture  N°<b>${str} </b> n'a pas de commandes`);
          } else if (data.msg === "noBill") {
            setLoading(false);
            Toastify.error(`Aucune facture avec la réference N°<b>${str} </b> trouvée`);
          } else {
            setLoading(false);
            Toastify.success();
          }
        })
        .catch((error) => {
          setLoading(false);
          Toastify.error();
        });
    } else {
      Toastify.error("reférence incorrect");
    }
  };
  // ------ gen codeCompta  ------
  const onGenCodeComptaClient = async () => {
    try {
      setLoading(true);
      const { data } = await httpService.get("zut/genSequenceCodeComptaForClient");
      setLoading(false);
      setConfirmContent(data);
      setConfirmModal(true);
      Toastify.success(data);
    } catch (error) {}
  };
  const onGenCodeComptaPvd = async () => {
    try {
      setLoading(true);
      const { data } = await httpService.get("zut/genSequenceCodeComptaForPvd");
      setLoading(false);
      setConfirmContent(data);
      setConfirmModal(true);
    } catch (error) {}
  };

  const onUpdateCodeComptaOhada = async () => {
    try {
      setLoading(true);
      const { data } = await httpService.get("zut/updateCodeComptaOhadaSTE");
      Toastify.success();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Toastify.error();
    }
  };
  // --------------------

  return (
    <>
      <Row>
        {React.Children.toArray(
          bazars.map((bazar) => {
            return (
              <DisplayBlockquote loading={loading} pulse={bazar?.pulse} auth={bazar?.auth} withModal={bazar.withModal} colSize={6}>
                <span>
                  <span className="text-uppercase ">{bazar.label}</span>
                  {bazar.action && (
                    <span onClick={() => onStickAction(bazar.id)} className="mx-2 float-end">
                      <i className="fas fa-pen"></i>
                    </span>
                  )}
                  {bazar.readonly && (
                    <DisplayTooltip content={"voir"}>
                      <span onClick={() => onStickview(bazar.id)} className="mx-2 float-end">
                        <i className="fas fa-eye"></i>
                      </span>
                    </DisplayTooltip>
                  )}
                </span>
              </DisplayBlockquote>
            );
          })
        )}
      </Row>

      <ModalBase
        title={"regénérer les reférences"}
        show={modal}
        // onCloseModal={closeModal}
        onCloseModal={() => setModal(false)}
        content={
          <AdditStrNbrSelect type="number" label="année" onCancelForm={() => setModal(false)} onSubmitForm={handleReGenEntriesRef} />
        }
      />

      <ModalBase
        title={"les factures sans ecritures compta"}
        show={billWithoutEntryModal}
        size="lg"
        // onCloseModal={closeModal}
        onCloseModal={() => setBillWithoutEntryModal(false)}
        content={<ListBillWithoutEntry />}
      />

      <ModalBase
        title={"les  écritures à problèmes"}
        show={wrongEntryModal}
        size="lg"
        // onCloseModal={closeModal}
        onCloseModal={() => setWrongEntryModal(false)}
        content={<ListWrongEntry />}
      />

      <ModalBase
        title={"genérer l'écriture de la facture"}
        show={genOrReGenBillEntryModal}
        // onCloseModal={closeModal}
        onCloseModal={() => setGenOrReGenBillEntryModal(false)}
        content={
          <AdditStrNbrSelect
            label="N° ref"
            onCancelForm={() => setGenOrReGenBillEntryModal(false)}
            onSubmitForm={handleGenOrReGenBillEntry}
          />
        }
      />

      <ModalConfirm
        content={confirmContent}
        title={"Veuillez noter le code générer"}
        show={confirmModal}
        onApprove={() => setConfirmModal(false)}
        onCloseModal={() => setConfirmModal(false)}
        approveLabel={"ok"}
        approveVariant={"success"}
      />
    </>
  );
};

export default ListComptaBazar;
