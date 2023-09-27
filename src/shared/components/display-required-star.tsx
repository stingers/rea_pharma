const DisplayRequiredStar = ({ label }) => {
  return (
    <>
      {label}
      <span className="text-danger"> *</span>
    </>
  );
};

export default DisplayRequiredStar;
