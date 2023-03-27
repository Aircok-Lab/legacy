import React, { Component } from 'react';
import { connect } from "react-redux";
import {deviceYulListRequest,deviceYulDeleteRequest,} from "actions/Product";
import { setViewMode } from "actions/Setting";

class List extends React.Component {
  state = {
    showModal: false,
    selectedNode: {},
    posts:[],
  };

delete = () => {
  if (confirm("선택항목을 삭제하시겠습니까?")) {
    const selectedUsers = this.state.posts.filter(product => {
      return product.isChecked;
    });
    const ids = selectedUsers.map(({ id }) => id);
    this.props.deviceYulDeleteRequest({
      node: this.props.selectedNode,
      ids: ids.join()
    });
  }
};
componentDidMount() {
  this.props.deviceYulListRequest();
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
       <div style={{
          fontSize: '14px',
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "26px",
        }}>
          <ul >
          {!this.props.hideButton && (
            <div className="col-12" style={{overflowY:"auto" ,fontFamily:"Noto Sans KR"}}>
              <div className="clearfix pb-1 pt-2" style={{fontFamily:"Noto Sans KR"}}>
                <div className="float-left" />
                <div className="float-right" style={{fontFamily:"Noto Sans KR"}} >
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
          )}

          <div className="px-2">
          <table className="table" style={{height:"100%" ,overflowY:"auto"}}>
            <thead style={{backgroundColor:"#282834"}}>
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
                <th style={{minWidth:"200px",color:"white",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>번호</th>
                <th style={{minWidth:"300px",color:"white",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>센서타입</th>
                <th style={{minWidth:"335px",color:"white",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>시리얼번호</th>
                <th style={{minWidth:"300px",color:"white",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>MIN</th>
                <th style={{minWidth:"300px",color:"white",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>MAX</th>
                <th style={{minWidth:"300px",color:"white",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>CALC</th>
              </tr>
            </thead>
            <tbody style={{height:"100%" ,overflowY:"auto",width:"100%"}}>
              {this.state.posts &&
              this.state.posts.map((row,index)  => (
                  <tr key={row.id}>
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
                    <td style={{minWidth:"200px",color:"white",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>{index + 1}</td>
                    <td style={{minWidth:"300px",color:"white",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>{row.sensorType}</td>
                    <td style={{minWidth:"335px",color:"white",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>{row.serialNumber}</td>
                    <td style={{minWidth:"300px",color:"white",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>{row.min}</td>
                    <td style={{minWidth:"300px",color:"white",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>{row.max}</td>
                    <td style={{minWidth:"300px",color:"white",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>{row.calc}</td>
                  </tr>
                ))}
            </tbody>
          </table>{" "}
          </div>
      </ul>
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
  setViewMode,
  deviceYulListRequest,
  deviceYulDeleteRequest
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(List);
