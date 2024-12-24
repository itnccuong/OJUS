import { Form } from "react-bootstrap";

export default function ForgotPasswordDone() {
  return (
    <>
      <div className="d-flex flex-grow-1 bg-body-tertiary">
        <div className="container-xxl d-flex justify-content-center align-items-center">
          <Form className="p-4 border border-dark-subtle rounded-4 w-25 bg-white shadow m-5">
            {/* <h3 className="text-center mb-3">Sign In</h3>
             */}
            <div className="d-flex justify-content-center align-items-center mb-4 border-bottom">
              <h3 className="mb-3">Password Reset</h3>
            </div>
            <p>
              We have sent you an e-mail. Please contact us if you do not
              receive it within a few minutes.
            </p>
          </Form>
        </div>
      </div>
    </>
  );
}
