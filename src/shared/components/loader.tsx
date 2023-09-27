import React from "react";

/**
 * Renders the preloader
 */
const Loader = ({ preloader = false }: { preloader?: boolean }) => {
  return (
    <>
      {!preloader && (
        <div className="spinner">
          <div></div>
          <div></div>
          <div></div>
        </div>
      )}
      {preloader && (
        <div className="preloader" id="preloader">
          <div className="status" id="status">
            <div className="spinner">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Loader;
