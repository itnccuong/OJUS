export default function Footer() {
  return (
    <div className="d-flex align-items-center border-top pt-2 pb-2">
      <div className="d-flex container">
        <div className="container d-flex justify-content-start">
          <span className="text-body-secondary">
            Copyright &copy; 2024 VuaLeetCode
          </span>
        </div>

        <div className="container d-flex gap-3 justify-content-end">
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
        </div>
      </div>
    </div>
  );
}
