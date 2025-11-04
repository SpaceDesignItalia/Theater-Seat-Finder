import { useState } from "react";
import type { PlateaVisualizationProps } from "../types";
import { getValidSeats } from "../utils/seatsLogic";
import { SeatRow } from "./SeatRow";
import { LateralColumn } from "./LateralColumn";
import { ZoomableContainer, type ZoomControls } from "./ZoomableContainer";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

export function PlateaVisualization({
  selectedSeats,
  onSeatClick,
}: PlateaVisualizationProps) {
  const [zoomControls, setZoomControls] = useState<ZoomControls | null>(null);
  // Funzione per ottenere i posti di una fila
  const getRowSeats = (row: string): string[] => {
    return getValidSeats(row, "Platea");
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg">
      {/* Titolo - sticky su mobile */}
      <div className="sticky top-0 z-20 bg-white p-2 md:p-3 border-b md:border-b-0 mb-1 md:mb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1"></div>
          <div className="text-center flex-1">
            <h2 className="text-xl md:text-2xl font-bold mb-1">PLATEA</h2>
            <div className="text-xs md:text-sm text-gray-600">PALCOSCENICO</div>
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
          minZoom={0.2}
          maxZoom={3}
          initialZoom={0.2}
          onControlsReady={setZoomControls}
        >
          {/* Container principale con laterali */}
          <div className="flex gap-2 md:gap-4 justify-center items-start min-w-max px-2 md:px-4 pb-4">
            {/* Laterale sinistra (verticale) */}
            <div className="flex-shrink-0">
              {" "}
              <div className="h-12 w-1 bg-black ml-[-20px]" />
              <div className="absolute h-12 w-1 bg-black mt-75 ml-[-20px]" />
              <div className="mt-[-60px]">
                <LateralColumn
                  side="SX"
                  seats={getRowSeats("SX")}
                  selectedSeats={selectedSeats}
                  onSeatClick={onSeatClick}
                />{" "}
                <div className="absolute h-1 w-12 bg-black mt-25 ml-6" />
              </div>
            </div>

            {/* Sezioni principali - ogni fila è una sola fila con posti dispari a sinistra e pari a destra */}
            <div className="flex flex-col gap-2 ml-10 mr-10">
              {/* Primo settore (file 1-8) */}
              <div className="mb-6">
                {" "}
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
              {" "}
              <div className="h-12 w-0.5 bg-white" />
              <div className="mt-[-60px]">
                <LateralColumn
                  side="DX"
                  seats={getRowSeats("DX")}
                  selectedSeats={selectedSeats}
                  onSeatClick={onSeatClick}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-end items-center gap-2 mr-4">
            <div className="h-12 w-1 bg-black ml-4" />
            <p className="text-xs md:text-sm text-gray-600">
              Porte di ingresso
            </p>
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
