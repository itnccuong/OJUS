import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="homepage">
          {/* Header Section */}
          <header
            className="header"
            style={{
              backgroundImage: 'url(https://i.imgur.com/DUVi9s5.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
              color: 'white',
            }}
          >
            <div className="overlay" style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              zIndex: 1,
            }}></div>
            <div className="header-content" style={{
              position: 'relative',
              zIndex: 2,
              textAlign: 'center',
              padding: '150px 20px',
            }}>
              <h1 className="header-title" style={{
                fontSize: '48px', 
                fontWeight: 'bold', 
                backgroundImage: 'url(https://i.imgur.com/5TpeSfN.jpeg)',
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                color: 'transparent',
                WebkitBackgroundClip: 'text', 
                backgroundClip: 'text', 
                display: 'block', 
                marginBottom: '10px' 
              }}>
                OJUS
              </h1>
              <p className="header-subtitle" style={{
                fontSize: '20px', 
                margin: '0',
                backgroundImage: 'url(https://i.imgur.com/5TpeSfN.jpeg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: 'transparent',
                WebkitBackgroundClip: 'text', 
                backgroundClip: 'text',
                display: 'block', 
              }}>
                Online Programming Learning Platform
              </p>
              <div className="auth-buttons" style={{ marginTop: '20px' }}>
                <Link to="/accounts/login">
                  <button className="btn sign-in" style={{
                    backgroundColor: 'white',
                    color: 'black',
                    padding: '10px 20px',
                    margin: '5px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}>
                    Sign In
                  </button>
                </Link>
                <Link to="/accounts/register">
                  <button className="btn register" style={{
                    backgroundColor: '#4E4A57',
                    color: 'white',
                    padding: '10px 20px',
                    margin: '5px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}>
                    Register
                  </button>
                </Link>
              </div>
            </div>
          </header>
    
          {/* About Us Section */}
          <section className="about-us" style={{ padding: '50px 20px', textAlign: 'center', backgroundColor: '#f1f1f1' }}>
            <h2 style={{ fontSize: '32px', margin: '0 0 20px' }}>About Us</h2>
            <p className="creator-label" style={{ fontSize: '18px', color: '#555', margin: '10px 0' }}>THE CREATORS:</p>
            <div className="creator-cards" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '20px' }}>
              {[ 
                { name: "Cuong", role: "Backend", avatar: "https://scontent.fsgn5-5.fna.fbcdn.net/v/t39.30808-6/447826463_1148733653122773_3356096188989855996_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=108&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=lxGiG40_6RsQ7kNvgGW0skS&_nc_zt=23&_nc_ht=scontent.fsgn5-5.fna&_nc_gid=AsZ53uLN4vyRgHSW0RWHAvd&oh=00_AYCBG1fsYX_WPSxn64sjM5REqfVTho1X0CFYnrEd6t-hBw&oe=67759209" },
                { name: "Duy", role: "Frontend", avatar: "https://scontent.fsgn5-9.fna.fbcdn.net/v/t39.30808-6/469784576_2384841861870567_1049749914050783153_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=PXiIbd0tuKQQ7kNvgGtrafl&_nc_zt=23&_nc_ht=scontent.fsgn5-9.fna&_nc_gid=AEYft1_18X9YJ19JAa2KhUQ&oh=00_AYAT_YOE0GjfHrZ-ob33g_PIbZxiLYJBxRcr6npmvTR3Og&oe=67759C4A" },
                { name: "Hien", role: "Backend", avatar: "https://scontent.fsgn5-15.fna.fbcdn.net/v/t39.30808-6/466420221_1234042217704872_5671806366656552737_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=6JGV2bNbIVcQ7kNvgG_bvb4&_nc_zt=23&_nc_ht=scontent.fsgn5-15.fna&_nc_gid=AV_DqlpR0a3E1q5YpGHlUpB&oh=00_AYAZ1EBSAxsOx_2hWjLwpZm6Wiz_5JxoxHmrCF5iEsODtA&oe=6775B636" },
                { name: "Hoang", role: "Frontend", avatar: "https://scontent.fsgn5-10.fna.fbcdn.net/v/t39.30808-6/324188808_1835261596837455_2717740617376856681_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=lcLsQhGE824Q7kNvgERtn0K&_nc_zt=23&_nc_ht=scontent.fsgn5-10.fna&_nc_gid=AozPDUZmJgOZB7C4Ajm9Fym&oh=00_AYAnC6fXWF_TPLCA1Oq3yJpUG7C2RxZ-TWAl0Sk8EuEmTg&oe=67759A8D" },
              ].map((creator, index) => (
                <div key={index} className="creator-card" style={{
                  backgroundColor: '#f9f9f9',
                  padding: '20px',
                  borderRadius: '10px',
                  textAlign: 'center',
                  width: '200px',
                }}>
                  <div className="creator-avatar" style={{ marginBottom: '15px' }}>
                    <img
                      src={creator.avatar}
                      alt="Avatar"
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                  <h3 className="creator-name" style={{ fontSize: '20px', margin: '0 0 5px' }}>{creator.name}</h3>
                  <p className="creator-role" style={{ fontSize: '14px', color: '#555' }}>
                    Creator<br />
                    {creator.role}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
    );
}
