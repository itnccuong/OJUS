import { Container, Form } from "react-bootstrap";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export default function ForgotPasswordDone() {
  return (
    <>
      <NavBar />
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          backgroundColor: "#eceff1",
          height: "86vh",
        }}
      >
        <Form
          className="p-4 rounded w-25 bg-white shadow"
        >
          {/* <h3 className="text-center mb-3">Sign In</h3>
           */}
          <Container className="d-flex justify-content-center align-items-center mb-4 border-bottom">
            <h3 className="mb-3">Password Reset</h3>
          </Container>
          <p>We have sent you an e-mail. Please contact us if you do not receive it within a few minutes.</p>
        </Form>
      </div>
      <Container>
        <Footer />
      </Container>
    </>
  );
}
