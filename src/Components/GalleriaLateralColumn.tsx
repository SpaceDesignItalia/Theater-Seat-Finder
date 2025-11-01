import type { LateralColumnProps } from "../types";
import { Seat } from "./Seat";

interface GalleriaLateralColumnProps {
  rowLabel: string;
  seats: string[];
  selectedSeats: LateralColumnProps["selectedSeats"];
  onSeatClick: (row: string, seat: string) => void;
}

export function GalleriaLateralColumn({
  rowLabel,
  seats,
  selectedSeats,
  onSeatClick,
}: GalleriaLateralColumnProps) {
  // Separa i posti in dispari (sinistra) e pari (destra)
  const oddSeats: string[] = []; // Posti dispari per sinistra
  const evenSeats: string[] = []; // Posti pari per destra

  seats.forEach((seat) => {
    const seatNum = parseInt(seat);
    if (!isNaN(seatNum)) {
      if (seatNum % 2 === 0) {
        evenSeats.push(seat);
      } else {
        oddSeats.push(seat);
      }
    }
  });

  // Ordina i dispari dal più grande al più piccolo (verso il centro)
  oddSeats.sort((a, b) => parseInt(b) - parseInt(a));

  // Ordina i pari dal più piccolo al più grande (verso il centro)
  evenSeats.sort((a, b) => parseInt(a) - parseInt(b));

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Label della fila */}
      <div className="text-xs font-bold mb-1">{rowLabel}</div>

      {/* Container con due colonne: dispari a sinistra, pari a destra */}
      <div className="flex gap-2">
        {/* Colonna sinistra: posti dispari */}
        <div className="flex flex-col gap-1">
          {oddSeats.map((seat, index) => (
            <Seat
              key={`${rowLabel}-${seat}-odd-${index}`}
              row={rowLabel}
              seat={seat}
              isValid={true}
              isSelected={selectedSeats.some(
                (s) =>
                  String(s.row) === String(rowLabel) &&
                  String(s.seat) === String(seat)
              )}
              onClick={() => onSeatClick(rowLabel, seat)}
            />
          ))}
        </div>

        {/* Colonna destra: posti pari */}
        <div className="flex flex-col gap-1">
          {evenSeats.map((seat, index) => (
            <Seat
              key={`${rowLabel}-${seat}-even-${index}`}
              row={rowLabel}
              seat={seat}
              isValid={true}
              isSelected={selectedSeats.some(
                (s) =>
                  String(s.row) === String(rowLabel) &&
                  String(s.seat) === String(seat)
              )}
              onClick={() => onSeatClick(rowLabel, seat)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
