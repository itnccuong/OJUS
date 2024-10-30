import { useParams } from "react-router-dom";

import NavBar from "../components/NavBar";

export default function Contribution() {
  const { id } = useParams();

  return (
    <div>
      <NavBar />
      <h3>Contribution id: {id}</h3>
    </div>
  );
}
