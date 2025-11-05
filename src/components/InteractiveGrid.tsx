import React, { useState, useEffect } from "react";
import AudioPlayer from "./AudioPlayer";
import SelectionBar from "./SelectionBar";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { useGridBlocks } from "@/hooks/useGridBlocks";
import GridBlocks from "./GridBlocks";
import { useIsMobile } from "@/hooks/use-mobile";

// Paramètres constants
const GRID_SIZE_DESKTOP = 36;
const GRID_SIZE_MOBILE = 36; // On force 36 colonnes aussi pour permettre le scroll sur toute la grille !
const TOTAL_BLOCKS = 36 * 36; // 1296
const PRICE_PER_BLOCK = 5;

function getKey(x: number, y: number) {
  return `${x}-${y}`;
}

function isOccupied(x: number, y: number, mergedBlocks: any[]) {
  return mergedBlocks.some((b) => b.x === x && b.y === y);
}

function getBlock(x: number, y: number, mergedBlocks: any[]) {
  return mergedBlocks.find((b) => b.x === x && b.y === y);
}

const InteractiveGrid = () => {
  const isMobile = useIsMobile();
  const gridSize = isMobile ? GRID_SIZE_MOBILE : GRID_SIZE_DESKTOP;

  const [selection, setSelection] = useState<string[]>([]);
  const [audioPlayer, setAudioPlayer] = useState<any>(null);
  const navigate = useNavigate();
  const { user, loading } = useUser();
  const { blocks: mergedBlocks, loading: blocksLoading } = useGridBlocks();

  const availableBlocksCount = React.useMemo(() => {
    let count = 0;
    for (let idx = 0; idx < TOTAL_BLOCKS; idx++) {
      const x = Math.floor(idx / GRID_SIZE_DESKTOP);
      const y = idx % GRID_SIZE_DESKTOP;
      if (!isOccupied(x, y, mergedBlocks)) count++;
    }
    return count;
  }, [mergedBlocks]);

  const persistSelection = (selectionArr: string[]) => {
    window.localStorage.setItem("pendingBlockSelection", JSON.stringify(selectionArr));
  };
  const clearPersistedSelection = () => {
    window.localStorage.removeItem("pendingBlockSelection");
  };

  const handlePrepareAudios = () => {
    if (selection.length === 0) return;
    if (!user && !loading) {
      persistSelection(selection);
      navigate(`/auth?redirectTo=${encodeURIComponent(`/prepare?slots=${selection.join(",")}`)}`);
      return;
    }
    clearPersistedSelection();
    navigate(`/prepare?slots=${selection.join(",")}`);
  };

  useEffect(() => {
    const stored = window.localStorage.getItem("pendingBlockSelection");
    if (stored) {
      try {
        const arr = JSON.parse(stored);
        if (Array.isArray(arr) && arr.length > 0) setSelection(arr);
        clearPersistedSelection();
      } catch (e) {}
    }
  }, []);

  const handleBlockClick = (x: number, y: number) => {
    const block = getBlock(x, y, mergedBlocks);
    if (block) {
      setAudioPlayer({
        url: block.audio,
        pos: { x, y },
        promoMessage: block.promoMessage,
        imgUrl: block.img,
      });
      return;
    }
    const key = getKey(x, y);
    setSelection((sel) => {
      if (sel.includes(key)) return sel.filter((k) => k !== key);
      return [...sel, key];
    });
  };

  const handleClearSelection = () => {
    setSelection([]);
    clearPersistedSelection();
  };

  if (blocksLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-full py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00FF7F] mb-4"></div>
        <div className="text-[#00CC5F] text-lg font-bold">
          Chargement des blocks réservés et des uploads…
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center px-0">
      <div
        className={
          isMobile
            ? "relative flex items-start justify-center w-full overflow-x-auto overflow-y-auto"
            : "relative flex items-center justify-center w-full"
        }
        style={
          isMobile
            ? {
                width: "100vw",
                maxWidth: "100vw",
                height: "80vh",
                maxHeight: "100vh",
                overflow: "auto",
                // Taille "zoomée": 2200px pour la largeur = gros blocs à explorer, scrollables !
                minWidth: 1100,
              }
            : {
                width: "100vw",
                maxWidth: "100vw",
                aspectRatio: "1 / 1",
                padding: 0,
                margin: 0,
                boxSizing: "border-box",
              }
        }
      >
        <GridBlocks
          gridSize={gridSize}
          totalBlocks={TOTAL_BLOCKS}
          mergedBlocks={mergedBlocks}
          selection={selection}
          onBlockClick={handleBlockClick}
          // On transmet une prop isMobile pour styliser les blocks grossis
          isMobile={isMobile}
        />
      </div>
      {audioPlayer && (
        <AudioPlayer
          url={audioPlayer.url}
          pos={audioPlayer.pos}
          promoMessage={audioPlayer.promoMessage}
          imgUrl={audioPlayer.imgUrl}
          onClose={() => setAudioPlayer(null)}
        />
      )}
      {selection.length > 0 && (
        <SelectionBar
          count={selection.length}
          total={selection.length * 5}
          onPrepareAudios={handlePrepareAudios}
          onClearSelection={handleClearSelection}
        />
      )}
    </div>
  );
};

export default InteractiveGrid;
