const Row = ({ data }: { data: Array<0 | 1 | 2> }) => {
  return (
    <div className="game-row">
      {data.map((val, i) => (
        <div key={i} className={`token player-${val}`}></div>
      ))}
    </div>
  );
};

export default Row;
