import { useState } from 'react';
import classNames from 'classnames';
function Square({ value, onSquareClick, isWinnerSquare }) {
  return (
    <button
      className={classNames({ square: true, 'square-winner': isWinnerSquare })}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick({ squareIndex, rowIndex, colIndex }) {
    if (squares[squareIndex] || calculateWinner(squares).isOver) return;
    const nextSquares = [...squares];
    nextSquares[squareIndex] = xIsNext ? 'X' : 'O';
    onPlay({ nextSquares, rowIndex, colIndex });
  }

  const winnerObj = calculateWinner(squares);
  let status;
  if (winnerObj.isOver) {
    if (winnerObj.winner) {
      status = '胜利者: ' + winnerObj.winner;
    } else {
      status = '平局';
    }
  } else {
    status = '下一个玩家: ' + (xIsNext ? 'X' : 'O');
  }

  const rows = [];
  for (let i = 0; i < 3; i++) {
    let squaresInRow = [];
    for (let j = 0; j < 3; j++) {
      const squareIndex = i * 3 + j;
      squaresInRow.push(
        <Square
          value={squares[squareIndex]}
          onSquareClick={() =>
            handleClick({ squareIndex, rowIndex: i, colIndex: j })
          }
          isWinnerSquare={
            winnerObj.winnerSquaresIndex.indexOf(squareIndex) > -1
          }
        />
      );
    }
    rows.push(<div className="board-row">{squaresInRow}</div>);
  }

  return (
    <>
      <div className="status">{status}</div>
      {rows}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([
    { squares: Array(9).fill(null), rowIndex: -1, colIndex: -1 },
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;
  const [isMovesOrderDesc, setIsMovesOrderDesc] = useState(false);

  function handlePlay({ nextSquares, rowIndex, colIndex }) {
    const nextHistory = [
      ...history.slice(0, currentMove + 1),
      { squares: nextSquares, rowIndex, colIndex },
    ];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setHistory(history.slice(0, nextMove + 1));
  }

  const moves = history.map((historyItem, move) => {
    let description;
    if (move === history.length - 1) {
      description = (
        <span>
          {move === 0
            ? '请开始游戏'
            : `你在第${move}步, (${historyItem.rowIndex + 1}, ${
                historyItem.colIndex + 1
              })`}
        </span>
      );
    } else {
      description = (
        <button onClick={() => jumpTo(move)}>
          {move === 0
            ? '回到开始游戏'
            : `回到${move}步, (${historyItem.rowIndex + 1}, ${
                historyItem.colIndex + 1
              })`}
        </button>
      );
    }
    return <li key={move}>{description}</li>;
  });

  if (isMovesOrderDesc) {
    moves.reverse();
  }

  function handleMoveOrderClick() {
    setIsMovesOrderDesc(!isMovesOrderDesc);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
        />
      </div>
      <div className="game-info">
        <button onClick={handleMoveOrderClick}>
          {isMovesOrderDesc ? '倒序' : '正序'}
        </button>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  let result = {
    isOver: false,
    winner: null,
    winnerSquaresIndex: [],
  };
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
      result.isOver = true;
      result.winner = squares[a];
      result.winnerSquaresIndex = lines[i];
      break;
    }
  }
  if (!result.isOver) {
    if (squares.every((square) => square !== null)) {
      result.isOver = true;
    }
  }
  return result;
}
