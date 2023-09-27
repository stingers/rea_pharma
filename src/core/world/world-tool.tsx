import { IPath } from "asv-hlps";
import React from "react";
import DisplayTab from "../../shared/displays/DisplayTab";

const paths: IPath[] = [
  {
    id: 1,
    title: "continents",
    icon: "uil-home-alt",
    link: "/dash/tools/world/continents",
  },
  {
    id: 2,
    title: "pays",
    icon: "uil-home-alt",
    link: "/dash/tools/world/countries",
  },
  {
    id: 3,
    title: "regions",
    icon: "uil-home-alt",
    link: "/dash/tools/world/regions",
  },
  {
    id: 4,
    title: "départements",
    icon: "uil-home-alt",
    link: "/dash/tools/world/departments",
  },
  {
    id: 5,
    title: "villes",
    icon: "uil-home-alt",
    link: "/dash/tools/world/cities",
  },
  {
    id: 6,
    title: "quartiers",
    icon: "uil-home-alt",
    link: "/dash/tools/world/quarters",
  },
];
const WorldTool = () => {
  return <DisplayTab paths={paths} />;
};

export default WorldTool;
