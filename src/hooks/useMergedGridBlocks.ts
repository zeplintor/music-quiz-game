
import { useMemo } from "react";

/**
 * Fusionne les blocs préremplis et les blocs uploadés pour la grille.
 * - Les blocs "uploadés" ont priorité, les "préremplis" occupent les trous.
 * - Retourne la liste des blocs fusionnés [{x, y, img, audio, promoMessage}]
 */
export function useMergedGridBlocks(uploadedBlocks: any[], preFilledBlocks: any[]) {
  return useMemo(() => {
    const uploads = (uploadedBlocks || []).map((b) => ({
      x: b.x,
      y: b.y,
      img: b.img,
      audio: b.audio,
      promoMessage: b.promoMessage,
    }));
    const demoBlocks = (preFilledBlocks || []).filter(
      (demo) => !uploads.some((u) => u.x === demo.x && u.y === demo.y)
    );
    return [...uploads, ...demoBlocks];
  }, [uploadedBlocks, preFilledBlocks]);
}
