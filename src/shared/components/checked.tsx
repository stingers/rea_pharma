import React from "react";

const Checked = ({ tob, onChecked }) => {
  /* let checks: any[] = [];

  const handleChecks = (e: any) => {
    const evt: boolean = e.target.checked;
    checks = arrayMultiChecked(checks, evt, tob);
    console.log(checks);
    onChecked(checks);

    // return (checks = arrayMultiChecked(checks, evt, bill));
  }; */
  return (
    <input
      type="checkbox"
      className="form-check-input"
      name="tob.id"
      // checked={true}
      // onChange={(event) => onChecked(handleChecks(event))}
      onChange={(event) => onChecked(event, tob)}
    />
  );
};

export default Checked;
