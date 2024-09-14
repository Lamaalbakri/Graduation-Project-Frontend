import React from 'react'
import logo from './images/SCMS.png';

const Logo = () => {
    return (
        <div className="logo">
            <div className="logo-icon">
                <img src={logo} alt="Logo" />
            </div>
        </div>
    );
};

export default Logo;