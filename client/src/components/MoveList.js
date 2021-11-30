import React from "react";
import { useState } from "react";
// ACTIVE/INACTIVE history button style
const INACTIVE = {
  fontWeight: "normal",
  color: "black",
};

const ACTIVE = {
  fontWeight: "bold",
  color: "red",
};

const MoveList = ({ history, jumpTo }) => {
  const [bold, setBold] = useState(-1);
  const [descend, setDescend] = useState(false);
  // create history move list
  const moves = history.map((step, move) => {
    const desc = move
      ? `Go to move #${move} (row: ${step.clicked.row}, col: ${step.clicked.col})`
      : "Go to game start";
    return (
      <li key={move}>
        <button
          id={move}
          onClick={() => {
            setBold(move);
            jumpTo(move);
          }}
          style={move === bold ? ACTIVE : INACTIVE}
        >
          {desc}
        </button>
      </li>
    );
  });
  return (
    <div>
      Sort:
      <br />
      <button
        onClick={() => {
          setDescend(!descend);
        }}
      >
        {descend ? "Descend" : "Ascend"}
      </button>
      <ol>{descend ? moves.reverse() : moves}</ol>
    </div>
  );
};

export default MoveList;
