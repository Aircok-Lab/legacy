import React from "react";
import BuildingPositionTree from "components/Tree/BuildingPositionTree";
import Container from "components/Product/Container";

const UserPage = () => {
  return (
    <div className="container-fluid h-100 flex-fill d-flex flex-column" >
      <div className="row flex-shrink-0 w3-white shadow-sm" style={{backgroundColor:"#282834" ,color:"white"}}>
        {/* <h2 className="pt-2 pl-2">제품군 관리</h2> */}
      </div>
      <div className="row flex-fill d-flex flex-column" style={{backgroundColor:"rgb(23, 24, 29)"}}>
        <Container />
      </div>
    </div>
  );
};

export default UserPage;
