import Board from "./components/Board";
import MoveList from "./components/MoveList";
import socketIOClient from "socket.io-client";
import { useEffect, useState } from "react";

// Helper function:
// check board for a winning combo
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }
  return null;
}

// Create io socket
const socket = socketIOClient();

// GAME react component
const Game = () => {
  const [message, setMessage] = useState(null);
  useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => console.log(`${data.message}`));
    socket.on("message", (data) => {
      setMessage(data.message);
    });
    return () => socket.disconnect();
  }, []);

  // Define state variables
  const [state, setState] = useState({
    history: [
      {
        squares: Array(9).fill(null),
        clicked: {
          col: null,
          row: null,
        },
      },
    ],
    step: 0,
    xIsNext: true,
  });

  // Define square on click callback.
  const handleClick = (i) => {
    const history = state.history.slice(0, state.step + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    socket.emit("client", `pressed ${i}`, (res) => {
      console.log(res);
    });

    if (calculateWinner(current.squares) || squares[i]) {
      return;
    }
    squares[i] = state.xIsNext ? "X" : "O";
    setState({
      history: history.concat([
        {
          squares: squares,
          clicked: {
            col: (i % 3) + 1,
            row: Math.floor(i / 3) + 1,
          },
        },
      ]),
      step: history.length,
      xIsNext: !state.xIsNext,
    });
  };

  const jumpTo = (step) => {
    setState({
      history: state.history,
      step: step,
      xIsNext: step % 2 === 0,
    });
  };

  // get current board state
  const current = state.history[state.step];
  let status;
  if (calculateWinner(current.squares)) {
    status = `Winner: ${state.xIsNext ? "O" : "X"}!`;
  } else if (!current.squares.includes(null)) {
    status = `Draw!`;
  } else {
    status = `Next player: ${state.xIsNext ? "X" : "O"}`;
  }

  return (
    <div className="game">
      <p>
        {!message ? (
          "Waiting for server!"
        ) : (
          <time dateTime={message}>{message}</time>
        )}
      </p>
      <div className="game-board">
        <Board
          squares={current.squares}
          onClick={(i) => handleClick(i)}
          winningwinningCombo={calculateWinner(current.squares)}
        />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <br />
        <div>
          <MoveList history={state.history} jumpTo={jumpTo} />
        </div>
      </div>
    </div>
  );
};

export default Game;
