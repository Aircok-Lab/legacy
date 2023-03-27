import React, { Component } from 'react';
import { connect } from "react-redux";
import { getIrSettings } from "actions/System";
import { deviceIrDeleteRequest } from "actions/Product";
import { setViewMode } from "actions/Setting";

class List extends React.Component {
    state = {
      showModal: false,
      selectedNode: {},
      posts:[]
    };

    delete = () => {
      if (confirm("선택항목을 삭제하시겠습니까?")) {
        const selectedUsers = this.state.posts.filter(product => {
          return product.isChecked;
        });
        const ids = selectedUsers.map(({ serialNumber }) => serialNumber);
        this.props.deviceIrDeleteRequest({
          node: this.props.selectedNode,
          ids: ids.join()
        });
      }
    };

  componentDidMount() {
    this.props.getIrSettings();
    this.setState({ posts: this.props.posts });
  } 

  
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      JSON.stringify(prevProps.posts) !=
      JSON.stringify(this.props.posts)
    ) {
      this.setState({ posts: this.props.posts });
    }

    if (
      JSON.stringify(prevProps.selectedNode) !=
      JSON.stringify(this.props.selectedNode)
    ) {
      if (this.props.selectedNode.buildingID) {
        // 층
        this.props.productListByPositionIdRequest({
          positionID: "" + this.props.selectedNode.id
        });
      } else if (this.props.selectedNode.id) {
        // 건물
        this.props.productListByBuildingIdRequest({
          buildingID: "" + this.props.selectedNode.id
        });
      }
    }
  }

  render() {
    return (
      <React.Fragment> 
        {!this.props.hideButton && (
          <div className="row px-2">
          <div className="col-12">
            <div className="clearfix pb-1 pt-2">
              <div className="float-left" />
                <div className="float-right" style={{fontFamily:"Noto Sans KR"}}>
                  <button
                      className="btn btn-primary"
                      onClick={e => this.props.setViewMode("add")}
                      style={{ marginLeft: "2px" }}
                    >
                      등록
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={e => {
                        const selectedProducts = this.state.posts.filter(
                          product => product.isChecked
                        );
                        this.props.setViewMode("update", selectedProducts[0]);
                      }}
                      style={{ marginLeft: "2px" }}
                      disabled={
                        this.state.posts.filter(
                          product => product.isChecked
                        ).length != 1
                      }
                    >
                      수정
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={e => {
                        this.delete();
                      }}
                      style={{ marginLeft: "2px" }}
                      disabled={
                        this.state.posts.filter(
                          product => product.isChecked
                        ).length == 0
                      }
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            </div>
            )}
  
            <div className="px-2">
            <table className="table" style={{height:"100%" }}>
              <thead style={{color:"white",backgroundColor:"rgb(37, 36, 36)",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR",borderBottom:"0px solid white"}}>
                <tr>
                  <th style={{border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>
                    <input
                      type="checkbox"
                      onChange={event => {
                        let posts = [...this.state.posts];
                        posts.forEach(product => {
                          product.isChecked = event.target.checked;
                        });
                        this.setState({ posts: posts });
                      }}
                    />
                  </th>
                  <th style={{minWidth:"105px",color:"white" ,fontSize:"11px",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>번호</th>
                  <th style={{minWidth:"141px",color:"white" ,fontSize:"11px",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>시리얼번호</th>
                  <th style={{minWidth:"105px",color:"white" ,fontSize:"11px",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>PM10(강) 최소</th>
                  <th style={{minWidth:"105px",color:"white" ,fontSize:"11px",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>PM10(강) 최대</th>
                  <th style={{minWidth:"105px",color:"white" ,fontSize:"11px",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>PM10(중) 최소</th>
                  <th style={{minWidth:"105px",color:"white" ,fontSize:"11px",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>PM10(중) 최대</th>
                  <th style={{minWidth:"105px",color:"white" ,fontSize:"11px",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>PM10(약) 최소</th>
                  <th style={{minWidth:"105px",color:"white" ,fontSize:"11px",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>PM10(약) 최대</th>
                  <th style={{minWidth:"105px",color:"white" ,fontSize:"11px",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>PM2.5(강) 최소</th>
                  <th style={{minWidth:"105px",color:"white" ,fontSize:"11px",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>PM2.5(강) 최대</th>
                  <th style={{minWidth:"105px",color:"white" ,fontSize:"11px",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>PM2.5(중) 최소</th>
                  <th style={{minWidth:"105px",color:"white" ,fontSize:"11px",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>PM2.5(중) 최대</th>
                  <th style={{minWidth:"105px",color:"white" ,fontSize:"11px",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>PM2.5(약) 최소</th>
                  <th style={{minWidth:"105px",color:"white" ,fontSize:"11px",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>PM2.5(약) 최대</th>
                  <th style={{minWidth:"178px",color:"white" ,fontSize:"11px",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>에어컨 가동온도 설정 온도</th>
                  <th style={{minWidth:"101px",color:"white" ,fontSize:"11px",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>CO2 설정</th>
                </tr>
              </thead>
              <tbody style={{height:"100%" ,overflowY:"auto",width:"100%"}}>
              {this.state.posts &&
                this.state.posts.map((row,index) => (
                    <tr key={index}>
                      <td style={{ width: "60px" ,border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>
                       <input
                          type="checkbox"
                          checked={row.isChecked}
                          value={row.id}
                          onChange={event => {
                            let posts = [...this.state.posts];
                            posts.forEach(product => {
                              if (product.id === Number(event.target.value)) {
                                product.isChecked = event.target.checked;
                              }
                            });
                            this.setState({ posts: posts });
                          }}
                        />
                        </td>
                      <td style={{minWidth:"105px",color:"white",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>{index + 1}</td>
                      <td style={{minWidth:"141px",color:"white",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>{row.serialNumber}</td>
                      <td style={{minWidth:"105px",color:"white",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>{row.pm10_gang_start}</td>
                      <td style={{minWidth:"105px",color:"white",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>{row.pm10_gang_end}</td>
                      <td style={{minWidth:"105px",color:"white",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>{row.pm10_jung_start}</td>
                      <td style={{minWidth:"105px",color:"white",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>{row.pm10_jung_end}</td>
                      <td style={{minWidth:"105px",color:"white",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>{row.pm10_yag_start}</td>
                      <td style={{minWidth:"105px",color:"white",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>{row.pm10_yag_end}</td>
                      <td style={{minWidth:"105px",color:"white",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>{row.pm25_gang_start}</td>
                      <td style={{minWidth:"105px",color:"white",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>{row.pm25_gang_end}</td>
                      <td style={{minWidth:"105px",color:"white",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>{row.pm25_jung_start}</td>
                      <td style={{minWidth:"105px",color:"white",border:"1px solid rgb(72, 68, 68)",fontFamily:"  Noto Sans KR"}}>{row.pm25_jung_end}</td>
                      <td style={{minWidth:"105px",color:"white",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>{row.pm25_yag_start}</td>
                      <td style={{minWidth:"105px",color:"white",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>{row.pm25_yag_end}</td>
                      <td style={{minWidth:"178px",color:"white",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>{row.temperature}</td>
                      <td style={{minWidth:"101px",color:"white",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>{row.co2}</td>
                    </tr>
                  ))}
              </tbody>
            </table>{" "}
           </div>
      </React.Fragment>
    );
  }
}
const mapStateToProps = state => ({
  authUser: state.auth.authUser,
  posts: state.product.list,
  selectedNode: state.tree.selectedNode,
  viewMode: state.settings.viewMode
});

const mapDispatchToProps = {
  getIrSettings,
  deviceIrDeleteRequest,
  setViewMode,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(List);