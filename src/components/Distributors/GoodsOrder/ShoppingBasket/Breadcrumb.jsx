import React from "react";
import { Link } from "react-router-dom";

const Breadcrumb = ({ crumbs }) => {
  return (
    <nav className="breadcrumb">
      {crumbs.map((crumb, index) => (
        <span key={index}>
          {index > 0 && " > "}
          {index !== crumbs.length - 1 ? (
            <Link to={crumb.path}>{crumb.name}</Link>
          ) : (
            <span className="current">{crumb.name}</span>
          )}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumb;
