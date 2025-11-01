import type { PlateaVisualizationProps } from "../types";
import { getValidSeats } from "../utils/seatsLogic";
import { SeatRow } from "./SeatRow";
import { LateralColumn } from "./LateralColumn";
import { ZoomableContainer } from "./ZoomableContainer";

export function PlateaVisualization({
  selectedSeats,
  onSeatClick,
}: PlateaVisualizationProps) {
  // Funzione per ottenere i posti di una fila
  const getRowSeats = (row: string): string[] => {
    return getValidSeats(row, "Platea");
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg">
      {/* Titolo - sticky su mobile */}
      <div className="sticky top-0 z-20 bg-white p-2 md:p-4 border-b md:border-b-0 mb-2 md:mb-6">
        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">PLATEA</h2>
          <div className="text-xs md:text-sm text-gray-600">PALCOSCENICO</div>
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
          {/* Container principale con laterali */}
          <div className="flex gap-2 md:gap-4 justify-center items-start min-w-max px-2 md:px-4 pb-4">
            {/* Laterale sinistra (verticale) */}
            <div className="flex-shrink-0">
              <LateralColumn
                side="SX"
                seats={getRowSeats("SX")}
                selectedSeats={selectedSeats}
                onSeatClick={onSeatClick}
              />
            </div>

            {/* Sezioni principali - ogni fila è una sola fila con posti dispari a sinistra e pari a destra */}
            <div className="flex flex-col gap-2">
              {/* Primo settore (file 1-8) */}
              <div className="mb-6">
                <div className="text-xs font-bold mb-2 text-center">
                  1° settore
                </div>
                {[
                  "A",
                  "B",
                  ...Array.from({ length: 8 }, (_, i) => (i + 1).toString()),
                ].map((row) => (
                  <SeatRow
                    key={row}
                    rowLabel={row}
                    seats={getRowSeats(row)}
                    selectedSeats={selectedSeats}
                    onSeatClick={onSeatClick}
                    isValidRow={true}
                  />
                ))}
              </div>

              {/* Secondo settore (file 9-16) */}
              <div className="mb-6">
                <div className="text-xs font-bold mb-2 text-center">
                  2° settore
                </div>
                {Array.from({ length: 8 }, (_, i) => (i + 9).toString()).map(
                  (row) => (
                    <SeatRow
                      key={row}
                      rowLabel={row}
                      seats={getRowSeats(row)}
                      selectedSeats={selectedSeats}
                      onSeatClick={onSeatClick}
                      isValidRow={true}
                    />
                  )
                )}
              </div>

              {/* Terzo settore (file 18-22) */}
              <div className="mb-6">
                <div className="text-xs font-bold mb-2 text-center">
                  3° settore
                </div>
                {Array.from({ length: 5 }, (_, i) => (i + 18).toString()).map(
                  (row) => (
                    <SeatRow
                      key={row}
                      rowLabel={row}
                      seats={getRowSeats(row)}
                      selectedSeats={selectedSeats}
                      onSeatClick={onSeatClick}
                      isValidRow={true}
                    />
                  )
                )}
              </div>
            </div>

            {/* Laterale destra (verticale) */}
            <div className="flex-shrink-0">
              <LateralColumn
                side="DX"
                seats={getRowSeats("DX")}
                selectedSeats={selectedSeats}
                onSeatClick={onSeatClick}
              />
            </div>
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
