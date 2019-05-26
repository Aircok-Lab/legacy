import React, { Component } from "react";
import BuildingPositionTree from "components/Tree/BuildingPositionTree";
import Container from "components/MonitoringSelection/Container";

// class MonitoringSelectionPage extends Component {
//   render() {
//     return (
//       <div className="app-wrapper">
//         <div className="row w3-white shadow-sm p-2 mb-3">
//           <h2 className="mb-0">모니터링 측정기 관리</h2>
//         </div>
//         <div className="row">
//           <div className="col-md-12">
//             <div className="animated slideInUpTiny animation-duration-3">
//               <Container />
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

// const MonitoringSelectionPage = () => {
//   return (
//     <div className="container-fluid h-100 d-flex flex-fill flex-column">
//       <div className="row flex-shrink-0 w3-white shadow-sm">
//         <h2 className="pt-2 pl-2">모니터링 측정기 관리</h2>
//       </div>
//       <div className="row flex-fill d-flex">
//         <div className="col-3 h-100 d-flex flex-column shadow-sm">
//           <BuildingPositionTree
//             hideButton={false}
//             hidePosition={false}
//             checkable={false}
//             selectable={false}
//           />
//         </div>
//         <div className="col-9 h-100 d-flex flex-column shadow-sm">
//           <Container />
//         </div>
//       </div>
//     </div>
//   );
// };

const MonitoringSelectionPage = () => {
  return (
    <div className="container-fluid d-flex flex-column h-100">
      <div className="w3-white shadow-sm">
        <h2 className="pt-2 pl-2">모니터링 측정기 관리</h2>
      </div>
      <div className="row h-100">
        {/* <div className="col-3 h-100 d-flex flex-column shadow-sm">
          <BuildingPositionTree
            hideButton={false}
            hidePosition={false}
            checkable={false}
            selectable={false}
          />
        </div> */}
        <div className="col-12 h-100 d-flex flex-column shadow-sm">
          <Container />
        </div>
      </div>
    </div>
  );
};

export default MonitoringSelectionPage;
