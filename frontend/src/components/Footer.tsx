export default function Footer() {
  return (
    <footer className="d-flex flex-wrap justify-content-between align-items-center py-1 border-top">
      <div className="col-md-4 d-flex align-items-center p-2">
        {/* <a
          href="/"
          className="mb-3 me-2 mb-md-0 text-body-secondary text-decoration-none lh-1"
        >
          <img
            src="/leetcode.svg"
            width="30"
            height="24"
            className="d-inline-block align-top"
            alt="React Bootstrap logo"
          />
        </a> */}
        <span className="mb-3 mb-md-0 text-body-secondary">
          Copyright &copy; 2024 LeetCode
        </span>
      </div>

      <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
        <li className="ms-3">
          <a
            className="text-body-secondary"
            href="https://www.facebook.com/profile.php?id=61557169305419"
            target="_blank" // Open in new tab
            rel="noopener noreferrer" // Open in new tab
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/b/b9/2023_Facebook_icon.svg"
              width="30"
              height="24"
              alt="React Bootstrap logo"
            />
          </a>
        </li>
        <li className="ms-3">
          <a
            className="text-body-secondary"
            href="https://youtu.be/4Ntc2lTu7LQ?si=cPA79t3sZV6rahV5"
            target="_blank" // Open in new tab
            rel="noopener noreferrer" // Open in new tab
          >
            <img
              src="/youtube.svg"
              width="30"
              height="24"
              // className="d-inline-block align-top"
              alt="React Bootstrap logo"
            />
          </a>
        </li>
        <li className="ms-3">
          <a
            className="text-body-secondary"
            href="https://github.com/VuongNhatHien/Vua-Leetcode"
            target="_blank" // Open in new tab
            rel="noopener noreferrer" // Open in new tab
          >
            <img
              src="/git.png"
              width="50"
              height="24"
              // className="d-inline-block align-top"
              alt="React Bootstrap logo"
            />
          </a>
        </li>
      </ul>
    </footer>
  );
}
