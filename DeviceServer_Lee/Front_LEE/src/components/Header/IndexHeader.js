import React from "react";

const IndexHeader = props => {
  return (
    <div className="ml-auto">
      <div style={{textAlign:"left",fontSize:"14px",borderRadius:"7px",padding:"6px",height:"36px",width:"479px",marginTop:"-17px",left:"57px",top:"-80px",marginRight:"1284px"}}>
        <div style={{borderTop:"2px solid #2DA1DA",fontFamily:"Noto Sans KR",color:"white",fontSize:"10px",top:"32px",left:"-16px",width:"250px",marginTop:"20px"}}><p style={{fontSize:"14px",textAlign:"right",fontWeight:"200",fontFamily:"Noto Sans KR"}}>좋음</p></div>
        <div style={{borderTop:"2px solid #2FB983",fontFamily:"Noto Sans KR",color:"white",fontSize:"10px",top:"9px",left:"286px",width:"250px",marginLeft:"256px",marginTop:"-37px"}}><p style={{fontSize:"14px",textAlign:"right",fontWeight:"200",fontFamily:"Noto Sans KR"}}>보통</p></div>
        <div style={{borderTop:"2px solid #E7A527",fontFamily:"Noto Sans KR",color:"white",fontSize:"10px",top:"-14px",left:"590x",width:"250px",marginLeft:"513px",marginTop:"-37px"}}><p style={{fontSize:"14px",textAlign:"right",fontWeight:"200",fontFamily:"Noto Sans KR"}}>약간나쁨</p></div>
        <div style={{borderTop:"2px solid #E34F20",fontFamily:"Noto Sans KR",color:"white",fontSize:"10px",top:"-37px",left:"893px",width:"250px",marginLeft:"770px",marginTop:"-37px"}}><p style={{fontSize:"14px",textAlign:"right",fontWeight:"200",fontFamily:"Noto Sans KR"}}>나쁨</p></div>
        <div style={{borderTop:"2px solid #D8071F",fontFamily:"Noto Sans KR",color:"white",fontSize:"10px",top:"-60px",left:"1195px",width:"250px",marginLeft:"1027px",marginTop:"-37px"}}><p style={{fontSize:"14px",textAlign:"right",fontWeight:"200",fontFamily:"Noto Sans KR"}}>매우나쁨</p></div>
        <div style={{borderTop:"2px solid #6D30A9",fontFamily:"Noto Sans KR",color:"white",fontSize:"10px",top:"-83px",left:"1498px",width:"250px",marginLeft:"1283px",marginTop:"-37px"}}><p style={{fontSize:"14px",textAlign:"right",fontWeight:"200",fontFamily:"Noto Sans KR"}}>최악</p></div>

        </div>
        {/* <div
          className="col d-flex justify-content-end align-items-center font-weight-bold"
          style={{ fontSize: "1.0em" ,right: "352px",backgroundColor:"#373743",fontWeight:"bold"}}
        >
          <div
            className="m-1 bg-dark text-light rounded-circle d-flex justify-content-center align-items-center"
            style={{ width: "64px", height: "64px", lineHeight: "14px" }}
          >
            지수
            <br />
            등급
          </div>
          <div
            className="m-1 bg-good text-light d-flex justify-content-center align-items-center"
            style={{ width: "178px", height: "27px", lineHeight: "14px" ,fontWeight:"300"}}
          >
            <div className="text-center">
              <div>좋음</div>
            </div>
          </div>
          <div
            className="m-1 bg-normal text-light d-flex justify-content-center align-items-center"
            style={{ width: "178px", height: "27px", lineHeight: "14px",fontWeight:"bold" }}
          >
            <div className="text-center">
              <div>보통</div>
            </div>
          </div>
          <div
            className="m-1 bg-sensitive1 text-light d-flex justify-content-center align-items-center"
            style={{ width: "178px", height: "27px", lineHeight: "14px",fontWeight:"bold" }}
          >
            <div className="text-center">
              <div>약간나쁨</div>
            </div>
          </div>
          <div
            className="m-1 bg-sensitive2 text-light d-flex justify-content-center align-items-center"
            style={{ width: "178px", height: "27px", lineHeight: "14px" }}
          >
            <div className="text-center">
              <div>나쁨</div>
            </div>
          </div>
          <div
            className="m-1 bg-bad text-light d-flex justify-content-center align-items-center"
            style={{ width: "178px", height: "27px", lineHeight: "14px" }}
          >
            <div className="text-center">
              <div>매우나쁨</div>
            </div>
          </div>
          <div
            className="m-1 bg-very-bad text-light d-flex justify-content-center align-items-center"
            style={{ width: "178px", height: "27px", lineHeight: "14px" }}
          >
            <div className="text-center">
            d  <div>최악</div>
            </div>
          </div>
        </div> */}
    </div>
  );
};
export default IndexHeader;
