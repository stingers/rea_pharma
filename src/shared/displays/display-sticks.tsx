import DisplayTooltip from "asv-hlps-react/lib/cjs/reacts/displays/display-tooltip";
import { WithModal } from "asv-hlps-react/lib/cjs/reacts/links/link-tob";
import React from "react";
import { Row } from "react-bootstrap";

import DisplayBlockquote from "./display-blockquote";

export interface StickProps {
  id: number;
  label: any;
  subLabel?: any;
  pulse?: boolean;
  readonly?: boolean;
  action: true;
  auth?: boolean;
  withModal?: WithModal;
  authParamAction?: boolean;
  colSize?: number;
}
type TobProps = {
  sticks: StickProps[];
  loading: boolean;
  onStickAction?: (id: number | string) => void;
  onStickview?: (id: number | string) => void;
};

const DisplaySticks = ({ sticks, onStickview, onStickAction, loading = false }: TobProps) => {
  // const [loading, setLoading] = useState(false);

  return (
    <Row>
      {React.Children.toArray(
        sticks.map((stick) => {
          return (
            <DisplayBlockquote
              loading={loading}
              pulse={stick?.pulse}
              auth={stick?.auth}
              withModal={stick.withModal}
              colSize={stick.colSize ? stick.colSize : 6}>
              <span>
                <span className="text-uppercase ">{stick.label}</span>
                {stick.action && (
                  <span onClick={() => onStickAction(stick.id)} className="mx-2 float-end">
                    <i className="fas fa-pen"></i>
                  </span>
                )}
                {stick.readonly && (
                  <DisplayTooltip content={"voir"}>
                    <span onClick={() => onStickview(stick.id)} className="mx-2 float-end">
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
  );
};

export default DisplaySticks;
