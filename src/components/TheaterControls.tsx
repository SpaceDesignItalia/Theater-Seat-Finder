import { Autocomplete, AutocompleteItem } from "@heroui/react";
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
  allowMultiple = false,
  onRowChange,
  onSeatChange,
}: TheaterControlsProps) {
  const selectedSeatsArray = Array.isArray(selectedSeat)
    ? selectedSeat
    : [selectedSeat];

  return (
    <div className="space-y-3 md:space-y-5">
      {selectedStage === "Platea" && sector && (
        <div className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 md:py-3 bg-primary-50/50 rounded-lg md:rounded-xl border border-primary-100">
          <span className="text-xs md:text-sm font-medium text-gray-600">
            Settore:
          </span>
          <span className="text-lg md:text-xl font-bold text-primary">
            {sector}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {selectedStage === "Platea" && (
          <>
            <Autocomplete
              label="Fila"
              variant="bordered"
              color="primary"
              size="lg"
              radius="lg"
              selectedKey={selectedRow}
              onSelectionChange={(key) => {
                onRowChange(key as string);
              }}
            >
              <>
                <AutocompleteItem key="A">A</AutocompleteItem>
                <AutocompleteItem key="B">B</AutocompleteItem>
                {Array.from({ length: 22 }, (_, index) => index + 1).map(
                  (row) => (
                    <AutocompleteItem key={row.toString()}>
                      {row.toString()}
                    </AutocompleteItem>
                  )
                )}
                <AutocompleteItem key="DX">DX</AutocompleteItem>
                <AutocompleteItem key="SX">SX</AutocompleteItem>
              </>
            </Autocomplete>
            <Autocomplete
              variant="bordered"
              color="primary"
              size="lg"
              radius="lg"
              label={allowMultiple ? "Posti" : "Posto"}
              selectedKey={
                allowMultiple ? selectedSeatsArray[0] : selectedSeatsArray[0]
              }
              onSelectionChange={(key) => {
                if (allowMultiple) {
                  onSeatChange([key as string]);
                } else {
                  if (key) {
                    onSeatChange(key as string);
                  }
                }
              }}
            >
              {validSeats.map((seat) => (
                <AutocompleteItem key={seat}>{seat}</AutocompleteItem>
              ))}
            </Autocomplete>
          </>
        )}

        {selectedStage === "Galleria" && (
          <>
            <Autocomplete
              label="Fila"
              variant="bordered"
              color="primary"
              size="lg"
              radius="lg"
              selectedKey={selectedRow}
              onSelectionChange={(key) => {
                onRowChange(key as string);
              }}
            >
              <>
                <AutocompleteItem key="A">A</AutocompleteItem>
                <AutocompleteItem key="1">1</AutocompleteItem>
                {Array.from({ length: 5 }, (_, index) => index + 2).map(
                  (row) => (
                    <AutocompleteItem key={row.toString()}>
                      {row.toString()}
                    </AutocompleteItem>
                  )
                )}
                <AutocompleteItem key="A-SX">
                  A-SX (Laterale Sinistra)
                </AutocompleteItem>
                <AutocompleteItem key="A-DX">
                  A-DX (Laterale Destra)
                </AutocompleteItem>
                <AutocompleteItem key="1-SX">
                  1-SX (Laterale Sinistra)
                </AutocompleteItem>
                <AutocompleteItem key="1-DX">
                  1-DX (Laterale Destra)
                </AutocompleteItem>
              </>
            </Autocomplete>
            <Autocomplete
              label={allowMultiple ? "Posti" : "Posto"}
              variant="bordered"
              color="primary"
              size="lg"
              radius="lg"
              selectedKey={
                allowMultiple ? selectedSeatsArray[0] : selectedSeatsArray[0]
              }
              onSelectionChange={(key) => {
                if (allowMultiple) {
                  onSeatChange([key as string]);
                } else {
                  if (key) {
                    onSeatChange(key as string);
                  }
                }
              }}
            >
              {validSeats.map((seat) => (
                <AutocompleteItem key={seat}>{seat}</AutocompleteItem>
              ))}
            </Autocomplete>
          </>
        )}

        {selectedStage === "Palco" && (
          <>
            <Autocomplete
              label="Palco"
              variant="bordered"
              color="primary"
              size="lg"
              radius="lg"
              selectedKey={selectedRow}
              onSelectionChange={(key) => {
                onRowChange(key as string);
              }}
            >
              {Array.from({ length: 10 }, (_, index) => index + 1).map(
                (palco) => (
                  <AutocompleteItem key={palco.toString()}>
                    Palco {palco}
                  </AutocompleteItem>
                )
              )}
            </Autocomplete>
            <Autocomplete
              label={allowMultiple ? "Posti" : "Posto"}
              variant="bordered"
              color="primary"
              size="lg"
              radius="lg"
              selectedKey={
                allowMultiple ? selectedSeatsArray[0] : selectedSeatsArray[0]
              }
              onSelectionChange={(key) => {
                if (allowMultiple) {
                  onSeatChange([key as string]);
                } else {
                  if (key) {
                    onSeatChange(key as string);
                  }
                }
              }}
            >
              {validSeats.map((seat) => (
                <AutocompleteItem key={seat}>{seat}</AutocompleteItem>
              ))}
            </Autocomplete>
          </>
        )}
      </div>
    </div>
  );
}
