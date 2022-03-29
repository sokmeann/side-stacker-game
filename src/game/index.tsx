import { useState } from "react";
import { SideStackerGame } from "./game.constructor";
import Row from "../components/row";
import SidePlayZone from "../components/side_play_zone";
import Notifier from "../components/notifier";

import { PartialGameData } from "../App";

const Game = ({
  ready,
  self,
  gameId,
  notifier,
  handleCloseNotifier,
  handleEmitPlayerMoves,
  handleResetGame,
  gameData,
}: {
  ready: boolean | null;
  self: number | null;
  gameId: number | string | null;
  notifier: {
    open: boolean;
    message: string;
    severity: "error" | "warning" | "success" | "info";
  };
  handleCloseNotifier: (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => void;
  handleEmitPlayerMoves: (
    move: { rowIdx: number; dir: "left" | "right" },
    gameData: PartialGameData
  ) => void;
  handleResetGame: any;
  gameData: any;
}) => {
  const Game = new SideStackerGame(7, 7);
  const {
    board = Game.createBoard(),
    currentTurn = 1,
    winner = null,
  } = gameData;

  const [numTokens, setNumTokens] = useState(0);

  const resetGame = () => {
    Game.reset();
    setNumTokens(0);
    handleResetGame();
  };

  const getNextTurn = (currentTurn: number) => {
    return currentTurn === 1 ? 2 : 1;
  };

  const addToken = (rowIdx: number, dir: "left" | "right") => {
    if (Game.canAddToken([...board[rowIdx]])) {
      const newBoard = [...Game.addToken(dir, currentTurn, rowIdx, board)];
      const nextTurn = getNextTurn(currentTurn);
      const checkedWinner = Game.getWinner();
      setNumTokens(numTokens + 1);
      handleEmitPlayerMoves(
        { rowIdx, dir },
        {
          board: newBoard,
          status:
            numTokens === 49 ? "draw" : !winner ? "in_progress" : "completed",
          winner: checkedWinner,
          currentTurn: nextTurn,
        }
      );
    }
  };

  const checkRowAvail = (rowIdx: number) => {
    return Game.canAddToken([...board[rowIdx]]);
  };

  const canPlay = ready && !winner && self === currentTurn;

  return (
    <div className="game-wrapper">
      <h1>SIDE-STACKER GAME</h1>
      {!ready ? (
        <div>
          <h3 className="warning">{`Waiting for your opponent... URL to join this game:`}</h3>
          <h3 className="warning">{`${process.env.REACT_APP_BASE_URL}/?gameId=${gameId}`}</h3>
        </div>
      ) : (
        <div>
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
            self && (
              <h3
                className={`player-${self}-color`}
              >{`You are ${`Player #${self}`} - ${
                currentTurn === self ? "It's your turn!" : "Wait for your turn!"
              }`}</h3>
            )
          )}
        </div>
      )}
      <div className="board-wrapper">
        {canPlay && (
          <SidePlayZone
            numRows={Game.numRows}
            onClick={(rowIdx: number) => addToken(rowIdx, "left")}
            currentTurn={currentTurn}
            checkRowAvail={checkRowAvail}
          />
        )}
        <div className="game-board">
          {board.map((row: Array<0 | 1 | 2>, i: number) => (
            <Row key={i} data={row} />
          ))}
        </div>
        {canPlay && (
          <SidePlayZone
            numRows={Game.numRows}
            onClick={(rowIdx: number) => addToken(rowIdx, "right")}
            currentTurn={currentTurn}
            checkRowAvail={checkRowAvail}
          />
        )}
      </div>
      <Notifier
        open={notifier.open}
        handleClose={handleCloseNotifier}
        severity={notifier.severity}
        message={notifier.message}
      />
    </div>
  );
};

export default Game;
