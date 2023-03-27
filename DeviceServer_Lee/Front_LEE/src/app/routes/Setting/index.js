import React from "react";
import Posts from "components/Setting/Container";

const SystemPage = () => {
  return (
    <div className="app-wrapper">
      <div className="">
        <h2 className="mb-0" style={{color:"white",fontFamily:"Noto Sans KR"}}>기기 설정</h2>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="animated slideInUpTiny animation-duration-3">
            <Posts />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemPage;
