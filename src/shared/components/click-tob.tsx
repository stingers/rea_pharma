type ClickTobType = {
  tob;
  property;
  onClick;
  dbl?: boolean;
};

const ClickTob = ({ tob, property, onClick, dbl }: ClickTobType) => {
  const typeClick = !dbl ? <span onClick={onClick(tob)}>{property}</span> : <span onDoubleClick={onClick(tob)}>{property}</span>;
  return { typeClick };
};

export default ClickTob;
