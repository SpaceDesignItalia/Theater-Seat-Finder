import { useState } from "react";
import type { PlateaVisualizationProps } from "../types";
import { getValidSeats } from "../utils/seatsLogic";
import { Seat } from "./Seat";
import { ZoomableContainer, type ZoomControls } from "./ZoomableContainer";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

export function PalchiVisualization({
  selectedSeats,
  onSeatClick,
}: PlateaVisualizationProps) {
  const [zoomControls, setZoomControls] = useState<ZoomControls | null>(null);
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
      <div className="sticky top-0 z-20 bg-white p-2 md:p-3 border-b md:border-b-0 mb-1 md:mb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1"></div>
          <div className="text-center flex-1">
            <h2 className="text-xl md:text-2xl font-bold">PALCHI</h2>
          </div>
          <div className="flex-1 flex justify-end">
            {zoomControls && (
              <div className="flex items-center gap-1">
                {zoomControls.isZoomed && (
                  <Button
                    onPress={zoomControls.handleResetZoom}
                    size="sm"
                    isIconOnly
                    className="bg-white shadow-md hover:bg-gray-50 touch-manipulation min-w-[36px] min-h-[36px]"
                    aria-label="Reset zoom"
                  >
                    <Icon icon="mdi:fit-to-screen" className="text-lg" />
                  </Button>
                )}
                <Button
                  onPress={zoomControls.handleZoomOut}
                  size="sm"
                  isIconOnly
                  className="bg-white shadow-md hover:bg-gray-50 touch-manipulation min-w-[36px] min-h-[36px]"
                  aria-label="Zoom out"
                >
                  <Icon icon="mdi:minus" className="text-lg" />
                </Button>
                <Button
                  onPress={zoomControls.handleZoomIn}
                  size="sm"
                  isIconOnly
                  className="bg-white shadow-md hover:bg-gray-50 touch-manipulation min-w-[36px] min-h-[36px]"
                  aria-label="Zoom in"
                >
                  <Icon icon="mdi:plus" className="text-lg" />
                </Button>
                {zoomControls.isZoomed && (
                  <span className="text-xs font-semibold text-gray-600 ml-1">
                    {Math.round(zoomControls.zoom * 100)}%
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Container scrollabile e zoomabile per mobile */}
      <div
        className="overflow-auto overscroll-contain h-full"
        style={{
          WebkitOverflowScrolling: "touch",
        }}
      >
        <ZoomableContainer
          minZoom={0.333}
          maxZoom={3}
          initialZoom={0.333}
          onControlsReady={setZoomControls}
        >
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
                            onClick={
                              onSeatClick
                                ? () => onSeatClick(palcoNum, seat)
                                : undefined
                            }
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
