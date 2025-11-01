import type { LateralColumnProps } from "../types";
import { Seat } from "./Seat";

export function LateralColumn({
  side,
  seats,
  selectedSeats,
  onSeatClick,
}: LateralColumnProps) {
  return (
    <div className="flex flex-col gap-1 items-center mt-9 gap-6.5">
      <div className="text-xs font-bold mb-1">{side}</div>
      {seats.map((seat, index) => (
        <Seat
          key={`${side}-${seat}-${index}`}
          row={side}
          seat={seat}
          isValid={true}
          isSelected={selectedSeats.some(
            (s) =>
              String(s.row) === String(side) && String(s.seat) === String(seat)
          )}
          onClick={() => onSeatClick(side, seat)}
        />
      ))}
    </div>
  );
}
