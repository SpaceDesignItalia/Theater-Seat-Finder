// Funzione helper per aggiungere posti pari/dispari
export function addSeatsByParity(
  seats: string[],
  minDispari: number,
  maxDispari: number,
  minPari: number,
  maxPari: number
) {
  // Aggiungi posti dispari
  for (let i = minDispari; i <= maxDispari; i++) {
    if (i % 2 !== 0) seats.push(i.toString());
  }
  // Aggiungi posti pari
  for (let i = minPari; i <= maxPari; i++) {
    if (i % 2 === 0) seats.push(i.toString());
  }
}

// Funzione per ottenere il settore di una fila
export function getSector(row: string): string | null {
  const rowNum = parseInt(row);

  if (isNaN(rowNum)) {
    // Fila letterale (A, B) o laterale (DX, SX) - nessun settore specificato
    return null;
  }

  // Primo settore: file da 1 a 8
  if (rowNum >= 1 && rowNum <= 8) {
    return "Primo Settore";
  }

  // Secondo settore: file da 9 a 16
  if (rowNum >= 9 && rowNum <= 16) {
    return "Secondo Settore";
  }

  // Terzo settore: file da 18 a 22
  if (rowNum >= 18 && rowNum <= 22) {
    return "Terzo Settore";
  }

  // Fila 17 non appartiene a nessun settore specificato
  return null;
}

// Funzione per ottenere i posti validi in base alla fila e allo stage
export function getValidSeats(row: string, stage: string): string[] {
  const seats: string[] = [];

  if (stage === "Platea") {
    switch (row) {
      case "A":
        // FILA A: PARI: posti da 2 a 28 – DISPARI: posti da 1 a 23
        addSeatsByParity(seats, 1, 25, 2, 26);
        break;

      case "B":
        // FILA B: come la fila 1 - PARI: posti da 2 a 28 – DISPARI: posti da 1 a 27
        addSeatsByParity(seats, 1, 27, 2, 28);
        break;

      case "18":
      case "19":
        // FILA 18 PARI: posti da 4 a 26 – DISPARI: posti da 3 a 23 (manca un posto)
        addSeatsByParity(seats, 1, 23, 2, 24);
        break;

      case "20":
        // FILA 20 PARI: posti da 4 a 26 – DISPARI: posti da 3 a 23 (manca un posto)
        addSeatsByParity(seats, 3, 23, 4, 24);
        break;

      case "21":
      case "22":
        // FILA 21 e 22 PARI: posti da 2 a 14 – DISPARI: posti da 1 a 13 (mancano 5 posti)
        addSeatsByParity(seats, 1, 13, 2, 14);
        break;

      case "DX":
        // FILA LATERALE: DX, posti da 2 a 26 (+12bis)
        for (let i = 2; i <= 26; i += 2) {
          seats.push(i.toString());
        }
        seats.push("12Bis");
        break;

      case "SX":
        // FILA LATERALE: SX, posti da 1 a 25 (+11bis e 19bis)
        for (let i = 1; i <= 25; i += 2) {
          seats.push(i.toString());
        }
        seats.push("11Bis");
        seats.push("19Bis");
        break;

      default: {
        // FILE da 1 a 19: PARI: posti da 2 a 28 – DISPARI posti da 1 a 27
        // Gestisce anche la fila 17 se esiste
        const rowNum = parseInt(row);
        if (rowNum >= 1 && rowNum <= 19) {
          addSeatsByParity(seats, 1, 27, 2, 28);
        }
        break;
      }
    }
  } else if (stage === "Galleria") {
    switch (row) {
      case "A":
        // FILA A: PARI: posti da 2 a 20 – DISPARI: posti da 1 a 19
        addSeatsByParity(seats, 1, 19, 2, 20);
        break;

      case "1":
        // FILA 1: PARI: posti da 2 a 24 – DISPARI: posti da 1 a 23
        addSeatsByParity(seats, 1, 23, 2, 24);
        break;

      case "A-SX":
        // FILA LATERALE: A-SX, posti da 21 a 49
        for (let i = 21; i <= 49; i += 2) {
          seats.push(i.toString());
        }
        break;

      case "A-DX":
        // FILA LATERALE: A-DX, posti da 22 a 50
        for (let i = 22; i <= 50; i += 2) {
          seats.push(i.toString());
        }
        break;

      case "1-SX":
        // FILA LATERALE: 1-SX, posti da 25 a 41
        for (let i = 25; i <= 41; i += 2) {
          seats.push(i.toString());
        }
        break;

      case "1-DX":
        // FILA LATERALE: 1-DX, posti da 26 a 42
        for (let i = 26; i <= 42; i += 2) {
          seats.push(i.toString());
        }
        break;

      default: {
        // FILE da 2 a 6: PARI: posti da 2 a 24 – DISPARI: posti da 1 a 23
        const rowNum = parseInt(row);
        if (rowNum >= 2 && rowNum <= 6) {
          addSeatsByParity(seats, 1, 23, 2, 24);
        }
        break;
      }
    }
  } else if (stage === "Palco") {
    // PALCHI 1 e 10, posti A-B-C (tre posti)
    // PALCHI da 2 a 9, posti A-B-C-D (quattro posti)
    const palcoNum = parseInt(row);
    if (palcoNum === 1 || palcoNum === 10) {
      seats.push("A", "B", "C");
    } else if (palcoNum >= 2 && palcoNum <= 9) {
      seats.push("A", "B", "C", "D");
    }
  }

  // Ordina i posti: numeri prima (in ordine crescente), poi i "bis", poi le lettere
  return seats.sort((a, b) => {
    const aIsBis = a.includes("Bis");
    const bIsBis = b.includes("Bis");
    const aIsLetter = /^[A-Z]$/.test(a);
    const bIsLetter = /^[A-Z]$/.test(b);
    const aIsNumber = !isNaN(parseInt(a));
    const bIsNumber = !isNaN(parseInt(b));

    // Ordine: numeri -> bis -> lettere
    if (aIsNumber && !bIsNumber) return -1;
    if (!aIsNumber && bIsNumber) return 1;

    if (aIsBis && !bIsBis && !bIsNumber) return 1;
    if (!aIsBis && bIsBis && !aIsNumber) return -1;

    if (aIsLetter && !bIsLetter && !bIsBis && !bIsNumber) return 1;
    if (!aIsLetter && bIsLetter && !aIsBis && !aIsNumber) return -1;

    // Se entrambi sono numeri, ordina numericamente
    if (aIsNumber && bIsNumber) {
      return parseInt(a) - parseInt(b);
    }

    // Se entrambi sono lettere o bis, ordina alfabeticamente
    return a.localeCompare(b);
  });
}
