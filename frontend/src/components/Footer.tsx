export default function Footer() {
  return (
    <footer className="d-flex flex-wrap justify-content-between align-items-center py-1 my-2">
      <div className="col-md-4 d-flex align-items-center">
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
            href="https://www.youtube.com/watch?v=4Ntc2lTu7LQ&t=1212s"
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
          >
            <img
              src="https://vincent-yao27.github.io/ph-icon-gen/git.png"
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
