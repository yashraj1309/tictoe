import { useState, useEffect } from 'react';
import "./App.css";

function Square({ value, onSquareClick, className }) {
  let win = className.win;
  let loc = className.cur;
  let additionalClass = loc ? "loc square" : "square";
  return (
    <button className={`${win ? "bg square" : "square"} ${additionalClass}`}  onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, loc}) {
  var winboxes = [];
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  useEffect(()=> {},[xIsNext]);

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner?.player;
    winboxes = winner?.boxs;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  const wincheck = (l) => {
    const obj = {win: false, cur: false};
    for(let i=0; i<winboxes.length; i++) {
      if(l===winboxes[i]) {
        obj.win = true;
        break;
      }
    }
    if(l===loc) {
      obj.cur=true;
    }
    return obj;
  }
  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} className={wincheck(0)} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} className={wincheck(1)} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} className={wincheck(2)} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} className={wincheck(3)} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} className={wincheck(4)} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} className={wincheck(5)} onSquareClick={() => handleClick(5)} />
      </div> 
      <div className="board-row">
        <Square value={squares[6]} className={wincheck(6)} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} className={wincheck(7)} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} className={wincheck(8)} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [loc, setLoc] = useState(-1);
  const [movesClick, setMC] = useState(false);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setMC(false);
    setLoc(-1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    if(nextMove===0) {
      setMC(false);
      setLoc(-1);
    }
    setMC(true);
  }

  useEffect(()=> {
    if(movesClick) {
    for(let i=0; i<currentSquares.length; i++) {
      if(history.length===2) {
          for(let j=0; j<9; j++) {
            if(history[1][j] !== null) {
              console.log(history);
              setLoc(j);
            }
          }
      }
      else {
      for(let x=0; x<9; x++) {
        if(currentMove>0 && history[currentMove][x] !== history[currentMove-1][x]) {
          setLoc(x);
        }
      }
    }
    }
  }
  },[currentMove]);

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} loc={loc}/>
        <hr></hr>
        <div className='flex'><span className='sq gr'></span> &nbsp; How Winner wins</div>
        <div className='flex'><span className='sq yl'></span> &nbsp; Represents Current Move</div>
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

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
      return {player : squares[a], boxs : [a,b,c]};
    }
  }
  return null;
}
