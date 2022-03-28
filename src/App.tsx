import { useState } from "react";
import "./App.css";
import { SideStackerGame } from "./game";
import Row from "./components/row";
import SidePlayZone from "./components/side_play_zone";

const App = () => {
  const Game = new SideStackerGame(7, 7);
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [board, setBoard] = useState(Game.createBoard());
  const [winner, setWinner] = useState(Game.getWinner());
  const [numTokens, setNumTokens] = useState(0);

  const resetGame = () => {
    Game.reset();
    setBoard(Game.createBoard());
    setCurrentPlayer(1);
    setNumTokens(0);
    setWinner(false);
  };

  const getNextPlayer = (currentPlayer: number) => {
    return currentPlayer === 1 ? 2 : 1;
  };

  const addToken = (rowIdx: number, dir: "left" | "right") => {
    if (Game.canAddToken([...board[rowIdx]])) {
      setBoard([...Game.addToken(dir, currentPlayer, rowIdx, board)]);
      setCurrentPlayer(getNextPlayer(currentPlayer));
      setNumTokens(numTokens + 1);
      setWinner(Game.getWinner());
    }
  };

  const checkRowAvail = (rowIdx: number) => {
    return Game.canAddToken([...board[rowIdx]]);
  };

  return (
    <div className="app">
      <div className="game-wrapper">
        <h1>SIDE-STACKER GAME</h1>
        {numTokens === 49 ? (
          <div>
            <h3 className="announcement">{`Board is full, no one wins.`}</h3>
            <button className="reset" onClick={resetGame}>
              New Game
            </button>
          </div>
        ) : winner ? (
          <div>
            <h3 className="announcement">{`Game ended. Player ${winner} won!!`}</h3>
            <button className="reset" onClick={resetGame}>
              New Game
            </button>
          </div>
        ) : (
          <h3>{`Current Turn: Player ${currentPlayer}`}</h3>
        )}
        <div className="board-wrapper">
          {!winner && (
            <SidePlayZone
              numRows={Game.numRows}
              onClick={(rowIdx: number) => addToken(rowIdx, "left")}
              currentPlayer={currentPlayer}
              checkRowAvail={checkRowAvail}
            />
          )}
          <div className="game-board">
            {board.map((row: Array<0 | 1 | 2>, i: number) => (
              <Row key={i} data={row} />
            ))}
          </div>
          {!winner && (
            <SidePlayZone
              numRows={Game.numRows}
              onClick={(rowIdx: number) => addToken(rowIdx, "right")}
              currentPlayer={currentPlayer}
              checkRowAvail={checkRowAvail}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
