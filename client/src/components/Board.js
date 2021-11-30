import Square from "./Square";

const ROWSIZE = 3;
const COLSIZE = 3;

const Board = ({ squares, onClick, winningCombo }) => {
  const renderSquare = (i) => {
    return (
      <Square
        key={`sq#${i}`}
        value={squares[i]}
        onClick={() => onClick(i)}
        winningSq={winningCombo && winningCombo.includes(i)}
      />
    );
  };

  const renderBoard = () => {
    const board = [];

    const renderRow = (i) => {
      const row = [];
      for (let c = 0; c < COLSIZE; c++) {
        row.push(renderSquare(3 * i + c));
      }
      return (
        <div key={`row${i}`} className="board-row">
          {row}
        </div>
      );
    };

    for (let r = 0; r < ROWSIZE; r++) {
      board.push(renderRow(r));
    }
    return board;
  };

  return <div>{renderBoard()}</div>;
};

export default Board;
