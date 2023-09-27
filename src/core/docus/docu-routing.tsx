import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import Loader from "../../shared/Loader";
import DocuIndex from "./docu-index";
import ListFaq from "./faqs/list-faq";

const DocuRouting = () => {
  const DocuToolRoutes = React.lazy(() => import("./tools/docu-tool-routing"));
  return (
    <Routes>
      <Route path="/" element={<DocuIndex />}>
        <Route index element={<ListFaq />} />
        <Route path="faqs" element={<ListFaq />} />
        <Route
          path="tools/*"
          element={
            <Suspense fallback={<Loader />}>
              <DocuToolRoutes />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
};

export default DocuRouting;
