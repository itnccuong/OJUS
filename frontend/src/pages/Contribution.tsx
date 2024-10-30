import { NavLink, useNavigate, useParams } from "react-router-dom";

import NavBar from "../components/NavBar";
import { Container, Nav, Navbar } from "react-bootstrap";
import { StorageConfig } from "../../interfaces/interface";
import getStorage from "../../utils/getStorage";

export default function Contribution() {
  const { id } = useParams();

  return (
    <div className="d-flex-flex-column">
      <NavBar />
      <Container
        className="d-flex flex-column"
        style={{
          height: "100vh",
        }}
      >
        <h3>Contribution id: {id}</h3>
      </Container>
    </div>
  );
}
