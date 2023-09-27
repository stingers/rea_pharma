import classNames from "classnames";

import Spinner from "../components/Spinner";

import "./spinkit.css";

type TobType = {
  bgColor?: string;
};

interface SkSpinType {
  spinner?: "dots" | "wave" | "tree" | "grow";
  loading?: boolean;
  attr?: HTMLElement;
}

export const SkChasingDots = ({ bgColor = "bg-primary" }: TobType) => {
  return (
    <div className="sk-chasing-dots m-0">
      <span className={classNames(bgColor, "sk-child sk-dot1")}></span>
      <span className={classNames(bgColor, "sk-child sk-dot2")}></span>
      <span className={classNames(bgColor, "sk-child sk-dot3")}></span>
    </div>
  );
};

export const SkTreeBounce = ({ bgColor = "bg-primary" }: TobType) => {
  return (
    <span className="sk-three-bounce">
      <span className={classNames(bgColor, "sk-child sk-bounce1")}></span>
      <span className={classNames(bgColor, "sk-child sk-bounce2")}></span>
      <span className={classNames(bgColor, "sk-child sk-bounce3")}></span>
    </span>
  );
};

export const SkWave = ({ bgColor = "bg-primary" }: TobType) => {
  return (
    <span className="sk-wave m-0 d-inline-block p-0">
      <span className={`sk-rect sk-rect1 ${bgColor}`}></span>
      <span className={`sk-rect sk-rect2 ${bgColor}`}></span>
      <span className={`sk-rect sk-rect3 ${bgColor}`}></span>
      <span className={`sk-rect sk-rect4 ${bgColor}`}></span>
      <span className={`sk-rect sk-rect5 ${bgColor}`}></span>
    </span>
  );
};

const SkSpinner = ({ spinner = "wave", loading = true }: SkSpinType) => {
  return (
    <>
      {loading && spinner === "wave" && <SkWave />},{loading && spinner === "tree" && <SkTreeBounce />},
      {loading && spinner === "dots" && <SkChasingDots />}
      {loading && spinner === "grow" && <Spinner size="sm" />}
    </>
  );
};

export default SkSpinner;
