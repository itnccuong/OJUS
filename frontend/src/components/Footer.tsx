export default function Footer() {
  return (
    <div className="bg-body-tertiary border-bottom px-5 py-2">
      <div className="container d-flex justify-content-start">
        <span className="text-body-secondary">Copyright &copy; 2024 OJUS</span>
      </div>

      <div className="container d-flex gap-3 justify-content-end">
        <a
          href="https://www.facebook.com/profile.php?id=61557169305419"
          target="_blank" // Open in new tab
          rel="noopener noreferrer" // Open in new tab
        >
          <img src="/facebook.svg" width="30" height="24" />
        </a>
        <a
          href="https://youtu.be/4Ntc2lTu7LQ?si=cPA79t3sZV6rahV5"
          target="_blank" // Open in new tab
          rel="noopener noreferrer" // Open in new tab
        >
          <img
            src="/youtube.svg"
            width="30"
            height="24"
            // className="d-inline-block align-top"
          />
        </a>
        <a
          href="https://github.com/VuongNhatHien/Vua-Leetcode"
          target="_blank" // Open in new tab
          rel="noopener noreferrer" // Open in new tab
        >
          <img src="/git.png" width="50" height="24" />
        </a>
      </div>
    </div>
  );
}
