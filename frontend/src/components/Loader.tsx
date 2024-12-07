import { PuffLoader } from "react-spinners";

export default function Loader() {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{
        height: "100vh",
      }}
    >
      <PuffLoader
        // loading={loading}
        // cssOverride={override}
        size={100}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      <div
        className="mt-3"
        style={{
          fontSize: "1.5rem",
        }}
      >
        Fetching data
      </div>
    </div>
  );
}
