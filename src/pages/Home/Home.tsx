import { useContext } from "react";
import { useNavigate } from "react-router";
import { UserContext } from "../../contexts/UserContext";
import UsainBoltImage from "../../assets/Usain_Bolt.jpg";
import FlorenceGriffithImage from "../../assets/Florence_Griffith.jpg";
import CarlLewisImage from "../../assets/Carl_Lewis.jpg";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  if (user === undefined) {
    navigate("/signin");
  }

  return (
    <div className="home-page-stuff">
      <section className="banner">
        <div className="banner-text">
          <h2>The Fastest Sprinters in the World</h2>
          <p>Get ready for the thrilling 100m Olympic race.</p>
          <button onClick={() => navigate("/races")}>Watch Now</button>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="introduction">
        <h2>What is the 100m Race?</h2>
        <p>
          The 100-meter race is one of the most iconic events in the Summer
          Olympics. It is known for determining the fastest sprinter in the
          world. Athletes run a full 100 meters on a straight track, competing
          for the gold medal. Every year, the world holds its breath as the
          sprinters take their marks!
        </p>
      </section>

      {/* Featured Athletes */}
      <section className="athletes">
        <h2>Featured Athletes</h2>
        <div className="athlete-card">
          <img
            src={UsainBoltImage}
            alt="Usain Bolt"
            style={{ width: "200px", height: "200px" }}
          />
          <h3>Usain Bolt</h3>
          <p>World Record Holder - 9.58s</p>
        </div>
        <div className="athlete-card">
          <img
            src={FlorenceGriffithImage}
            alt="Florence Griffith-Joyner"
            style={{ width: "200px", height: "200px" }}
          />
          <h3>Florence Griffith-Joyner</h3>
          <p>World Record Holder - 10.49s</p>
        </div>
        <div className="athlete-card">
          <img
            src={CarlLewisImage}
            alt="Carl Lewis"
            style={{ width: "200px", height: "200px" }}
          />
          <h3>Carl Lewis</h3>
          <p>9 Olympic Golds in Sprinting</p>
        </div>
      </section>

      {/* Race Stats Section */}
      <section className="race-stats">
        <h2>Race Records & Stats</h2>
        <div className="stats-card">
          <h3>Men's 100m Record</h3>
          <p>9.58s by Usain Bolt</p>
        </div>
        <div className="stats-card">
          <h3>Women's 100m Record</h3>
          <p>10.49s by Florence Griffith-Joyner</p>
        </div>
      </section>
    </div>
  );
}
