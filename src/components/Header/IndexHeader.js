import React from "react";

const IndexHeader = props => {
  return (
    <div className="ml-auto">
      <div className="float-right">
        <div
          className="col d-flex justify-content-end align-items-center font-weight-bold"
          style={{ fontSize: "0.8em" }}
        >
          <div
            className="m-1 bg-dark text-light rounded-circle d-flex justify-content-center align-items-center"
            style={{ width: "64px", height: "64px", lineHeight: "14px" }}
          >
            지수
            <br />
            등급
          </div>
          <i className="zmdi zmdi-chevron-right zmdi-hc-lg" />
          <div
            className="m-1 bg-good text-light rounded-circle d-flex justify-content-center align-items-center"
            style={{ width: "64px", height: "64px", lineHeight: "14px" }}
          >
            <div className="text-center">
              <div>좋음</div>
              <div>0~20</div>
            </div>
          </div>
          <div
            className="m-1 bg-normal text-light rounded-circle d-flex justify-content-center align-items-center"
            style={{ width: "64px", height: "64px", lineHeight: "14px" }}
          >
            <div className="text-center">
              <div>보통</div>
              <div>21~40</div>
            </div>
          </div>
          <div
            className="m-1 bg-sensitive1 text-light rounded-circle d-flex justify-content-center align-items-center"
            style={{ width: "64px", height: "64px", lineHeight: "14px" }}
          >
            <div className="text-center">
              <div>약간나쁨</div>
              <div>41~55</div>
            </div>
          </div>
          <div
            className="m-1 bg-sensitive2 text-light rounded-circle d-flex justify-content-center align-items-center"
            style={{ width: "64px", height: "64px", lineHeight: "14px" }}
          >
            <div className="text-center">
              <div>나쁨</div>
              <div>56~65</div>
            </div>
          </div>
          <div
            className="m-1 bg-bad text-light rounded-circle d-flex justify-content-center align-items-center"
            style={{ width: "64px", height: "64px", lineHeight: "14px" }}
          >
            <div className="text-center">
              <div>매우나쁨</div>
              <div>66~85</div>
            </div>
          </div>
          <div
            className="m-1 bg-very-bad text-light rounded-circle d-flex justify-content-center align-items-center"
            style={{ width: "64px", height: "64px", lineHeight: "14px" }}
          >
            <div className="text-center">
              <div>최악</div>
              <div>86~100</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default IndexHeader;
