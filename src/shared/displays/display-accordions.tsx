import React from "react";
import { Accordion, Card } from "react-bootstrap";

interface TabContentType {
  id: number;
  title: string;
  icon?: string;
  Content: any;
}

interface AccordionType {
  accordions: TabContentType[];
}

const DisplayAccordions = ({ accordions }: AccordionType) => {
  const AccordionItem = ({ item, index }: { item: TabContentType; index: number }) => {
    return (
      <Accordion.Item eventKey={String(index)} nonce="true">
        <Accordion.Header>
          <i className="mdi mdi-help-circle me-1 text-primary"></i> {item.title}
        </Accordion.Header>
        <Accordion.Body>{item.Content}</Accordion.Body>
      </Accordion.Item>
    );
  };
  return (
    <Accordion defaultActiveKey="0" id="accordion">
      {(accordions || []).map((item, index) => {
        return <AccordionItem key={index} item={item} index={index} />;
      })}
    </Accordion>
  );
};

export default DisplayAccordions;
