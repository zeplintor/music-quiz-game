
import React from "react";

interface SelectionBarProps {
  count: number;
  total: number;
  onPrepareAudios: () => void;
  onClearSelection: () => void;
}

const SelectionBar: React.FC<SelectionBarProps> = ({
  count,
  total,
  onPrepareAudios,
  onClearSelection,
}) => (
  <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 bg-white border-2 border-[#00FF7F] px-8 py-4 flex flex-col md:flex-row items-center gap-3">
    <span className="font-medium text-[#444]">
      <b className="text-lg text-[#00FF7F]">{count}</b> block{count > 1 ? "s" : ""} selected
    </span>
    <button
      className="ml-4 px-4 py-1 bg-[#e5ffe7] text-[#00CC5F] font-semibold border border-[#00CC5F]"
      style={{ borderRadius: 0 }}
      onClick={onClearSelection}
    >
      Tout désélectionner
    </button>
    <span className="hidden md:inline mx-3 text-gray-300">|</span>
    <span className="font-semibold">
      Total: <span className="text-[#00FF7F] font-bold">{total}&nbsp;$</span>
    </span>
    <button
      className="ml-4 bg-[#00FF7F] text-[#111] px-8 py-2.5 font-bold uppercase text-base min-w-[180px] border-2 border-[#00FF7F]"
      onClick={onPrepareAudios}
    >
      Prepare my Audios
    </button>
  </div>
);

export default SelectionBar;

