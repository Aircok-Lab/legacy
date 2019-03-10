import React from "react";
import BuildingPositionTree from "app/appcomponents/BuildingPositionTree";
import ProductTable from "app/appcomponents/ProductTable";

const ProductPage = () => {
  return (
    <div className="app-wrapper">
      <div className="w3-panel w3-white w3-card w3-padding">
        <h2>제품군 관리</h2>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="animated slideInUpTiny animation-duration-3">
            <ProductTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
