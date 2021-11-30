import React from "react";
import PropTypes from "prop-types";

// the square componenet is a "controlled componenet"
// as it is no longer maintain state.
const Square = ({ value, onClick, winningSq }) => {
  return (
    <button
      className="square"
      onClick={onClick}
      style={winningSq ? { color: "red" } : { color: "black" }}
    >
      {value}
    </button>
  );
};

Square.propsType = {
  index: PropTypes.number,
};

export default Square;
