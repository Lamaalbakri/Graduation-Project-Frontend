import logo from './images/User.png';

const UserLogo = () => {
    return (
        <div className="UserLogo">
            <div className="UserLogo-icon">
                <img src={logo} alt="User Logo" />
            </div>
        </div>
    );
};

export default UserLogo;