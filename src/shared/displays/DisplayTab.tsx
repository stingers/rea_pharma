import { IPath } from "asv-hlps";
import classNames from "classnames";
import { Card, Tab } from "react-bootstrap";
import { Outlet, useLocation } from "react-router-dom";

import PageTitle from "../../layouts/PageTitle";
import TabNav from "../tabs/tab-nav";
import TabNavChild from "../tabs/tab-nav-child";

export interface TabContentType {
  auth?: boolean;
  bordered?: boolean;
  child?: boolean;
  hasChild?: boolean;
  justify?: boolean;
  onSelectedTab?;
  paths: IPath[];
  pgPath?: string;
  pgTitle?: string;
  hasPgTitle?: boolean;
  variant?: "tabs" | "pills";

  // defaultActive: string | number;
}

// const DisplayTab: React.FC<TabContentType> = ({ paths, variant }) => {
const DisplayTab = ({
  paths,
  variant,
  pgTitle = "Outils",
  pgPath = "/dash",
  hasPgTitle = true,
  child = false,
  hasChild = false,
  justify = false,
  bordered = true,
}: TabContentType) => {
  const location = useLocation();

  const tabParentClass = () => (hasChild ? "p-0 text-muted" : "p-3 text-muted");

  const getTabId = (location) => {
    if (location.state) {
      return location?.state?.tabId ? location.state.tabId : paths[0].id;
    }
  };

  const tabContainer = () => {
    return (
      // <Tab.Container defaultActiveKey={getTabId(location.state, paths)}>
      <Tab.Container defaultActiveKey={location?.state?.tabId ? location.state.tabId : paths[0].id}>
        <TabNav paths={paths} />
        <Tab.Content className={classNames(tabParentClass())}>
          <Outlet />
        </Tab.Content>
      </Tab.Container>
    );
  };

  return (
    <>
      {!child && (
        <>
          {hasPgTitle && (
            <PageTitle
              breadCrumbItems={[
                // { label: "Dash", path: "/dash" },
                { label: pgTitle, path: pgPath },
                { label: pgTitle, path: pgPath, active: true },
              ]}
              title={pgTitle}
            />
          )}
          {/* {tabContainer()} */}
          <Card>{tabContainer()}</Card>
        </>
      )}
      {child && (
        <>
          <Tab.Container defaultActiveKey={location?.state?.tabChildId ? location.state.tabChildId : paths[0].id}>
            {/* <Tab.Container defaultActiveKey={defaultKey}> */}
            <TabNavChild paths={paths} />
            <Tab.Content>
              <Outlet />
            </Tab.Content>
          </Tab.Container>
        </>
      )}
    </>
  );
};

/* const getAuth = (user: User, param?: AuthParam): boolean => {
  if (param?.roles?.length) {
    if (isStaffSte(["stinger's"], user)) {
      return param?.roles?.length ? ["sadm", ...param.roles].includes(user.role.code.toLowerCase()) : false;
    }
  }
}; */

export default DisplayTab;
