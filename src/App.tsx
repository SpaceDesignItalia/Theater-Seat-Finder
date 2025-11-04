import { Button } from "@heroui/react";
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

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      {/* Sezione superiore fissa con gradiente - altezza minima fissa */}
      <div className="flex-shrink-0 flex flex-col items-center gap-1.5 md:gap-3 pt-2 md:pt-4 pb-1.5 md:pb-3 px-3 md:px-6 bg-gradient-to-b from-purple-50 via-white to-transparent">
        {/* Container per Pulsante Indietro e Logo - layout orizzontale */}
        <div className="flex items-center justify-between w-full max-w-4xl">
          {/* Pulsante Indietro */}
          <div className="min-w-[80px] md:min-w-[100px] flex items-center">
            {currentStep > 0 && (
              <Button
                onPress={() => {
                  if (currentStep === 2) {
                    setCurrentStep(1);
                  } else {
                    setCurrentStep(0);
                    setSelected(null);
                  }
                }}
                variant="bordered"
                size="sm"
                startContent={
                  <Icon
                    icon="mdi:arrow-left"
                    className="text-sm md:text-base"
                  />
                }
                className="text-xs md:text-sm min-h-[36px]"
              >
                <span className="hidden sm:inline">Indietro</span>
              </Button>
            )}
          </div>

          {/* Logo - centrato */}
          <div className="flex justify-center">
            <img
              src="/logo.png"
              alt="Logo Teatro"
              className="h-14 md:h-28 object-contain drop-shadow-md"
            />
          </div>

          {/* Spazio di bilanciamento */}
          <div className="min-w-[80px] md:min-w-[100px]"></div>
        </div>

        {/* Navigazione e Steps */}
        <div className="flex flex-col md:flex-row gap-1.5 md:gap-2 items-center justify-center w-full max-w-4xl mx-auto px-2">
          <div className="flex items-center justify-center w-full overflow-hidden">
            <RowSteps
              currentStep={currentStep}
              onStepChange={setCurrentStep}
              allowStepClick={false}
              className="w-full max-w-lg scale-90 md:scale-100"
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

        {/* Sezione selezionata - compatta */}
        <AnimatePresence mode="wait">
          {selected && (
            <m.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{
                duration: 0.3,
              }}
              className="w-full max-w-4xl px-1 md:px-0"
            >
              <div className="flex items-center justify-center gap-2 md:gap-3 bg-white rounded-lg md:rounded-xl shadow-md px-2.5 md:px-4 py-1.5 md:py-3 border border-purple-100">
                <Icon
                  icon={getSectionIcon(selected)}
                  className="text-base md:text-2xl text-purple-600 flex-shrink-0"
                />
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[8px] md:text-[10px] font-medium text-gray-500 uppercase tracking-wide">
                    Sezione
                  </span>
                  <span className="text-xs md:text-base font-bold text-purple-700 truncate">
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
                    className="p-1.5 md:p-2 rounded-full hover:bg-purple-100 active:bg-purple-200 transition-colors flex-shrink-0 touch-manipulation"
                    title="Cambia sezione"
                  >
                    <Icon
                      icon="mdi:pencil"
                      className="text-sm md:text-base text-purple-600"
                    />
                  </m.button>
                )}
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>

      {/* Contenuto centrale */}
      <div className="flex-1 flex items-center justify-center px-3 md:px-4 overflow-hidden">
        {currentStep === 0 && (
          <div className="w-full max-w-4xl py-2 md:py-0">
            <h1 className="text-xl md:text-4xl font-bold text-center mb-4 md:mb-12 text-gray-800 px-2">
              Seleziona la Sezione del Teatro
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 pb-4 md:pb-0">
              {sections.map((section) => (
                <Button
                  key={section.key}
                  onPress={() => {
                    setSelected(section.key as SectionType);
                    setCurrentStep(1); // Passa allo step successivo
                  }}
                  className={`h-auto py-5 md:py-8 px-4 md:px-6 flex flex-col items-center gap-2.5 md:gap-4 transition-all duration-300 touch-manipulation ${
                    selected === section.key
                      ? "bg-primary-600 text-white shadow-2xl scale-105"
                      : "bg-white text-gray-700 hover:bg-purple-50 hover:shadow-lg active:scale-95"
                  }`}
                  variant={selected === section.key ? "solid" : "bordered"}
                  size="lg"
                >
                  <Icon
                    icon={section.icon}
                    className={`text-4xl md:text-6xl ${
                      selected === section.key
                        ? "text-white"
                        : "text-primary-600"
                    }`}
                  />
                  <div className="flex flex-col items-center gap-0.5 md:gap-1">
                    <span className="text-lg md:text-2xl font-bold">
                      {section.label}
                    </span>
                    <span
                      className={`text-xs md:text-sm ${
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
          <div className="w-full max-w-4xl py-2 md:py-0 overflow-y-auto max-h-full">
            <div className="mb-4 md:mb-8">
              {/* Controlli per la selezione */}
              <div className="bg-white rounded-2xl md:rounded-3xl border-2 border-primary-200 p-4 md:p-10">
                <h1 className="text-lg md:text-4xl font-bold text-center mb-4 md:mb-10 text-gray-900 px-2">
                  Seleziona fila e il posto
                </h1>
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
                <div className="flex justify-center mt-4 md:mt-8">
                  <Button
                    onPress={handleAddSeat}
                    color="primary"
                    size="lg"
                    startContent={
                      <Icon icon="mdi:plus" className="text-lg md:text-xl" />
                    }
                    isDisabled={!selectedRow || !selectedSeat}
                  >
                    Aggiungi Posto
                  </Button>
                </div>
              </div>

              {/* Lista posti selezionati */}
              {selectedSeatsList.length > 0 && (
                <div className="rounded-2xl bg-white md:rounded-3xl shadow-lg border-2 border-primary-200 p-4 md:p-8 mt-4 md:mt-6">
                  {/* Header con titolo e pulsante cancella tutto */}
                  <div className="flex items-center justify-between mb-4 md:mb-6 gap-3">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg shadow-md">
                        <Icon
                          icon="mdi:ticket-confirmation"
                          className="text-lg md:text-2xl text-white"
                        />
                      </div>
                      <div className="flex flex-col">
                        <h3 className="text-base md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                          Posti Selezionati
                          <span className="inline-flex items-center justify-center min-w-[24px] md:min-w-[32px] h-6 md:h-8 px-2 md:px-3 text-xs md:text-base font-bold bg-primary-600 text-white rounded-full shadow-md">
                            {selectedSeatsList.length}
                          </span>
                        </h3>
                        <span className="text-[10px] md:text-xs text-gray-500 font-medium">
                          {selectedSeatsList.length === 1
                            ? "Posto selezionato"
                            : "Posti selezionati"}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedSeatsList([])}
                      className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded-lg md:rounded-xl font-semibold text-xs md:text-sm shadow-md hover:shadow-lg transition-all duration-200 touch-manipulation"
                      title="Cancella tutti i posti"
                    >
                      <Icon
                        icon="mdi:delete-sweep"
                        className="text-sm md:text-lg"
                      />
                      <span className="hidden sm:inline">Cancella tutto</span>
                      <span className="sm:hidden">Cancella</span>
                    </button>
                  </div>

                  {/* Container posti con scrollbar personalizzata */}
                  <div className="flex flex-wrap gap-2 md:gap-3 justify-center max-h-40 md:max-h-48 overflow-y-auto px-1 py-1 scrollbar-custom">
                    {selectedSeatsList.map((seat, index) => (
                      <div
                        key={`${seat.row}-${seat.seat}-${index}`}
                        className="group relative rounded-2xl px-4 py-2.5 transition-all duration-300 flex items-center gap-2.5 border-2 border-primary-200 hover:scale-105 active:scale-95"
                      >
                        <div className="p-1.5 bg-white/20 backdrop-blur-sm rounded-lg">
                          <Icon
                            icon="mdi:seat"
                            className="text-lg  flex-shrink-0"
                          />
                        </div>
                        <span className="font-bold text-sm md:text-base  tracking-wide">
                          {seat.row}-{seat.seat}
                        </span>
                        <button
                          onClick={() => handleRemoveSeat(seat.row, seat.seat)}
                          className="p-1.5 rounded-full bg-white/20 hover:bg-red-500  hover:rotate-90 transition-all duration-300 group-hover:bg-white/30 active:scale-90"
                          title="Rimuovi posto"
                        >
                          <Icon icon="mdi:close" className="text-base" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Footer con info aggiuntive */}
                  <div className="mt-4 md:mt-5 pt-3 md:pt-4 border-t border-primary-200 flex items-center justify-center gap-2">
                    <Icon
                      icon="mdi:information-outline"
                      className="text-primary-600 text-sm md:text-base"
                    />
                    <p className="text-[10px] md:text-xs text-gray-600 text-center">
                      Clicca sulla ✕ per rimuovere un singolo posto
                    </p>
                  </div>
                </div>
              )}

              {/* Bottone per continuare */}
              <div className="flex justify-center mt-4 md:mt-8">
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
                    <Icon
                      icon="mdi:arrow-right"
                      className="text-lg md:text-xl"
                    />
                  }
                >
                  Visualizza Mappa
                </Button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && stage && (
          <div className="w-full max-w-7xl h-full flex flex-col">
            {/* Header fisso con titolo e info */}
            <div className="flex-shrink-0 py-1 md:py-2">
              <h1 className="text-lg md:text-4xl font-bold text-center mb-2 md:mb-3 text-gray-800 px-2">
                Mappa del Teatro
              </h1>

              {/* Informazioni sul posto selezionato */}

              <div className="rounded-2xl md:rounded-3xl border-2 border-primary-200 p-4 md:p-6 animate-fade-in">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
                  {/* Info Section */}
                  <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full md:w-auto">
                    {/* Sezione */}
                    <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-xl px-4 py-3 border border-primary-100 hover:shadow-lg transition-all duration-200">
                      <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg shadow-sm">
                        <Icon
                          icon={getSectionIcon(selected)}
                          className="text-2xl md:text-3xl text-white"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] md:text-xs font-semibold text-primary-600 uppercase tracking-wider">
                          Sezione
                        </span>
                        <span className="text-base md:text-xl font-bold text-gray-900">
                          {selected}
                        </span>
                      </div>
                    </div>

                    {/* Divider verticale nascosto su mobile */}
                    <div className="hidden md:block w-px h-12 bg-gradient-to-b from-transparent via-primary-300 to-transparent"></div>

                    {/* Posti */}
                    <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-xl px-4 py-3 border border-primary-100 hover:shadow-lg transition-all duration-200 min-w-0 w-full md:w-auto">
                      <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg shadow-sm flex-shrink-0">
                        <Icon
                          icon="mdi:ticket-confirmation"
                          className="text-2xl md:text-3xl text-white"
                        />
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-[10px] md:text-xs font-semibold text-primary-600 uppercase tracking-wider">
                          {selectedSeatsList.length === 1 ? "Posto" : "Posti"}
                        </span>
                        <span className="text-base md:text-xl font-bold text-gray-900 truncate">
                          {selectedSeatsList.length === 1
                            ? `${selectedSeatsList[0].row}-${selectedSeatsList[0].seat}`
                            : `${selectedSeatsList.length} ${
                                selectedSeatsList.length === 1
                                  ? "posto"
                                  : "posti"
                              }`}
                        </span>
                        {selectedSeatsList.length > 1 && (
                          <div className="flex gap-1 mt-1.5 flex-wrap max-w-[280px]">
                            {selectedSeatsList.slice(0, 3).map((s, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] md:text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-semibold"
                              >
                                {s.row}-{s.seat}
                              </span>
                            ))}
                            {selectedSeatsList.length > 3 && (
                              <span className="text-[10px] md:text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-semibold">
                                +{selectedSeatsList.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Visualizzazione grafica della mappa - scrollabile */}
            {selectedSeatsList.length > 0 && (
              <div className="flex-1 overflow-y-auto mt-2 md:mt-3 min-h-0">
                {selected === "Platea" && (
                  <PlateaVisualization selectedSeats={selectedSeatsList} />
                )}
                {selected === "Galleria" && (
                  <GalleriaVisualization selectedSeats={selectedSeatsList} />
                )}
                {selected === "Palchi" && (
                  <PalchiVisualization selectedSeats={selectedSeatsList} />
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="py-2 md:py-4 px-3 md:px-6 backdrop-blur-sm border-t border-gray-100 flex-shrink-0">
        <div className="flex items-center justify-center">
          <p className="text-[10px] md:text-sm text-gray-600 flex items-center justify-center gap-1 md:gap-2">
            <span>Powered By</span>
            <a
              href="https://spacedesign-italia.it"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-red-600 hover:text-red-700 transition-colors touch-manipulation inline-flex items-center"
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
