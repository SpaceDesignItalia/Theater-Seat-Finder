export interface SeatProps {
  row: string;
  seat: string;
  isValid: boolean;
  isSelected: boolean;
  onClick: () => void;
}

export interface SeatRowProps {
  rowLabel: string;
  seats: string[];
  selectedSeats: SeatSelection[];
  onSeatClick: (row: string, seat: string) => void;
  isValidRow: boolean;
}

export interface PlateaVisualizationProps {
  selectedSeats: SeatSelection[];
  onSeatClick: (row: string, seat: string) => void;
}

export interface GalleriaVisualizationProps {
  selectedSeats: SeatSelection[];
  onSeatClick: (row: string, seat: string) => void;
}

export interface PalchiVisualizationProps {
  selectedSeats: SeatSelection[];
  onSeatClick: (row: string, seat: string) => void;
}

export interface LateralColumnProps {
  side: string;
  seats: string[];
  selectedSeats: SeatSelection[];
  onSeatClick: (row: string, seat: string) => void;
}

export interface SeatSelection {
  row: string;
  seat: string;
}

export type Stage = "Platea" | "Galleria" | "Palco";
