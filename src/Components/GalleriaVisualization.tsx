import type { PlateaVisualizationProps } from "../types";
import { getValidSeats } from "../utils/seatsLogic";
import { SeatRow } from "./SeatRow";
import { GalleriaLateralColumn } from "./GalleriaLateralColumn";
import { ZoomableContainer } from "./ZoomableContainer";

export function GalleriaVisualization({
  selectedSeats,
  onSeatClick,
}: PlateaVisualizationProps) {
  // Funzione per ottenere i posti di una fila
  const getRowSeats = (row: string): string[] => {
    return getValidSeats(row, "Galleria");
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg">
      {/* Titolo - sticky su mobile */}
      <div className="sticky top-0 z-20 bg-white p-2 md:p-3 border-b md:border-b-0 mb-1 md:mb-3">
        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-bold">GALLERIA</h2>
        </div>
      </div>

      {/* Container scrollabile e zoomabile per mobile */}
      <div
        className="overflow-auto overscroll-contain h-full"
        style={{
          WebkitOverflowScrolling: "touch",
        }}
      >
        <ZoomableContainer minZoom={0.3} maxZoom={3} initialZoom={0.5}>
          {/* Container principale con laterali */}
          <div className="flex gap-2 md:gap-4 justify-center items-start min-w-max px-2 md:px-4 pb-4">
            {/* Laterale sinistra */}
            <div className="flex-shrink-0 flex flex-row gap-6 items-end">
              {/* Fila 1-SX (più lontana dal centro) - 2 colonne verticali */}
              <GalleriaLateralColumn
                rowLabel="1-SX"
                seats={getRowSeats("1-SX")}
                selectedSeats={selectedSeats}
                onSeatClick={onSeatClick}
              />
              {/* Fila A-SX (più vicina al centro) - 2 colonne verticali */}
              <GalleriaLateralColumn
                rowLabel="A-SX"
                seats={getRowSeats("A-SX")}
                selectedSeats={selectedSeats}
                onSeatClick={onSeatClick}
              />
            </div>

            {/* Sezioni principali */}
            <div className="flex flex-col gap-2">
              <div className="h-96" />
              {/* File principali A e 1-6 */}
              {["A", "1"].map((row) => (
                <SeatRow
                  key={row}
                  rowLabel={row}
                  seats={getRowSeats(row)}
                  selectedSeats={selectedSeats}
                  onSeatClick={onSeatClick}
                  isValidRow={true}
                />
              ))}{" "}
              <div className="mb-6" />
              {["2", "3", "4", "5", "6"].map((row) => (
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

            {/* Laterale destra */}
            <div className="flex-shrink-0 flex flex-row gap-6 items-end">
              {/* Fila A-DX (più vicina al centro) - 2 colonne verticali */}
              <GalleriaLateralColumn
                rowLabel="A-DX"
                seats={getRowSeats("A-DX")}
                selectedSeats={selectedSeats}
                onSeatClick={onSeatClick}
              />
              {/* Fila 1-DX (più lontana dal centro) - 2 colonne verticali */}
              <GalleriaLateralColumn
                rowLabel="1-DX"
                seats={getRowSeats("1-DX")}
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
