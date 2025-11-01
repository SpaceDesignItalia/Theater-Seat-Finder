import { Select, SelectItem } from "@heroui/react";
import type { Stage } from "../types";

interface TheaterControlsProps {
  selectedStage: Stage;
  selectedRow: string;
  selectedSeat: string | string[];
  validSeats: string[];
  sector: string | null;
  hideAreaSelection?: boolean;
  allowMultiple?: boolean;
  onStageChange: (stage: Stage) => void;
  onRowChange: (row: string) => void;
  onSeatChange: (seat: string | string[]) => void;
}

export function TheaterControls({
  selectedStage,
  selectedRow,
  selectedSeat,
  validSeats,
  sector,
  hideAreaSelection = false,
  allowMultiple = false,
  onStageChange,
  onRowChange,
  onSeatChange,
}: TheaterControlsProps) {
  const selectedSeatsArray = Array.isArray(selectedSeat)
    ? selectedSeat
    : [selectedSeat];
  const selectedSeatsSet = new Set(selectedSeatsArray);

  return (
    <div className="mb-2 md:mb-4 bg-white p-2 md:p-4 rounded-lg shadow-md">
      <div
        className={`grid gap-2 md:gap-4 ${
          hideAreaSelection
            ? "grid-cols-1 md:grid-cols-2"
            : "grid-cols-1 md:grid-cols-3"
        }`}
      >
        {!hideAreaSelection && (
          <Select
            label="Area"
            selectedKeys={[selectedStage]}
            onSelectionChange={(keys) =>
              onStageChange(keys.currentKey as Stage)
            }
          >
            <SelectItem key="Platea">Platea</SelectItem>
            <SelectItem key="Galleria">Galleria</SelectItem>
            <SelectItem key="Palco">Palco</SelectItem>
          </Select>
        )}

        {selectedStage === "Platea" && (
          <>
            {sector && (
              <div className="flex items-center justify-center p-2 bg-gray-100 rounded">
                <strong>Settore:</strong> {sector}
              </div>
            )}
            <Select
              label="Fila"
              selectedKeys={[selectedRow]}
              onSelectionChange={(keys) => {
                onRowChange(keys.currentKey as string);
              }}
            >
              <>
                <SelectItem key="A">A</SelectItem>
                <SelectItem key="B">B</SelectItem>
                {Array.from({ length: 22 }, (_, index) => index + 1).map(
                  (row) => (
                    <SelectItem key={row.toString()}>
                      {row.toString()}
                    </SelectItem>
                  )
                )}
                <SelectItem key="DX">DX</SelectItem>
                <SelectItem key="SX">SX</SelectItem>
              </>
            </Select>
            <Select
              label={allowMultiple ? "Posti" : "Posto"}
              selectedKeys={
                allowMultiple ? selectedSeatsSet : selectedSeatsArray
              }
              selectionMode={allowMultiple ? "multiple" : "single"}
              onSelectionChange={(keys) => {
                if (allowMultiple) {
                  const selectedArray = Array.from(keys) as string[];
                  onSeatChange(selectedArray);
                } else {
                  const selectedKey = keys.currentKey as string;
                  if (selectedKey) {
                    onSeatChange(selectedKey);
                  }
                }
              }}
            >
              {validSeats.map((seat) => (
                <SelectItem key={seat}>{seat}</SelectItem>
              ))}
            </Select>
          </>
        )}

        {selectedStage === "Galleria" && (
          <>
            <Select
              label="Fila"
              selectedKeys={[selectedRow]}
              onSelectionChange={(keys) => {
                onRowChange(keys.currentKey as string);
              }}
            >
              <>
                <SelectItem key="A">A</SelectItem>
                <SelectItem key="1">1</SelectItem>
                {Array.from({ length: 5 }, (_, index) => index + 2).map(
                  (row) => (
                    <SelectItem key={row.toString()}>
                      {row.toString()}
                    </SelectItem>
                  )
                )}
                <SelectItem key="A-SX">A-SX (Laterale Sinistra)</SelectItem>
                <SelectItem key="A-DX">A-DX (Laterale Destra)</SelectItem>
                <SelectItem key="1-SX">1-SX (Laterale Sinistra)</SelectItem>
                <SelectItem key="1-DX">1-DX (Laterale Destra)</SelectItem>
              </>
            </Select>
            <Select
              label={allowMultiple ? "Posti" : "Posto"}
              selectedKeys={
                allowMultiple ? selectedSeatsSet : selectedSeatsArray
              }
              selectionMode={allowMultiple ? "multiple" : "single"}
              onSelectionChange={(keys) => {
                if (allowMultiple) {
                  const selectedArray = Array.from(keys) as string[];
                  onSeatChange(selectedArray);
                } else {
                  const selectedKey = keys.currentKey as string;
                  if (selectedKey) {
                    onSeatChange(selectedKey);
                  }
                }
              }}
            >
              {validSeats.map((seat) => (
                <SelectItem key={seat}>{seat}</SelectItem>
              ))}
            </Select>
          </>
        )}

        {selectedStage === "Palco" && (
          <>
            <Select
              label="Palco"
              selectedKeys={[selectedRow]}
              onSelectionChange={(keys) => {
                onRowChange(keys.currentKey as string);
              }}
            >
              {Array.from({ length: 10 }, (_, index) => index + 1).map(
                (palco) => (
                  <SelectItem key={palco.toString()}>Palco {palco}</SelectItem>
                )
              )}
            </Select>
            <Select
              label={allowMultiple ? "Posti" : "Posto"}
              selectedKeys={
                allowMultiple ? selectedSeatsSet : selectedSeatsArray
              }
              selectionMode={allowMultiple ? "multiple" : "single"}
              onSelectionChange={(keys) => {
                if (allowMultiple) {
                  const selectedArray = Array.from(keys) as string[];
                  onSeatChange(selectedArray);
                } else {
                  const selectedKey = keys.currentKey as string;
                  if (selectedKey) {
                    onSeatChange(selectedKey);
                  }
                }
              }}
            >
              {validSeats.map((seat) => (
                <SelectItem key={seat}>{seat}</SelectItem>
              ))}
            </Select>
          </>
        )}
      </div>
    </div>
  );
}
