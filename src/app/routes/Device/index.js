// import React from "react";
// import BuildingPositionTree from "components/tree/BuildingPositionTree";
// import DeviceTable from "components/device/DeviceTable";

// const DevicePage = () => {
//   return (
//     <div className="app-wrapper">
//       <div className="w3-panel w3-white w3-card w3-padding">
//         <h2>측정기 관리</h2>
//       </div>
//       <div className="row">
//         <div className="col-md-3">
//           <BuildingPositionTree
//             hideButton={false}
//             hidePosition={false}
//             checkable={true}
//             selectable={false}
//           />
//         </div>
//         <div className="col-md-9">
//           <div className="animated slideInUpTiny animation-duration-3">
//             <div className="clearfix pb-1">
//               <span className="float-left">Float left</span>
//               <span className="float-right">
//                 <React.Fragment>
//                   <button
//                     // onClick={this.openModal("addDevice")}
//                     style={{ marginLeft: "2px" }}
//                     disabled={!this.props.selectedNode.BuildingID}
//                   >
//                     등록
//                   </button>

//                   <button
//                     // onClick={this.openModal("updateDevice")}
//                     style={{ marginLeft: "2px" }}
//                     disabled={
//                       this.state.deviceList.filter(device => device.isChecked)
//                         .length != 1
//                     }
//                   >
//                     수정
//                   </button>
//                   <button
//                     // onClick={this.openModal("deleteConfirmDevice")}
//                     style={{ marginLeft: "2px" }}
//                     disabled={
//                       this.state.deviceList.filter(device => device.isChecked)
//                         .length == 0
//                     }
//                   >
//                     삭제
//                   </button>
//                 </React.Fragment>
//               </span>
//             </div>

//             {/* <DeviceTable /> */}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DevicePage;

import React, { Component } from "react";
import { connect } from "react-redux";
import BuildingPositionTree from "components/tree/BuildingPositionTree";
import DeviceTable from "components/device/DeviceTable";

class DevicePage extends Component {
  render() {
    return (
      <div className="app-wrapper">
        <div className="w3-panel w3-white w3-card w3-padding">
          <h2>측정기 관리</h2>
        </div>
        <div className="row">
          <div className="col-md-3">
            <BuildingPositionTree
              hideButton={false}
              hidePosition={false}
              checkable={false}
              selectable={false}
            />
          </div>
          <div className="col-md-9">
            <div className="animated slideInUpTiny animation-duration-3">
              <DeviceTable />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// export default DevicePage;
const mapStateToProps = state => ({
  authUser: state.auth.authUser,
  deviceList: state.device.list,
  selectedNode: state.tree.selectedNode
});

const mapDispatchToProps = {
  // deviceListByBuildingIdRequest: deviceListByBuildingIdRequest,
  // deviceListByPositionIdRequest: deviceListByPositionIdRequest,
  // deviceDeleteRequest
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DevicePage);
