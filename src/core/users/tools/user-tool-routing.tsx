import { Route, Routes } from "react-router-dom";

import ListAuthTagCat from "./auths/cats/list-auth-tag-cat";
import ListAuthTag from "./auths/list-auth-tag";
import ListGender from "./genders/list-gender";
import ListUserGrp from "./grps/list-user-grp";
import ListUserRole from "./roles/list-user-role";
import ListSteGrp from "./stegrps/list-ste-grp";
import UserToolIndex from "./user-tool-index";
import ListZone from "./zones/list-zone";
import ListUserTitr from "./titrs/list-user-titr";

const UserToolRouting = () => {
  return (
    <Routes>
      <Route path="/" element={<UserToolIndex />}>
        <Route index element={<ListUserRole url="userroles" />} />
        <Route path="genders" element={<ListGender url="genders" />} />
        {/* <Suspense fallback={<Spinner />}> */}
        <Route path="grps" element={<ListUserGrp url="usergrps" />} />
        {/* </Suspense> */}
        <Route path="roles" element={<ListUserRole url="userroles" />} />
        <Route path="titrs" element={<ListUserTitr url="usertitrs" />} />

        <Route path="zones" element={<ListZone url="zones" />} />
        <Route path="stegrps" element={<ListSteGrp url="stegrps" />} />
        <Route path="authtags" element={<ListAuthTag url="authtags" />} />
        <Route path="authtagcats" element={<ListAuthTagCat url="authtagcats" />} />
      </Route>
    </Routes>
  );
};

export default UserToolRouting;
