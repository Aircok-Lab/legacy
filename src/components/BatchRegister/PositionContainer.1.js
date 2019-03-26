// import React from "react";
// import AddPosition from "../Tree/AddPosition";

// const PositionContainer = props => {
//   return (
//     <div>
//       <div className="row">
//         <div className="col-3">
//           <h3 className="mt-3 border-bottom">빌딩목록</h3>
//           <div>LG마곡</div>
//           <div>LG전자 평택</div>
//         </div>
//         <div className="col-9">
//           <AddPosition nextStep={props.nextStep} />
//           <hr />
//           <div>position list</div>
//           <hr />
//           <div>
//             {this.props.oldBuildingList +
//               " : " +
//               this.props.authUser.buildingList}
//           </div>
//         </div>
//       </div>
//       <div className="text-center mt-3">
//         <button
//           type="button"
//           className="btn btn-primary"
//           style={{ width: "150px" }}
//           onClick={e => {
//             props.nextStep();
//           }}
//         >
//           다음
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PositionContainer;

import React, { Component } from "react";
import { connect } from "react-redux";
import AddPosition from "../Tree/AddPosition";

class PositionContainer extends React.Component {
  isReadyToNext = () => {
    return this.props.oldBuildingList === this.props.authUser.buildingList
      ? true
      : false;
  };

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-12">
            <AddPosition />
          </div>
        </div>
        <hr />
        <div>
          {this.props.oldBuildingList +
            " : " +
            this.props.authUser.buildingList}
        </div>
        <div className="text-center mt-3">
          <button
            type="button"
            className="btn btn-primary"
            style={{ width: "150px" }}
            onClick={e => {
              this.props.nextStep();
            }}
            disabled="true"
            disabled={this.isReadyToNext()}
          >
            다음
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authUser: state.auth.authUser
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PositionContainer);
