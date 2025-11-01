import { Select, SelectItem } from "@heroui/react";
import { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

function App() {
  const [selected, setSelected] = useState<string>("Platea");

  console.log(selected);
  return (
    <div>
      <Select
        selectedKeys={[selected]}
        onSelectionChange={(keys) => setSelected(keys.currentKey as string)}
      >
        <SelectItem key="Platea">Platea</SelectItem>
        <SelectItem key="Galleria">Galleria</SelectItem>
        <SelectItem key="Palco">Palco</SelectItem>
      </Select>
    </div>
  );
}

export default App;
