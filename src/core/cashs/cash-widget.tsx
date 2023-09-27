import { BtnDatePickerDropdown } from "asv-hlps-react/lib/cjs/reacts/minton/btns";
import { Card, Col, Row } from "react-bootstrap";

import { HlpCash } from "./helpers/hlpCash";
import totalIncomesPipe from "./helpers/pipes/total-incomes-pipe";
import totalSpentsPipe from "./helpers/pipes/total-spents-pipe";
import { currencyFormatterCfa } from "asv-hlps";

const CashWidget = ({ spents, feeds, incomes, onSelectedDates }) => {
  return (
    <Card>
      <Card.Body>
        <Row>
          {/* depenses */}
          <Col>
            <div className="d-flex align-items-start justify-content-between">
              <div>
                <h6 className="text-muted fw-normal my-0 text-truncate text-uppercase" title={"Dépenses"}>
                  {"Dépenses"}
                </h6>
                <h4 className="my-1 fw-bold ">
                  <span>{currencyFormatterCfa(totalSpentsPipe.trans(spents))}</span>
                </h4>
              </div>
            </div>
          </Col>
          {/* recettes */}
          <Col>
            <div className="d-flex align-items-start justify-content-between">
              <div>
                <h6 className="text-muted fw-normal my-0 text-truncate text-uppercase" title={"Recettes"}>
                  {"Recettes"}
                </h6>
                <h4 className="my-1 fw-bold ">
                  <span>{currencyFormatterCfa(totalIncomesPipe.trans(incomes))}</span>
                </h4>
              </div>
            </div>
          </Col>
          {/* especes */}
          <Col>
            <div className="d-flex align-items-start justify-content-between">
              <div>
                <h6 className="text-muted fw-normal my-0 text-truncate text-uppercase" title={"espèces"}>
                  {"espèces"}
                </h6>
                <h4 className="my-1 fw-bold ">
                  <span>{currencyFormatterCfa(HlpCash.getTotalCashs(incomes, feeds))}</span>
                </h4>
              </div>
            </div>
          </Col>

          <Col>
            <div className="d-flex align-items-start justify-content-between">
              <div>
                <h6 className="text-muted fw-normal my-0 text-truncate text-uppercase" title={"espèces"}>
                  {"Bilan = espèces - dépenses"}
                </h6>
                <h4 className="my-1 fw-bold ">
                  <span>{currencyFormatterCfa(HlpCash.getBilan(incomes, feeds, spents))}</span>
                </h4>
              </div>
            </div>
          </Col>
          {/* Date */}
          <Col>
            <div className="d-flex align-items-start justify-content-between">
              <div>
                <h6 className="text-muted fw-normal m-0 pb-0 text-truncate text-uppercase" title={"date"}>
                  {"date"}
                </h6>
                <h3 className="my-0 ">
                  <BtnDatePickerDropdown onSelectedDate={onSelectedDates} />
                </h3>
              </div>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default CashWidget;
