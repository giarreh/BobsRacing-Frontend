import { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";

export default function Header() {
  const { user, setUser, clearAuthToken } = useContext(UserContext);
  const navigate = useNavigate();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const handleLogout = () => {
    clearAuthToken();
    setUser(null); // or provide a default JwtPayload object
    setDropdownVisible(false); // Close the dropdown on logout
  };

  // Modal for add credits
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <header className="header">
      {user ? (
        <>
          {/* Left side: Home, Profile, Race, Betting, Athletes (if admin) */}
          <div className="header-left">
            <div onClick={() => navigate("/")}>Home</div>
            <div onClick={() => navigate("/profile")}>Profile</div>
            <div onClick={() => navigate("/races")}>Races</div>
            <div /*onClick={() => navigate("/")} */>Betting</div>
            <div onClick={() => navigate("/athletes")}>Athletes</div>
          </div>
          {/* Right side: Logout */}
          <div className="profile-container">
            <div onClick={toggleDropdown}>
              <p>🐟</p>
            </div>

            {/* Dropdown Menu to icon */}
            {dropdownVisible && (
              <div className="dropdown-menu">
                <div
                  onClick={() => {
                    navigate("/profile");
                    setDropdownVisible(false);
                  }}
                >
                  <p>Profile</p>
                </div>
                <div>
                  <div
                    onClick={() => {
                      openModal();
                      // setDropdownVisible(false);
                    }}
                  >
                    <p>Add credits</p>
                  </div>

                  <Modal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    contentLabel="Add Credits Modal"
                  >
                    <h2>Add Credits</h2>
                    <form>
                      <label>
                        Amount:
                        <input type="number" placeholder="Enter amount" />
                      </label>
                      <button type="submit">Add Credits</button>
                    </form>
                    <button onClick={closeModal}>Close</button>
                  </Modal>
                </div>
                <div>
                  <p>Credits: {user?.credits} </p>
                </div>
                <div style={{ cursor: "pointer" }} onClick={handleLogout}>
                  <p>Logout</p>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Left side: Empty */}
          <div className="header-left"></div>
          {/* Right side: Login/Register */}
          <div className="header-right header-login-div">
            <p onClick={() => navigate("/signin")}>LOGIN</p>
            <p onClick={() => navigate("/signup")}>REGISTER</p>
          </div>
        </>
      )}
    </header>
  );
}
