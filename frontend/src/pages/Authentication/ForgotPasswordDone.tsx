import { Container, Form } from "react-bootstrap";

export default function ForgotPasswordDone() {
  return (
    <>
      <div
        className="d-flex flex-grow-1 justify-content-center align-items-center"
        style={{
          backgroundColor: "#eceff1",
        }}
      >
        <Form className="p-4 border border-dark-subtle rounded-4 w-25 bg-white shadow m-5">
          {/* <h3 className="text-center mb-3">Sign In</h3>
           */}
          <Container className="d-flex justify-content-center align-items-center mb-4 border-bottom">
            <h3 className="mb-3">Password Reset</h3>
          </Container>
          <p>
            We have sent you an e-mail. Please contact us if you do not receive
            it within a few minutes.
          </p>
        </Form>
      </div>
    </>
  );
}
