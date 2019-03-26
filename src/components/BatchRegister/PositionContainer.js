import React, { Component } from "react";
import { connect } from "react-redux";
import AddPosition from "../Tree/AddPosition";
import { selectTreeNode } from "actions/Tree";
import { buildingListRequest } from "actions/Building";
import { positionListByBuildingIdRequest } from "actions/Position";

class PositionContainer extends React.Component {
  // isReadyToNext = () => {
  //   return this.props.oldBuildingList === this.props.authUser.buildingList
  //     ? true
  //     : false;
  // };

  // constructor(props) {
  //   super(props);
  //   this.state = {};
  // }
  componentDidMount() {
    // let stepBuildingList = this.props.authUser.buildingList;
    // let newList = stepBuildingList.replace(this.props.oldBuildingList, "");
    // console.log("stepBuildingList", stepBuildingList);
    // console.log("newList", newList);
    // this.props.buildingListRequest({
    //   // id: "" + this.props.authUser.buildingList
    //   id: "" + stepBuildingList
    // });
    // // this.props.positionListByBuildingIdRequest({
    // //   id: "" + this.props.authUser.positionList
    // // });

    // console.log("1111", this.props.oldBuildingList);

    //       {this.props.oldBuildingList +
    //         " : " +
    let stepBuildingList = this.props.authUser.buildingList.replace(
      this.props.oldBuildingList + ",",
      ""
    );
    console.log("stepBuildingList", stepBuildingList);
    this.props.buildingListRequest({ id: stepBuildingList });
    this.props.positionListByBuildingIdRequest({ id: stepBuildingList });
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-3">
            <ul className="list-group" style={{ marginTop: "40px" }}>
              <li className="list-group-item bg-dark">
                <h4 className="mb-0 text-white">건물목록</h4>
              </li>
              {this.props.buildingList.map(building => (
                <li key={building.id} className="list-group-item">
                  {building.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="col-9">
            <AddPosition />
          </div>
        </div>
        <ul className="list-group">
          {this.props.positionList.map(position => (
            <li key={position.id} className="list-group-item">
              {position.name}
            </li>
          ))}
        </ul>

        <div className="text-center mt-3">
          <button
            type="button"
            className="btn btn-primary"
            style={{ width: "150px" }}
            onClick={e => {
              this.props.nextStep();
            }}
          >
            다음
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authUser: state.auth.authUser,
  buildingList: state.building.list,
  positionList: state.position.list
});

const mapDispatchToProps = {
  buildingListRequest,
  positionListByBuildingIdRequest,
  selectTreeNode
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PositionContainer);
