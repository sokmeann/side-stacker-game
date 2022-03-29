import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import GameBoard from "./game";
import socketIOClient from "socket.io-client";

import "./App.css";

export type PartialGameData = {
  board: Array<Array<0 | 1 | 2>>;
  status: "created" | "in_progress" | "draw" | "completed";
  winner: 1 | 2 | null;
  currentTurn: 1 | 2;
};

const App = () => {
  const socket = socketIOClient(
    process.env.REACT_APP_SOCKET_ENDPOINT as string
  );

  const [gameId, setGameId] = useState<number | string | null>(
    localStorage.getItem("side-stacker-game-id")
  );
  const [uuid, setUuid] = useState<string | null>(
    localStorage.getItem("side-stacker-uuid")
  );
  const [gameData, setGameData] = useState({
    player_1: null,
    player_2: null,
    currentTurn: 1,
  });

  const [notifier, setNotifier] = useState({
    open: false,
    message: "",
    severity: "success",
  } as { open: boolean; message: string; severity: "error" | "warning" | "success" | "info" });

  const handleCloseNotifier = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setNotifier({ ...notifier, open: false });
  };

  const handleSetUuidToLocalStorage = (uuid: string) => {
    setUuid(uuid);
    localStorage.setItem("side-stacker-uuid", uuid);
  };

  const handleSetGameIdToLocalStorage = (gameId: number) => {
    setGameId(gameId);
    localStorage.setItem("side-stacker-game-id", gameId?.toString());
  };

  const handleEmitPlayerMoves = (
    move: { rowIdx: number; dir: "left" | "right" },
    gameData: PartialGameData
  ) => {
    socket.emit("player_move", { move, gameData: { ...gameData, id: gameId } });
  };

  const handleResetGame = () => {
    socket.emit("request_reset", uuid);
  };

  useEffect(() => {
    const search_params = window.location.search;

    if (search_params) {
      // Case 1: Request to join a specific game
      const query_term = "?gameId=";
      const query_term_index = search_params.indexOf(query_term);
      const requestJoinGameId =
        search_params[query_term_index + query_term.length];
      if (!uuid) {
        const newUuid = uuidv4();
        handleSetUuidToLocalStorage(newUuid);
        socket.emit("request-join-game", {
          uuid: newUuid,
          gameId: requestJoinGameId,
        });
      } else {
        socket.emit("request-join-game", { uuid, gameId: requestJoinGameId });
      }
    } else if (!uuid) {
      // Case 2: Not a join request, but first-time play (no uuid);
      const newUuid = uuidv4();
      handleSetUuidToLocalStorage(newUuid);
      socket.emit("game-init", { uuid: newUuid, gameId });
    } else {
      // Case 3: Not a join request, not first-time play (has uuid);
      socket.emit("game-init", { uuid, gameId });
    }

    socket.on("game-data", (data) => {
      handleSetGameIdToLocalStorage(data?.current_game?.id);
      setGameData(data?.current_game);
    });

    socket.on("updated-game-data", (data) => {
      setGameData(data);
    });

    socket.on("player-connect", (data) => {
      setGameData(data?.current_game);
      setNotifier({
        ...notifier,
        open: true,
        message: `Player #${data?.new_player} has joined.`,
      });
    });

    return function disconnect() {
      socket.disconnect();
    };
  }, [gameId, uuid]);

  const { player_1, player_2 } = gameData;
  const self = uuid === player_1 ? 1 : uuid === player_2 ? 2 : null;
  const gameReady = player_1 && player_2;

  if (process.env.NODE_ENV === "development") {
    console.log("DEVELOPMENT LOGS");
    console.log("self", self);
    console.log("uuid", uuid, "gameId", gameId);
    console.log("gameData", gameData);
  }

  return (
    <div className="app">
      <GameBoard
        ready={gameReady}
        self={self}
        gameId={gameId}
        notifier={notifier}
        handleCloseNotifier={handleCloseNotifier}
        handleEmitPlayerMoves={handleEmitPlayerMoves}
        handleResetGame={handleResetGame}
        gameData={gameData}
      />
    </div>
  );
};

export default App;
