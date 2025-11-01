import type { PlateaVisualizationProps } from "../types";
import { getValidSeats } from "../utils/seatsLogic";
import { Seat } from "./Seat";
import { ZoomableContainer } from "./ZoomableContainer";

export function PalchiVisualization({
  selectedSeats,
  onSeatClick,
}: PlateaVisualizationProps) {
  // Funzione per ottenere i posti di un palco
  const getPalcoSeats = (palcoNum: string): string[] => {
    return getValidSeats(palcoNum, "Palco");
  };

  // Ordina i posti per mostrare A, B in alto e C, D in basso
  const arrangeSeats = (seats: string[]) => {
    const ordered = ["A", "B", "C", "D"];
    return ordered.filter((seat) => seats.includes(seat));
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg">
      {/* Titolo - sticky su mobile */}
      <div className="sticky top-0 z-20 bg-white p-2 md:p-4 border-b md:border-b-0 mb-2 md:mb-6">
        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">PALCHI</h2>
        </div>
      </div>

      {/* Container scrollabile e zoomabile per mobile */}
      <div
        className="overflow-auto overscroll-contain"
        style={{
          WebkitOverflowScrolling: "touch",
          maxHeight: "calc(100vh - 200px)",
        }}
      >
        <ZoomableContainer minZoom={0.5} maxZoom={3} initialZoom={1}>
          {/* Container principale con i palchi */}
          <div className="flex gap-4 md:gap-6 justify-center items-start min-w-max px-2 md:px-4 pb-4">
            {Array.from({ length: 10 }, (_, i) => (i + 1).toString()).map(
              (palcoNum) => {
                const seats = getPalcoSeats(palcoNum);
                const arrangedSeats = arrangeSeats(seats);

                // Per i palchi 1 e 10 (3 posti), gestisci diversamente
                let displaySeats: (string | null)[] = [];
                if (palcoNum === "1" && arrangedSeats.length === 3) {
                  // Palco 1: A e B in alto, vuoto in basso a sinistra, C in basso a destra
                  displaySeats = [
                    arrangedSeats[0], // A
                    arrangedSeats[1], // B
                    null, // Vuoto
                    arrangedSeats[2], // C
                  ];
                } else if (palcoNum === "10" && arrangedSeats.length === 3) {
                  // Palco 10: A e B in alto, C in basso a sinistra, vuoto in basso a destra
                  displaySeats = [
                    arrangedSeats[0], // A
                    arrangedSeats[1], // B
                    arrangedSeats[2], // C
                    null, // Vuoto
                  ];
                } else {
                  // Per palchi 2-9, tutti e 4 i posti
                  displaySeats = arrangedSeats;
                }

                return (
                  <div
                    key={palcoNum}
                    className="flex flex-col items-center gap-2"
                  >
                    {/* Label del palco */}
                    <div className="text-xs md:text-sm font-bold mb-1">
                      Palco {palcoNum}
                    </div>

                    {/* Griglia 2x2 per i posti */}
                    <div className="grid grid-cols-2 gap-1.5 md:gap-2">
                      {displaySeats.map((seat, index) => {
                        if (seat === null) {
                          // Spazio vuoto
                          return (
                            <div
                              key={`palco-${palcoNum}-empty-${index}`}
                              className="w-6 h-6 sm:w-7 sm:h-7"
                            />
                          );
                        }
                        // Posto normale
                        return (
                          <Seat
                            key={`palco-${palcoNum}-${seat}`}
                            row={palcoNum}
                            seat={seat}
                            isValid={true}
                            isSelected={selectedSeats.some(
                              (s) =>
                                String(s.row) === String(palcoNum) &&
                                String(s.seat) === String(seat)
                            )}
                            onClick={() => onSeatClick(palcoNum, seat)}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </ZoomableContainer>
      </div>

      {/* Indicatore di scroll su mobile */}
      <div className="md:hidden text-center text-xs text-gray-400 py-2 border-t bg-gray-50">
        <span>← Scorri per navigare la mappa →</span>
      </div>
    </div>
  );
}
