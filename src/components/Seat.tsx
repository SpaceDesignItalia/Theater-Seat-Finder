import type { SeatProps } from "../types";

export function Seat({ row, seat, isValid, isSelected, onClick }: SeatProps) {
  if (!isValid) return null;

  return (
    <button
      onClick={onClick}
      className={`seat w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-[10px] sm:text-xs font-semibold rounded transition-all duration-200 ${
        isSelected
          ? "bg-red-500 text-white shadow-lg scale-110 z-10"
          : "bg-gray-300 hover:bg-gray-400 text-gray-700"
      }`}
      title={`Fila ${row}, Posto ${seat}`}
    >
      {seat}
    </button>
  );
}
