const PlayZone = ({
  numRows,
  onClick,
  currentTurn,
  checkRowAvail,
}: {
  numRows: number;
  currentTurn: 1 | 2;
  onClick: (rowIdx: number) => void;
  checkRowAvail: (rowIdx: number) => boolean;
}) => {
  const zone = [0, 1, 2, 3, 4, 5, 6];
  return (
    <div className="play-zone">
      {zone.map((val, i) => {
        return checkRowAvail(val) ? (
          <div
            key={i}
            className={`token play-token-${currentTurn}`}
            onClick={() => onClick(i)}
          >
            <span>Play</span>
          </div>
        ) : (
          <div key={i} className={`token row-full`}>
            <span>Full</span>
          </div>
        );
      })}
    </div>
  );
};

export default PlayZone;
