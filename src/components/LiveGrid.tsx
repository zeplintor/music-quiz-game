
// Grille purement illustrative, statique/mockée
const GRID_SIZE = 20;
const MOCK_OCCUPIED = [
  [2, 10], [5, 15], [8,4], [12,11], [14,7], [16,2], [18, 13]
];

function isOccupied(x: number, y: number) {
  return MOCK_OCCUPIED.some(([i, j]) => i === x && j === y);
}

const LiveGrid = () => (
  <div className="overflow-x-auto mx-auto my-10 max-w-4xl">
    <div 
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(14px, 1fr))`,
        gap: 2,
      }}
    >
      {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
        const x = Math.floor(idx / GRID_SIZE), y = idx % GRID_SIZE;
        const occupied = isOccupied(x, y);
        return (
          <div
            key={`${x}-${y}`}
            className={`aspect-square rounded-[2px] border transition-all ${
              occupied
                ? "bg-[#00FF7F] border-[#00FF7F]"
                : "bg-white border-gray-200"
            }`}
            style={{ width: 17, minWidth: 13 }}
          />
        );
      })}
    </div>
    <div className="text-xs text-gray-400 text-center mt-2">
      Aperçu en direct : blocs occupés = vert, disponibles = blanc
    </div>
  </div>
);

export default LiveGrid;
