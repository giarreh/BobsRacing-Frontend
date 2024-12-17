import { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";

export default function Header() {
  const { user, setUser, clearAuthToken, getAuthToken } =
    useContext(UserContext);
  const navigate = useNavigate();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creditAmount, setCreditAmount] = useState<number | string>("");

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
  const closeModal = () => {
    setCreditAmount("");
    setIsModalOpen(false);
  };

  const handleAddCredits = (e: React.FormEvent) => {
    e.preventDefault();

    if (!creditAmount || Number(creditAmount) <= 0) {
      alert("Please enter a valid credit amount.");
      return;
    }

    const updatedCredits = Number(user?.credits) + Number(creditAmount);

    // payload for credits
    const payload = {
      profilename: user?.profilename,
      username: user?.username,
      password: "string",
      credits: updatedCredits,
      role: user?.role,
    };

    // update user credits
    fetch(`https://localhost:7181/api/User/${user?.id}/credits`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        //return response.json();
      })
      .then((data) => {
        setUser({ ...user, credits: updatedCredits }); // Update the user context
        alert("Credits added successfully.");
        closeModal();
      })
      .catch((error) => {
        console.error("Error adding credits:", error);
        alert("Error adding credits.");
      });
  };

  return (
    <header className="header">
      {user ? (
        <>
          {/* Left side: Home, Profile, Race, Betting, Athletes (if admin) */}
          <div className="header-left">
            <div onClick={() => navigate("/")}>Home</div>
            <div onClick={() => navigate("/races")}>Races</div>
            <div onClick={() => navigate("/results")}>Results</div>
            <div onClick={() => navigate("/betting")}>Betting</div>
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
                    }}
                  >
                    <p>Add credits</p>
                  </div>

                  <Modal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    contentLabel="Add Credits Modal"
                    className="ReactModal__Content" // Apply custom content class
                    overlayClassName="ReactModal__Overlay" // Apply custom overlay class
                  >
                    <h2>Add Credits</h2>
                    <form onSubmit={handleAddCredits}>
                      <label>
                        Amount:
                        <input
                          type="number"
                          placeholder="Enter amount"
                          value={creditAmount}
                          onChange={(e) => setCreditAmount(e.target.value)}
                        />
                      </label>
                      <button type="submit">Add Credits</button>
                    </form>
                    <button className="close-btn" onClick={closeModal}>
                      Close
                    </button>
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
