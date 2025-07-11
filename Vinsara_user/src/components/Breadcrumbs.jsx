import React from "react";
import {  useNavigate } from "react-router-dom";

export const Breadcrumbs = ({ breadcrumbItems, BreadcrumbLinks }) => {
  const navigate = useNavigate();
  return (
    <div className="breadcrumb-component">
      {breadcrumbItems.map((item, index) => (
        <span
          style={{
            // color: index === breadcrumbItems.length - 1 ? "gray" : "black",
            cursor: "pointer",
          }}
          onClick={() => navigate(BreadcrumbLinks[index])}
          key={index}
        >
          {item}
          {index !== breadcrumbItems.length - 1 && <span style={{color:"gray"}}>/</span>}
        </span>
      ))}
    </div>
  );
};
