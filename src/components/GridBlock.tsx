
import React from "react";

interface GridBlockProps {
  x: number;
  y: number;
  occupied: boolean;
  selected: boolean;
  imgUrl?: string;
  isDotOnly: boolean;
  onClick: (x: number, y: number) => void;
  isMobile?: boolean;
  audioUrl?: string;
}

const BORDER_COLOR = "#e4e7ec";
const OCCUPIED_FILL = "#bae6fd";
const AUDIO_ONLY_FILL = "#d1eaff";
const SELECTED_BG = "#d6ffef";
const HOVER_BG = "#ebfff6";

const GridBlock: React.FC<GridBlockProps> = ({
  x, y, occupied, selected, imgUrl, isDotOnly, onClick, isMobile,
}) => {
  const hasAudioNoImg = occupied && !imgUrl;

  // Taille plus grosse sur mobile + aspect carré réel
  const blockSize = isMobile ? 54 : undefined;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Block [${x}, ${y}]`}
      onClick={() => onClick(x, y)}
      className={`
        relative box-border flex items-center justify-center 
        cursor-pointer select-none
        aspect-square
        transition-all
        ${selected ? "ring-2 ring-[#00FF7F] z-10" : ""}
        hover:scale-105 hover:shadow-md
        hover:bg-[${HOVER_BG}]
      `}
      style={{
        width: blockSize,
        height: blockSize,
        minWidth: blockSize,
        minHeight: blockSize,
        // Pour l'affichage mobile : garder carrément la taille fixe plutôt que maxWidth/maxHeight
        // (corrige le bug où les blocs whd rectangulaires apparaissaient sur mobile)
        ...(isMobile
          ? {
              aspectRatio: "1 / 1",
              width: blockSize,
              height: blockSize,
              minWidth: blockSize,
              minHeight: blockSize,
            }
          : {}),
        border: `1px solid ${BORDER_COLOR}`,
        background: imgUrl
          ? "transparent"
          : hasAudioNoImg
            ? AUDIO_ONLY_FILL
            : (occupied && isDotOnly)
              ? OCCUPIED_FILL
              : selected
                ? SELECTED_BG
                : "#fff",
        outline: "none",
        outlineOffset: "-2px",
        padding: 0,
        overflow: "hidden",
        borderRadius: 0,
        boxShadow: "none",
        transition: "background 0.1s, transform 0.15s, box-shadow 0.15s",
      }}
    >
      {imgUrl && (
        <img
          src={imgUrl}
          alt=""
          className="absolute left-0 top-0 w-full h-full object-cover"
          style={{ opacity: 0.95 }}
          draggable={false}
          aria-hidden="true"
        />
      )}
      {!occupied && selected && (
        <span
          className="absolute left-1/2 top-1/2 w-3 h-3 bg-[#00FF7F] rounded-full opacity-75"
          style={{ transform: "translate(-50%, -50%)" }}
        />
      )}
    </div>
  );
};

export default GridBlock;

