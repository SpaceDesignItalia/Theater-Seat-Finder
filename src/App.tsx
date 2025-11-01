import { Button, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import RowSteps from "./Components/Layout/RowSteps";

type SectionType = "Platea" | "Galleria" | "Palchi" | null;

function App() {
  const [selected, setSelected] = useState<SectionType>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);

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

  return (
    <div className="h-screen w-screen flex flex-col">
      {/* Sezione superiore fissa con gradiente */}
      <div className="flex flex-col items-center gap-3 md:gap-6 pt-3 md:pt-8 pb-3 md:pb-6 px-3 md:px-0 bg-gradient-to-b from-purple-50 via-white to-transparent">
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-center justify-between w-full max-w-4xl mx-auto">
          {currentStep > 0 && (
            <div className="flex items-center justify-start w-full md:w-auto order-1">
              <Button
                onPress={() => {
                  setCurrentStep(0);
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
                  title: "Cerca posto",
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
                {currentStep === 1 && (
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
        {currentStep === 1 && (
          <div className="w-full max-w-4xl">
            <h1 className="text-2xl md:text-4xl font-bold text-center mb-6 md:mb-12 text-gray-800 px-2">
              Cerca posto
            </h1>
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
