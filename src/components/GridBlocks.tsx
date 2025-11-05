
import React from "react";
import GridBlock from "./GridBlock";

interface BlockData {
  x: number;
  y: number;
  img?: string;
  audio?: string;
  promoMessage?: string;
}

interface GridBlocksProps {
  gridSize: number;
  totalBlocks: number;
  mergedBlocks: BlockData[];
  selection: string[];
  onBlockClick: (x: number, y: number) => void;
  isMobile?: boolean;
}

function getKey(x: number, y: number) {
  return `${x}-${y}`;
}

function isOccupied(x: number, y: number, mergedBlocks: BlockData[]) {
  return mergedBlocks.some((b) => b.x === x && b.y === y);
}

function getBlock(x: number, y: number, mergedBlocks: BlockData[]) {
  return mergedBlocks.find((b) => b.x === x && b.y === y);
}

const DESKTOP_GRID_SIZE = 36;

const GridBlocks: React.FC<GridBlocksProps> = ({
  gridSize,
  totalBlocks,
  mergedBlocks,
  selection,
  onBlockClick,
  isMobile,
}) => {
  // Pour mobile, taille du bloc fixe pour garantir l'aspect carré
  const MOBILE_BLOCK_SIZE = 54;
  const NB_ROWS = Math.ceil(totalBlocks / gridSize);
  const gridSizePx = isMobile ? gridSize * MOBILE_BLOCK_SIZE : undefined;

  return (
    <div
      className={`grid bg-white`}
      style={{
        gridTemplateColumns: `repeat(${gridSize}, minmax(${isMobile ? MOBILE_BLOCK_SIZE : 32}px, 1fr))`,
        gridTemplateRows: `repeat(${NB_ROWS}, minmax(${isMobile ? MOBILE_BLOCK_SIZE : 32}px, 1fr))`,
        // Pour le carré parfait :
        width: isMobile ? gridSizePx : "100vw",
        height: isMobile ? gridSizePx : `calc(100vw * ${NB_ROWS} / ${gridSize})`,
        minWidth: isMobile ? gridSizePx : undefined,
        minHeight: isMobile ? gridSizePx : undefined,
        maxWidth: isMobile ? gridSizePx : "100vw",
        maxHeight: isMobile ? gridSizePx : undefined,
        gap: "1px",
        border: "none",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      {Array.from({ length: totalBlocks }).map((_, idx) => {
        const x = Math.floor(idx / DESKTOP_GRID_SIZE);
        const y = idx % DESKTOP_GRID_SIZE;
        const occupied = isOccupied(x, y, mergedBlocks);
        const key = getKey(x, y);
        const selected = selection.includes(key);
        const block = getBlock(x, y, mergedBlocks);
        const imgUrl = block?.img;
        const isDotOnly = false;
        return (
          <GridBlock
            key={key}
            x={x}
            y={y}
            occupied={occupied}
            selected={selected}
            imgUrl={imgUrl}
            isDotOnly={isDotOnly}
            onClick={onBlockClick}
            isMobile={isMobile}
          />
        );
      })}
    </div>
  );
};

export default GridBlocks;
