import DocuTool from "./docu-tool";
import ListFaqCat from "./faq-cats/list-faq-cat";
import React, { Suspense } from "react";
import { Loader } from "react-bootstrap-typeahead";
import { Route, Routes } from "react-router-dom";

const DocuToolRouting = () => {
  return (
    <Routes>
      <Route path="" element={<DocuTool />}>
        <Route index element={<ListFaqCat url="faqcats" />} />
        <Route path="faqcats" element={<ListFaqCat url="faqcats" />} />
      </Route>
    </Routes>
  );
};

export default DocuToolRouting;
