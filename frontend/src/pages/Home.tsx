import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="homepage flex-grow-1 d-flex flex-column">
      {/* Header Section */}
      <header
        className="header"
        style={{
          backgroundImage: "url(home_background.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        <div
          className="overlay"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            zIndex: 1,
          }}
        ></div>
        <div
          className="header-content"
          style={{
            position: "relative",
            zIndex: 2,
            textAlign: "center",
            padding: "125px 20px",
          }}
        >
          <h1
            className="header-title"
            style={{
              fontSize: "48px",
              fontWeight: "bold",
              backgroundImage: "url(header_background.jpeg)",
              backgroundSize: "contain",
              backgroundPosition: "center",
              color: "transparent",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              display: "block",
              marginBottom: "10px",
            }}
          >
            OJUS
          </h1>
          <p
            className="header-subtitle"
            style={{
              fontSize: "20px",
              margin: "0",
              backgroundImage: "url(header_background.jpeg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              color: "transparent",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              display: "block",
            }}
          >
            Online Programming Learning Platform
          </p>
          <div className="auth-buttons" style={{ marginTop: "20px" }}>
            {/*<Link to="/accounts/login">*/}
            {/*  <button*/}
            {/*    className="btn sign-in"*/}
            {/*    style={{*/}
            {/*      backgroundColor: "white",*/}
            {/*      color: "black",*/}
            {/*      padding: "10px 20px",*/}
            {/*      margin: "5px",*/}
            {/*      borderRadius: "5px",*/}
            {/*      cursor: "pointer",*/}
            {/*    }}*/}
            {/*  >*/}
            {/*    Sign In*/}
            {/*  </button>*/}
            {/*</Link>*/}
            {/*<Link to="/accounts/register">*/}
            {/*  <button*/}
            {/*    className="btn register"*/}
            {/*    style={{*/}
            {/*      backgroundColor: "#4E4A57",*/}
            {/*      color: "white",*/}
            {/*      padding: "10px 20px",*/}
            {/*      margin: "5px",*/}
            {/*      borderRadius: "5px",*/}
            {/*      cursor: "pointer",*/}
            {/*    }}*/}
            {/*  >*/}
            {/*    Register*/}
            {/*  </button>*/}
            {/*</Link>*/}
          </div>
        </div>
      </header>

      {/* About Us Section */}
      <section
        className="about-us flex-grow-1 p-4"
        style={{
          // padding: "50px 20px",
          textAlign: "center",
          backgroundColor: "#f1f1f1",
        }}
      >
        <h2>About Us</h2>
        <p
          className="creator-label"
          style={{ fontSize: "18px", color: "#555" }}
        >
          THE CREATORS:
        </p>
        <div className="creator-cards d-flex justify-content-center gap-4">
          {[
            {
              name: "Cuong",
              role: "Backend",
              avatar: "Cuong.jpg",
              link: "https://github.com/itnccuong",
            },
            {
              name: "Duy",
              role: "Frontend",
              avatar: "Duy.jpg",
              link: "https://github.com/QDuy0082",
            },
            {
              name: "Hien",
              role: "Backend",
              avatar: "Hien.jpg",
              link: "https://github.com/VuongNhatHien",
            },
            {
              name: "Hoang",
              role: "Frontend",
              avatar: "Hoang.jpg",
              link: "https://github.com/hodinhhoang312",
            },
          ].map((creator, index) => (
            <div
              key={index}
              className="creator-card shadow-sm rounded-4 border py-3"
              style={{
                backgroundColor: "#f9f9f9",
                width: "200px",
              }}
            >
              <Link
                to={creator.link}
                target="_blank" // Open in new tab
                rel="noopener noreferrer" // Open in new tab
              >
                <img
                  src={creator.avatar}
                  alt="Avatar"
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              </Link>
              <h3
                className="creator-name mt-2 mb-0"
                style={{
                  fontSize: "20px",
                }}
              >
                {creator.name}
              </h3>
              <div
                className="creator-role text-secondary"
                style={{ fontSize: "14px", color: "#555" }}
              >
                {creator.role}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
