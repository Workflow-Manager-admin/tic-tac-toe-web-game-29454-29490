import React, { useState, useEffect } from 'react';
import './App.css';

// Colors from requirements
const COLORS = {
  accent: "#d32f2f",
  primary: "#1976d2",
  secondary: "#f5f5f5",
};

/** PUBLIC_INTERFACE
 * Main App component: Renders the game UI, handles state for the Tic Tac Toe game, and provides theme/styling.
 */
function App() {
  // Board is a 9 element array, each is null, "X" or "O"
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [isDraw, setIsDraw] = useState(false);

  // Calculate winner or draw on every move
  useEffect(() => {
    const result = calculateWinner(board);
    setWinner(result);
    setIsDraw(!result && board.every(cell => cell !== null));
  }, [board]);

  // PUBLIC_INTERFACE
  function handleClick(idx) {
    if (board[idx] || winner) return; // Ignore if already filled or game won
    const newBoard = board.slice();
    newBoard[idx] = xIsNext ? "X" : "O";
    setBoard(newBoard);
    setXIsNext(x => !x);
  }

  // PUBLIC_INTERFACE
  function handleRestart() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
    setIsDraw(false);
  }

  // PUBLIC_INTERFACE
  function getStatus() {
    if (winner) return `Winner: ${winner === "draw" ? "Draw" : winner}`;
    if (isDraw) return "Draw! No more moves.";
    return `Next Player: ${xIsNext ? "X" : "O"}`;
  }

  return (
    <div
      className="App"
      style={{
        minHeight: "100vh",
        background: COLORS.secondary,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div className="ttt-container" style={{
        background: "#fff",
        padding: "2.5rem 2.5rem 2rem 2.5rem",
        borderRadius: "18px",
        boxShadow: "0 6px 40px rgba(39,80,94,0.07)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        border: `2px solid ${COLORS.primary}`,
        minWidth: "310px"
      }}>
        <h1 className="ttt-title" style={{
          color: COLORS.primary,
          marginBottom: "0.5rem",
          fontSize: "2rem",
          fontWeight: "700",
          letterSpacing: ".09em"
        }}>Tic Tac Toe</h1>
        <div className="ttt-status" style={{
          marginBottom: "1.4rem",
          fontSize: "1.22rem",
          fontWeight: "500",
          color: winner
            ? COLORS.accent
            : xIsNext
              ? COLORS.primary
              : "#1a1a1a"
        }}>
          {getStatus()}
        </div>
        <GameBoard
          board={board}
          onCellClick={handleClick}
          winner={winner}
          lastPlayer={xIsNext ? "O" : "X"}
        />
        <button
          className="ttt-reset-btn"
          style={{
            marginTop: "1.7rem",
            padding: "0.7rem 1.6rem",
            minWidth: "100px",
            borderRadius: "8px",
            fontWeight: "700",
            letterSpacing: ".05em",
            border: "none",
            cursor: "pointer",
            color: "#fff",
            background: COLORS.accent,
            fontSize: "1rem",
            boxShadow: "0 2px 16px rgba(211,47,47,0.05)",
            transition: "background 0.15s"
          }}
          onClick={handleRestart}
          data-testid="reset-button"
        >
          Restart
        </button>
        <a
          href="https://reactjs.org/"
          className="ttt-learn-link"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            marginTop: "2rem",
            fontSize: "0.9rem",
            color: COLORS.primary,
            textDecoration: "none",
            opacity: 0.75
          }}
        >
          Learn React
        </a>
      </div>
    </div>
  );
}

/** PUBLIC_INTERFACE
 * GameBoard renders the 3x3 tic-tac-toe board with cells.
 */
function GameBoard({ board, onCellClick, winner, lastPlayer }) {
  return (
    <div
      className="ttt-board"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 74px)",
        gridTemplateRows: "repeat(3, 74px)",
        gap: "0.5rem",
        justifyContent: "center"
      }}
    >
      {board.map((cell, idx) => (
        <Cell
          key={idx}
          value={cell}
          onClick={() => onCellClick(idx)}
          highlight={winner && winner !== "draw" && cell === winner}
          disabled={!!winner || cell}
          isLastMove={board[idx] === lastPlayer && lastPlayer !== null && !winner} // highlight most recent
        />
      ))}
    </div>
  );
}

/** PUBLIC_INTERFACE
 * Single cell in the game board.
 */
function Cell({ value, onClick, highlight, disabled, isLastMove }) {
  // Style for X and O
  const baseStyle = {
    width: "74px",
    height: "74px",
    background: "#f5f5f5",
    color: value === "X" ? "#1976d2" : "#d32f2f",
    fontWeight: "700",
    fontSize: "2.15rem",
    borderRadius: "10px",
    border: `2px solid ${highlight ? "#d32f2f" : "#1976d2"}`,
    outline: isLastMove ? "2px dotted #1976d2" : "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: disabled ? "default" : "pointer",
    boxShadow: highlight
      ? "0 0 0 3px #ffe0e0"
      : isLastMove ? "0 0 0 3px #e3f0fc" : "0 0 0 0 #ffffff",
    transition: "border 0.15s, box-shadow 0.18s"
  };
  return (
    <button
      className="ttt-board-cell"
      style={baseStyle}
      onClick={onClick}
      disabled={disabled}
      aria-label={value ? value : "empty board cell"}
      tabIndex={0}
      data-testid={"cell-" + value}
    >
      {value}
    </button>
  );
}

/**
 * calculateWinner - Determines winner for a given board state, or returns null if no winner.
 * Returns "X", "O", "draw", or null.
 */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  // All cells filled and no winner
  if (squares.every(cell => cell)) return "draw";
  return null;
}

export default App;
