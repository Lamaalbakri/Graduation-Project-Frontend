import p1 from "../images/P1.jpg";

const WelcomeCard = ({ welcomeText }) => {
  return (
    <header>
      <div className="welcome-card">
        <h1 className="welcome-title">Welcome ..</h1>
        <p className="welcome-text">{welcomeText}</p>
      </div>
      <div className="P1">
        <img src={p1} alt="P1 Image" />
      </div>
    </header>
  );
};

export default WelcomeCard;
