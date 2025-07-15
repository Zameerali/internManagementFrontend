import { useEffect, useState } from "react";
import { getAllInterns } from "../services/internService";
import type { Intern } from "../types/intern";
import InternCard from "../components/InternCard.tsx";
import { Container } from "@mui/material";

export default function InternListPage() {
  const [interns, setInterns] = useState<Intern[]>([]);

  useEffect(() => {
    (async () => {
      const data = await getAllInterns();
      setInterns(data);
    })();
  }, []);

  return (
    <Container
      sx={{
        alignItems: "center",
        padding: "2rem",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <h1 className="text-2xl font-bold mb-4">Interns</h1>
      {interns.map((intern) => (
        <InternCard key={intern.id} intern={intern} />
      ))}
    </Container>
  );
}
