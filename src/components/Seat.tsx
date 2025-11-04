import type { SeatProps } from "../types";

export function Seat({ row, seat, isValid, isSelected, onClick }: SeatProps) {
  if (!isValid) return null;

  const isClickable = !!onClick;

  return (
    <button
      onClick={onClick}
      disabled={!isClickable}
      className={`seat w-7 h-7 sm:w-8 sm:h-8 md:w-7 md:h-7 flex items-center justify-center text-[10px] sm:text-xs font-semibold rounded transition-all duration-200 touch-manipulation ${
        isSelected
          ? "bg-red-500 text-white shadow-lg scale-110 z-10"
          : isClickable
          ? "bg-gray-300 hover:bg-gray-400 active:bg-gray-500 text-gray-700 cursor-pointer"
          : "bg-gray-300 text-gray-700 cursor-default"
      }`}
      title={`Fila ${row}, Posto ${seat}`}
      aria-label={`Fila ${row}, Posto ${seat}`}
    >
      {seat}
    </button>
  );
}
