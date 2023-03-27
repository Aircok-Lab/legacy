import React, { cloneElement, Component } from "react";
import { connect } from "react-redux";
import {
  deviceListByBuildingIdRequest,
  deviceListByPositionIdRequest,
  deviceDeleteRequest,
  deviceSetItem
} from "actions/Device";
import { setViewMode } from "actions/Setting";

class List extends React.Component {
  state = {
    showModal: false,
    selectedNode: {},
    deviceList: []
  };

  delete = () => {
    if (confirm("선택항목을 삭제하시겠습니까?")) {
      const selectedDevices = this.state.deviceList.filter(device => {
        return device.isChecked;
      });
      const ids = selectedDevices.map(({ serialNumber }) => serialNumber);
      this.props.deviceDeleteRequest({
        node: this.props.selectedNode,
        ids: ids.join()
      });
    }
  };

  componentDidMount() {
    if (this.props.selectedNode && this.props.selectedNode.buildingID) {
      // 층
      this.props.deviceListByPositionIdRequest({
        id: this.props.selectedNode.id
      });
    } else if (this.props.selectedNode && this.props.selectedNode.id) {
      // 건물
      this.props.deviceListByBuildingIdRequest({
        id: this.props.selectedNode.id
      });
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      JSON.stringify(this.state.deviceList) !=
      JSON.stringify(this.props.deviceList)
    ) {
      this.setState({ deviceList: this.props.deviceList });
    }

    if (
      JSON.stringify(prevProps.selectedNode) !=
        JSON.stringify(this.props.selectedNode) &&
      this.props.selectedNode &&
      this.props.selectedNode.id
    ) {
      if (this.props.selectedNode.buildingID) {
        // 층
        this.props.deviceListByPositionIdRequest({
          id: this.props.selectedNode.id
        });
      } else {
        // 건물
        this.props.deviceListByBuildingIdRequest({
          id: this.props.selectedNode.id
        });
      }
    }
  }
  render() {
    return (
      <React.Fragment>
        {!this.props.hideButton && (
          <div className="clearfix flex-shrink-0 pb-1 pt-2">
            <div className="float-left" />
            <div className="float-right" style={{fontFamily:"Noto Sans KR",marginRight:"15px"}}>
              <button
                className="btn btn-primary"
                onClick={e => this.props.setViewMode("add")}
                style={{ marginLeft: "2px" ,border:'1px solid #928e8e'}}
                disabled={
                  this.props.selectedNode && !this.props.selectedNode.buildingID
                }
              >
                등록
              </button>
              <button
                className="btn btn-primary"
                onClick={e => {
                  const selectedDevices = this.state.deviceList.filter(
                    device => device.isChecked
                  );
                  this.props.setViewMode("update", selectedDevices[0]);
                }}
                style={{ marginLeft: "2px" ,border:'1px solid #928e8e'}}
                disabled={
                  this.state.deviceList.filter(device => device.isChecked)
                    .length != 1
                }
              >
                수정
              </button>
              <button
                className="btn btn-primary"
                onClick={e => {
                  this.delete();
                }}
                style={{ marginLeft: "2px" ,border:'1px solid #928e8e'}}
                disabled={
                  this.state.deviceList.filter(device => device.isChecked)
                    .length == 0
                }
              >
                삭제
              </button>
            </div>
          </div>
        )}
        <div className="flex-fill overflow-auto table-responsive" style={{fontFamily:"Noto Sans KR"}}>
          <table className="table table-bordered text-center text-nowrap" style={{width:'99%',fontFamily:"Noto Sans KR",fontSize:"13px"}}>
            <thead>
              <tr style={{width:'99%',fontFamily:"Noto Sans KR"}}>
                {!this.props.hideButton && (
                  <th style={{backgroundColor:"rgb(90 87 87)" ,color:"white" ,borderBottom:"0px solid white" ,color:"white",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>
                    <input
                      type="checkbox"
                      onChange={event => {
                        let deviceList = this.state.deviceList;
                        deviceList.forEach(device => {
                          device.isChecked = event.target.checked;
                        });
                        this.setState({ deviceList: deviceList });
                      }}
                    />
                  </th>
                )}
                <th style={{minWidth: "90px"  ,backgroundColor:"rgb(90 87 87)" ,color:"white" ,borderBottom:"0px solid white",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>번호</th>
                <th style={{minWidth: "255px" ,backgroundColor:"rgb(90 87 87)" ,color:"white" ,borderBottom:"0px solid white",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>측정기명</th>
                <th style={{minWidth: "80px"  ,backgroundColor:"rgb(90 87 87)" ,color:"white" ,borderBottom:"0px solid white",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>측정주기</th>
                <th style={{minWidth: "243px" ,backgroundColor:"rgb(90 87 87)" ,color:"white" ,borderBottom:"0px solid white",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>S/N</th>
                <th style={{minWidth: "268px" ,backgroundColor:"rgb(90 87 87)" ,color:"white" ,borderBottom:"0px solid white",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>제품군</th>
                <th style={{minWidth: "168px" ,backgroundColor:"rgb(90 87 87)" ,color:"white" ,borderBottom:"0px solid white",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>개통번호</th>
                <th style={{minWidth: "226px" ,backgroundColor:"rgb(90 87 87)" ,color:"white" ,borderBottom:"0px solid white",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>IP주소</th>
              </tr>
            </thead>
            <tbody style={{height:"718px" ,width:"100%"}}>
              {this.state.deviceList &&
                this.state.deviceList.map((row, index) => (
                  <tr key={row.serialNumber}>
                    {!this.props.hideButton && (
                      <td style={{border:"1px solid rgb(72, 68, 68)"}}>
                        <input
                          type="checkbox"
                          checked={row.isChecked}
                          value={row.serialNumber}
                          onChange={event => {
                            let deviceList = this.state.deviceList;
                            deviceList.forEach(device => {
                              if (device.serialNumber === event.target.value) {
                                device.isChecked = event.target.checked;
                              }
                            });
                            this.setState({ deviceList: deviceList });
                          }}
                        />
                      </td>
                    )}
                    <td style={{minWidth: "90px",  color:"white",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>{index + 1}</td>
                    <td style={{minWidth: "255px", color:"white",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>{row.name}</td>
                    <td style={{minWidth: "80px",  color:"white",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>{row.period} 분</td>
                    <td style={{minWidth: "243px", color:"white",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>{row.serialNumber}</td>
                    <td style={{minWidth: "268px", color:"white",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>{row.productName}</td>
                    <td style={{minWidth: "168px", border:"1px solid rgb(72, 68, 68)",color:"white",fontFamily:"Noto Sans KR"}}>{row.networkType === "cellular" && row.phone}&nbsp;</td>
                    <td style={{minWidth: "208px", border:"1px solid rgb(72, 68, 68)",color:"white",fontFamily:"Noto Sans KR"}}>{row.networkType !== "cellular" && row.ip}&nbsp;</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div>&nbsp;</div>
      </React.Fragment>
    );
  }
}
const mapStateToProps = state => ({
  authUser: state.auth.authUser,
  deviceList: state.device.list,
  selectedNode: state.tree.selectedNode,
  viewMode: state.settings.viewMode
});

const mapDispatchToProps = {
  deviceListByBuildingIdRequest,
  deviceListByPositionIdRequest,
  deviceDeleteRequest,
  setViewMode,
  deviceSetItem
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(List);
