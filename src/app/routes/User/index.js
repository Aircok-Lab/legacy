import React from "react";
import { connect } from "react-redux";
import BuildingPositionTree from "components/Tree/BuildingPositionTree";
import Container from "components/User/Container";
class UserPage extends React.Component {
  componentDidMount() {
    // localStorage.removeItem("steps");
    // this.props.setViewMode("list");
  }

  render() {
    return (
      <div className="app-wrapper h-100">
        <div className="row w3-white shadow-sm p-2 mb-3">
          <h2 className="mb-0">사용자 관리</h2>
        </div>
        <div className="row" style={{ height: "90%" }}>
          <div className="col-md-3 bg-white shadow-sm">
            <BuildingPositionTree
              hideButton={false}
              hidePosition={false}
              // checkable={false}
              checkable={this.props.viewMode === "list" ? false : true}
              selectable={false}
            />
          </div>
          <div className="col-md-9">
            <div className="animated slideInUpTiny animation-duration-3">
              <Container />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
// const UserPage = () => {
//   return (
//     <div className="app-wrapper h-100">
//       <div className="row w3-white shadow-sm p-2 mb-3">
//         <h2 className="mb-0">사용자 관리</h2>
//       </div>
//       <div className="row" style={{ height: "90%" }}>
//         <div className="col-md-3 bg-white shadow-sm">
//           <BuildingPositionTree
//             hideButton={false}
//             hidePosition={false}
//             // checkable={false}
//             checkable={true}
//             selectable={false}
//           />
//         </div>
//         <div className="col-md-9">
//           <div className="animated slideInUpTiny animation-duration-3">
//             <Container />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserPage;
const mapStateToProps = state => ({
  viewMode: state.settings.viewMode
});

const mapDispatchToProps = {
  // setViewMode
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserPage);
