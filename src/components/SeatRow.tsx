import type { SeatRowProps } from "../types";
import { Seat } from "./Seat";

export function SeatRow({
  rowLabel,
  seats,
  selectedSeats,
  onSeatClick,
  isValidRow,
}: SeatRowProps) {
  if (!isValidRow) return null;

  // Separa i posti in dispari (sinistra) e pari (destra)
  const oddSeats: string[] = []; // Posti dispari per sinistra
  const evenSeats: string[] = []; // Posti pari per destra
  const bisSeats: string[] = []; // Posti "bis"

  seats.forEach((seat) => {
    if (seat.includes("Bis")) {
      bisSeats.push(seat);
    } else {
      const seatNum = parseInt(seat);
      if (!isNaN(seatNum)) {
        if (seatNum % 2 === 0) {
          evenSeats.push(seat);
        } else {
          oddSeats.push(seat);
        }
      }
    }
  });

  // Ordina i dispari dal più grande al più piccolo (23, 21, 19, ..., 3, 1)
  oddSeats.sort((a, b) => parseInt(b) - parseInt(a));

  // Ordina i pari dal più piccolo al più grande (2, 4, 6, ..., 26, 28)
  evenSeats.sort((a, b) => parseInt(a) - parseInt(b));

  // Determina la posizione dei posti "bis" in base al loro numero
  const leftBis: string[] = [];
  const rightBis: string[] = [];

  bisSeats.forEach((bis) => {
    // Estrai il numero dal nome "11Bis", "12Bis", etc.
    const numMatch = bis.match(/(\d+)Bis/);
    if (numMatch) {
      const num = parseInt(numMatch[1]);
      if (num % 2 === 0) {
        // Pari -> va a destra, dopo i pari
        rightBis.push(bis);
      } else {
        // Dispari -> va a sinistra, dopo i dispari
        leftBis.push(bis);
      }
    }
  });

  // Calcola quanti spazi vuoti servono prima del primo posto (sia sinistra che destra)
  const getEmptySpaces = (row: string): number => {
    const rowNum = parseInt(row);
    if (rowNum === 18 || rowNum === 19) {
      return 1; // 1 spazio vuoto
    } else if (rowNum === 20) {
      return 2; // 2 spazi vuoti
    } else if (rowNum === 21 || rowNum === 22) {
      return 6; // 6 spazi vuoti
    }
    return 0; // Nessuno spazio vuoto
  };

  const emptySpaces = getEmptySpaces(rowLabel);

  return (
    <div className="flex items-center gap-2 mb-2 w-full justify-center">
      <div className="flex items-center gap-2 max-w-fit">
        {/* Posti dispari a sinistra (dal più grande al più piccolo: 25, 23, ..., 3, 1) */}
        <div className="flex gap-2">
          {[...oddSeats, ...leftBis].map((seat) => (
            <Seat
              key={`${rowLabel}-${seat}-left`}
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
          {/* Spazi vuoti dopo i posti (verso il centro) - se necessario */}
          {emptySpaces > 0 &&
            Array.from({ length: emptySpaces }, (_, i) => (
              <div
                key={`empty-left-${i}`}
                className="w-6 h-6 sm:w-7 sm:h-7"
              ></div>
            ))}
        </div>

        {/* Separatore centrale con label della fila */}
        <div className="w-8 sm:w-10 flex items-center justify-center flex-shrink-0 mx-2">
          <div className="text-xs sm:text-sm font-semibold text-center">
            {rowLabel}
          </div>
        </div>

        {/* Posti pari a destra (dal più piccolo al più grande: 2, 4, ..., 26, 28) */}
        <div className="flex gap-2">
          {/* Spazi vuoti all'inizio (se necessario) */}
          {emptySpaces > 0 &&
            Array.from({ length: emptySpaces }, (_, i) => (
              <div
                key={`empty-right-${i}`}
                className="w-6 h-6 sm:w-7 sm:h-7"
              ></div>
            ))}
          {[...evenSeats, ...rightBis].map((seat) => (
            <Seat
              key={`${rowLabel}-${seat}-right`}
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
