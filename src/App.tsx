import { Button, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useState, useEffect, useMemo } from "react";
import { m, AnimatePresence } from "framer-motion";
import RowSteps from "./Components/Layout/RowSteps";
import type { Stage } from "./types";
import { getValidSeats, getSector } from "./utils/seatsLogic";
import { PlateaVisualization } from "./Components/PlateaVisualization";
import { GalleriaVisualization } from "./Components/GalleriaVisualization";
import { PalchiVisualization } from "./Components/PalchiVisualization";
import { TheaterControls } from "./Components/TheaterControls";

type SectionType = "Platea" | "Galleria" | "Palchi" | null;

function App() {
  const [selected, setSelected] = useState<SectionType>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Stati per la selezione del posto
  const [selectedRow, setSelectedRow] = useState<string>("A");
  const [selectedSeat, setSelectedSeat] = useState<string>("1");

  // Array di posti selezionati (possono essere su file diverse)
  const [selectedSeatsList, setSelectedSeatsList] = useState<
    Array<{ row: string; seat: string }>
  >([]);

  const sections = [
    {
      key: "Platea",
      label: "Platea",
      icon: "mdi:seat",
      description: "Posti in platea",
    },
    {
      key: "Galleria",
      label: "Galleria",
      icon: "mdi:stairs",
      description: "Posti in galleria",
    },
    {
      key: "Palchi",
      label: "Palchi",
      icon: "mdi:crown",
      description: "Posti nei palchi",
    },
  ] as const;

  const getSectionIcon = (sectionKey: SectionType) => {
    switch (sectionKey) {
      case "Platea":
        return "mdi:seat";
      case "Galleria":
        return "mdi:stairs";
      case "Palchi":
        return "mdi:crown";
      default:
        return "mdi:seat";
    }
  };

  // Converte SectionType in Stage
  const stage = selected === "Palchi" ? "Palco" : (selected as Stage | null);

  // Reset della fila e del posto quando cambia la sezione
  useEffect(() => {
    if (selected === "Platea") {
      setSelectedRow("A");
      setSelectedSeat("1");
      setSelectedSeatsList([]);
    } else if (selected === "Galleria") {
      setSelectedRow("A");
      setSelectedSeat("1");
      setSelectedSeatsList([]);
    } else if (selected === "Palchi") {
      setSelectedRow("1");
      setSelectedSeat("A");
      setSelectedSeatsList([]);
    }
  }, [selected]);

  // Calcola i posti validi in base alla fila e alla sezione selezionati
  const validSeats = useMemo(
    () => (stage ? getValidSeats(selectedRow, stage) : []),
    [selectedRow, stage]
  );

  // Calcola il settore della fila selezionata (solo per Platea)
  const sector = useMemo(
    () => (selected === "Platea" ? getSector(selectedRow) : null),
    [selectedRow, selected]
  );

  // Reset del posto selezionato quando cambia la fila, mantenendo un valore valido
  useEffect(() => {
    if (validSeats.length > 0 && !validSeats.includes(selectedSeat)) {
      setSelectedSeat(validSeats[0]);
    }
  }, [selectedRow, validSeats, selectedSeat]);

  // Funzione per aggiungere un posto alla lista
  const handleAddSeat = () => {
    if (!selectedRow || !selectedSeat) {
      return;
    }

    const newSeat = { row: selectedRow, seat: selectedSeat };
    // Controlla se il posto è già nella lista
    const exists = selectedSeatsList.some(
      (s) => s.row === newSeat.row && s.seat === newSeat.seat
    );

    if (!exists) {
      setSelectedSeatsList((prev) => [...prev, newSeat]);
    }
  };

  // Funzione per rimuovere un posto dalla lista
  const handleRemoveSeat = (row: string, seat: string) => {
    setSelectedSeatsList((prev) =>
      prev.filter((s) => !(s.row === row && s.seat === seat))
    );
  };

  // Funzione per gestire il click su un posto nella visualizzazione grafica (toggle)
  const handleSeatClick = (row: string, seat: string) => {
    // Toggle del posto nella lista
    const exists = selectedSeatsList.some(
      (s) => s.row === row && s.seat === seat
    );
    if (exists) {
      handleRemoveSeat(row, seat);
    } else {
      setSelectedSeatsList((prev) => [...prev, { row, seat }]);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col">
      {/* Sezione superiore fissa con gradiente */}
      <div className="flex flex-col items-center gap-3 md:gap-6 pt-3 md:pt-8 pb-3 md:pb-6 px-3 md:px-0 bg-gradient-to-b from-purple-50 via-white to-transparent">
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-center justify-between w-full max-w-4xl mx-auto">
          {currentStep > 0 && (
            <div className="flex items-center justify-start w-full md:w-auto order-1">
              <Button
                onPress={() => {
                  if (currentStep === 2) {
                    setCurrentStep(1);
                  } else {
                    setCurrentStep(0);
                  }
                }}
                variant="bordered"
                size="sm"
                className="min-w-fit"
                startContent={
                  <Icon
                    icon="mdi:arrow-left"
                    className="text-base md:text-lg"
                  />
                }
              >
                Indietro
              </Button>
            </div>
          )}
          <div className="flex-1 flex items-center justify-center w-full order-2">
            <RowSteps
              currentStep={currentStep}
              onStepChange={setCurrentStep}
              allowStepClick={false}
              className="w-full max-w-md mx-auto"
              steps={[
                {
                  title: "Scelta posizione",
                },
                {
                  title: "Seleziona posto",
                },
                {
                  title: "Visualizza mappa",
                },
              ]}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {selected && (
            <m.div
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                duration: 0.4,
              }}
              className="flex flex-col items-center gap-3"
            >
              <div className="flex items-center gap-2 md:gap-3 bg-white rounded-xl md:rounded-2xl shadow-lg px-4 md:px-6 py-3 md:py-4 border border-purple-100 w-full max-w-xs md:max-w-none">
                <Icon
                  icon={getSectionIcon(selected)}
                  className="text-2xl md:text-3xl text-purple-600 flex-shrink-0"
                />
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Sezione selezionata
                  </span>
                  <span className="text-lg md:text-xl font-bold text-purple-700 truncate">
                    {selected}
                  </span>
                </div>
                {(currentStep === 1 || currentStep === 2) && (
                  <m.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setCurrentStep(0);
                      setSelected(null);
                    }}
                    className="ml-2 md:ml-4 p-1.5 md:p-2 rounded-full hover:bg-purple-100 transition-colors flex-shrink-0"
                    title="Cambia sezione"
                  >
                    <Icon
                      icon="mdi:pencil"
                      className="text-base md:text-lg text-purple-600"
                    />
                  </m.button>
                )}
              </div>

              {currentStep === 1 && (
                <m.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Chip
                    color="secondary"
                    variant="flat"
                    size="sm"
                    startContent={
                      <Icon
                        icon="mdi:information-outline"
                        className="text-sm"
                      />
                    }
                  >
                    Puoi cambiare sezione in qualsiasi momento
                  </Chip>
                </m.div>
              )}
            </m.div>
          )}
        </AnimatePresence>
      </div>

      {/* Contenuto centrale */}
      <div className="flex-1 flex items-center justify-center px-4 md:px-0 overflow-y-auto">
        {currentStep === 0 && (
          <div className="w-full max-w-4xl">
            <h1 className="text-2xl md:text-4xl font-bold text-center mb-6 md:mb-12 text-gray-800 px-2">
              Seleziona la Sezione del Teatro
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 pb-4 md:pb-0">
              {sections.map((section) => (
                <Button
                  key={section.key}
                  onPress={() => {
                    setSelected(section.key as SectionType);
                    setCurrentStep(1); // Passa allo step successivo
                  }}
                  className={`h-auto py-6 md:py-8 px-4 md:px-6 flex flex-col items-center gap-3 md:gap-4 transition-all duration-300 ${
                    selected === section.key
                      ? "bg-primary-600 text-white shadow-2xl scale-105"
                      : "bg-white text-gray-700 hover:bg-purple-50 hover:shadow-lg"
                  }`}
                  variant={selected === section.key ? "solid" : "bordered"}
                  size="lg"
                >
                  <Icon
                    icon={section.icon}
                    className={`text-5xl md:text-6xl ${
                      selected === section.key
                        ? "text-white"
                        : "text-primary-600"
                    }`}
                  />
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xl md:text-2xl font-bold">
                      {section.label}
                    </span>
                    <span
                      className={`text-sm ${
                        selected === section.key
                          ? "text-white"
                          : "text-gray-500"
                      }`}
                    >
                      {section.description}
                    </span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}
        {currentStep === 1 && stage && (
          <div className="w-full max-w-4xl">
            <div className="mb-6 md:mb-8">
              <h1 className="text-2xl md:text-4xl font-bold text-center mb-4 md:mb-6 text-gray-800 px-2">
                Seleziona Fila e Posto
              </h1>

              {/* Controlli per la selezione */}
              <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                <TheaterControls
                  selectedStage={stage}
                  selectedRow={selectedRow}
                  selectedSeat={selectedSeat}
                  validSeats={validSeats}
                  sector={sector}
                  hideAreaSelection={true}
                  allowMultiple={false}
                  onStageChange={() => {
                    // Non permettere cambio stage da qui, solo da step 0
                  }}
                  onRowChange={setSelectedRow}
                  onSeatChange={(seat) => {
                    if (seat) {
                      setSelectedSeat(seat as string);
                    }
                  }}
                />

                {/* Bottone per aggiungere il posto */}
                <div className="flex justify-center mt-4">
                  <Button
                    onPress={handleAddSeat}
                    color="primary"
                    size="md"
                    startContent={<Icon icon="mdi:plus" className="text-lg" />}
                    isDisabled={!selectedRow || !selectedSeat}
                    className="min-w-[150px]"
                  >
                    Aggiungi Posto
                  </Button>
                </div>
              </div>

              {/* Lista posti selezionati */}
              {selectedSeatsList.length > 0 && (
                <m.div className="bg-white rounded-lg shadow-md p-4 md:p-6 mt-4">
                  <h3 className="text-lg font-bold mb-3 text-center">
                    Posti Selezionati ({selectedSeatsList.length})
                  </h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {selectedSeatsList.map((seat, index) => (
                      <Chip
                        key={`${seat.row}-${seat.seat}-${index}`}
                        onClose={() => handleRemoveSeat(seat.row, seat.seat)}
                        variant="flat"
                        color="primary"
                        size="md"
                      >
                        {seat.row}-{seat.seat}
                      </Chip>
                    ))}
                  </div>
                </m.div>
              )}

              {/* Bottone per continuare */}
              <div className="flex justify-center mt-6 md:mt-8">
                <Button
                  onPress={() => {
                    if (selectedSeatsList.length > 0) {
                      setCurrentStep(2);
                    }
                  }}
                  color="primary"
                  size="lg"
                  isDisabled={selectedSeatsList.length === 0}
                  endContent={
                    <Icon icon="mdi:arrow-right" className="text-lg" />
                  }
                  className="min-w-[200px]"
                >
                  Visualizza Mappa
                </Button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && stage && (
          <div className="w-full max-w-7xl">
            <div className="mb-4 md:mb-6">
              <h1 className="text-2xl md:text-4xl font-bold text-center mb-4 md:mb-6 text-gray-800 px-2">
                Mappa del Teatro
              </h1>

              {/* Informazioni sul posto selezionato */}
              <m.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-4 md:mb-6"
              >
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Icon
                        icon={getSectionIcon(selected)}
                        className="text-2xl text-purple-600"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-gray-500 uppercase">
                          Sezione
                        </span>
                        <span className="text-lg font-bold text-purple-700">
                          {selected}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon
                        icon="mdi:numeric"
                        className="text-2xl text-purple-600"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-gray-500 uppercase">
                          {selectedSeatsList.length === 1 ? "Posto" : "Posti"}
                        </span>
                        <span className="text-lg font-bold text-purple-700">
                          {selectedSeatsList.length === 1
                            ? `${selectedSeatsList[0].row}-${selectedSeatsList[0].seat}`
                            : `${selectedSeatsList.length} posti selezionati`}
                        </span>
                        {selectedSeatsList.length > 1 && (
                          <span className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                            {selectedSeatsList
                              .map((s) => `${s.row}-${s.seat}`)
                              .join(", ")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    onPress={() => setCurrentStep(1)}
                    variant="bordered"
                    size="sm"
                    startContent={
                      <Icon icon="mdi:pencil" className="text-base" />
                    }
                  >
                    Modifica
                  </Button>
                </div>
              </m.div>
            </div>

            {/* Visualizzazione grafica della mappa */}
            {selectedSeatsList.length > 0 && (
              <div className="mt-4 md:mt-6">
                {selected === "Platea" && (
                  <PlateaVisualization
                    selectedSeats={selectedSeatsList}
                    onSeatClick={handleSeatClick}
                  />
                )}
                {selected === "Galleria" && (
                  <GalleriaVisualization
                    selectedSeats={selectedSeatsList}
                    onSeatClick={handleSeatClick}
                  />
                )}
                {selected === "Palchi" && (
                  <PalchiVisualization
                    selectedSeats={selectedSeatsList}
                    onSeatClick={handleSeatClick}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="py-3 px-4 md:py-4 md:px-6 backdrop-blur-sm border-t border-gray-100">
        <div className="flex items-center justify-center">
          <p className="text-xs md:text-sm text-gray-600 flex items-center gap-1.5 md:gap-2 flex-wrap justify-center">
            <span>Powered By</span>
            <a
              href="https://spacedesign-italia.it"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-red-600 whitespace-nowrap"
            >
              🚀 Space Design Italia
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
