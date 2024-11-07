import React from 'react';
import { Link } from 'react-router-dom';
import './ShoppingBasket.css';

const Breadcrumb = ({ crumbs }) => {
    return (
        <nav className="breadcrumb">
            {crumbs.map((crumb, index) => (
                <span key={index}>
                    {index > 0 && " > "}
                    {index !== crumbs.length - 1 ? ( // التحقق إذا كان العنصر ليس الأخير (الرابط السابق)
                        <Link to={crumb.path}>{crumb.name}</Link>
                    ) : (
                        <span className="current">{crumb.name}</span> // العنصر الحالي
                    )}
                </span>
            ))}
        </nav>
    );
};

export default Breadcrumb;
