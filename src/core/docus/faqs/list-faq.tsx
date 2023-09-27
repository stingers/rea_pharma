import { QueryClient } from "@tanstack/react-query";
import { BtnEditDel, ModalBase, useQueryCrud } from "asv-hlps-react";
import DisplayHeader from "asv-hlps-react/lib/cjs/reacts/displays/display-header";
import React, { useState } from "react";
import { Accordion, Card, useAccordionButton } from "react-bootstrap";

import { ADM } from "../../../auth/services/auth-menu";
import authService from "../../../auth/services/authService";
import httpService from "../../../services/httpService";
import hlpCrud from "../../../shared/helpers/hlpCrud";
import { Toastify } from "../../../shared/helpers/Toastify";
import AdditFaq from "./addit-faq";

const ListFaq = () => {
  // const [tobs, setTobs] = useState([]);
  const [modal, setModal] = useState(false);
  const [faq, setFaq] = useState({});
  const queryClient = new QueryClient();
  // --------------------
  const { tobs, error, isLoading } = useQueryCrud({
    keys: ["faqs"],
    httpService,
    url: "faqcats/faqs",
  });
  // --------------------
  /* const fetchTobs = async () => {
    const { data: tobs } = await httpService.get("faqcats/faqs");
    setTobs(tobs);
  };

  useEffect(() => {
    fetchTobs();
    // return () => {};
  }, []); */

  /* */
  const onAdd = () => {
    setModal(true);
  };

  const Customtoggle = ({ children, eventKey }) => {
    const decorateOnClick = useAccordionButton(eventKey);
    return <span onClick={decorateOnClick}>{children}</span>;
  };

  const submitForm = async (data) => {
    setModal(false);
    try {
      await httpService.post("faqs/addit", data);
      queryClient.invalidateQueries(["faqs"]);
      Toastify.success();
    } catch (error) {
      Toastify.error();
    }

    // console.log(cool);
  };

  const handleDelete = async (data) => {
    const err = await hlpCrud.persistDelete(data.faq, `faqs/del`);
    queryClient.invalidateQueries(["faqs"]);

    Toastify.success();
    /* if (err) {
      setTobs(tobs);
    } */
  };

  const handleEdit = (faq) => {
    setFaq(faq);
    setModal(true);
  };

  return (
    <>
      <span className="my-2">
        <DisplayHeader headTitle="faqs" countLength={tobs?.length} onAdd={onAdd} authAdd={authService.getAuth({ roles: ADM })} />
      </span>
      {React.Children.toArray(
        (tobs || []).map((tob, index) => (
          <Card>
            <Card.Header>
              {" "}
              <i className="mdi mdi-help-circle me-1 text-primary"></i> {tob.name}
            </Card.Header>
            <Card.Body>
              <Accordion>
                {React.Children.toArray(
                  (tob.faqs || []).map((faq, index) => (
                    <Card className="mb-2">
                      <Card.Header>
                        {authService.getAuth({ roles: ["adm"] }) && faq.intern && <i className="fas fa-arrow-down ms-1"></i>}
                        {authService.getAuth({ roles: ["adm"] }) && faq.extern && <i className="fas fa-arrow-up ms-1"></i>}

                        <Customtoggle eventKey={String(faq.id)}>
                          <span className=" fs-11 fw-bold text-info me-1"> {index + 1} Q. </span>
                          {faq.question}
                        </Customtoggle>

                        {authService.getAuth({ roles: ["adm "] }) && (
                          <BtnEditDel tob={{ catId: tob.id, faq }} onDelete={handleDelete} onEdit={handleEdit} />
                        )}
                      </Card.Header>
                      <Accordion.Collapse eventKey={String(faq.id)}>
                        <Card.Body>
                          <div dangerouslySetInnerHTML={{ __html: faq.response }}></div>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                  ))
                )}
              </Accordion>
            </Card.Body>
          </Card>
        ))
      )}

      <ModalBase
        show={modal}
        title={"faq"}
        onCloseModal={() => setModal(false)}
        content={<AdditFaq tob={faq} onSubmitForm={submitForm} onCancelForm={() => setModal(false)} />}
        footer={false}
        size={"lg"}
      />
    </>
  );
};

export default ListFaq;
