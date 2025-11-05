
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useUploadedBlocks() {
  const [uploads, setUploads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchUploads() {
      setLoading(true);
      // Correction : syntaxe relationnelle Supabase pour la jointure
      const { data, error } = await supabase
        .from("uploads")
        .select("block_id,audio_url,image_url,message,claimed_blocks(grid_x,grid_y)")
        .neq("audio_url", null);
      if (!isMounted) return;
      if (error) {
        setUploads([]);
      } else {
        // Adapter à la forme des données retournées :
        // row.claimed_blocks peut être null si upload orphelin
        const blocks = (data || []).map((row: any) => ({
          x: row?.claimed_blocks?.grid_x,
          y: row?.claimed_blocks?.grid_y,
          audio: row.audio_url,
          img: row.image_url,
          promoMessage: row.message,
        })).filter(b => b.x !== undefined && b.y !== undefined);
        setUploads(blocks);
      }
      setLoading(false);
    }
    fetchUploads();
    // Refresh on focus for live UI
    const onFocus = () => fetchUploads();
    window.addEventListener("focus", onFocus);
    return () => {
      isMounted = false;
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  return { uploads, loading };
}
