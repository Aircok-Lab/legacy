import React, { cloneElement, Component } from "react";
import { connect } from "react-redux";
import {
  productListRequest,
  productDeleteRequest,
  productSetItem
} from "actions/Product";
import { setViewMode } from "actions/Setting";

class List extends React.Component {
  state = {
    showModal: false,
    selectedNode: {},
    productList: []
  };

  delete = () => {
    if (confirm("선택항목을 삭제하시겠습니까?")) {
      const selectedUsers = this.state.productList.filter(product => {
        return product.isChecked;
      });
      const ids = selectedUsers.map(({ id }) => id);
      this.props.productDeleteRequest({
        node: this.props.selectedNode,
        ids: ids.join()
      });
    }
  };

  componentDidMount() {
    this.props.productListRequest();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      JSON.stringify(prevProps.productList) !=
      JSON.stringify(this.props.productList)
    ) {
      this.setState({ productList: this.props.productList });
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
      <div className="">
        <div className="animated slideInUpTiny animation-duration-3">
          <div className="clearfix pb-1">
            <div className="float-left" />
            <div className="float-right">
              <button
                className="btn btn-primary"
                onClick={e => this.props.setViewMode("add")}
                style={{ marginLeft: "2px" }}
                disabled={!this.props.selectedNode.buildingID}
              >
                등록
              </button>
              <button
                className="btn btn-primary"
                onClick={e => {
                  const selectedUser = this.state.productList.filter(
                    product => product.isChecked
                  );
                  this.props.productSetItem(selectedUser[0]);
                  this.props.setViewMode("update");
                }}
                style={{ marginLeft: "2px" }}
                disabled={
                  this.state.productList.filter(product => product.isChecked)
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
                style={{ marginLeft: "2px" }}
                disabled={
                  this.state.productList.filter(product => product.isChecked)
                    .length == 0
                }
              >
                삭제
              </button>
            </div>
          </div>

          <div className="w3-responsive">
            <table className="w3-table-all w3-centered">
              <thead>
                <tr>
                  <th style={{ paddingRight: "24px", width: "30px" }}>
                    <input
                      className="w3-check"
                      type="checkbox"
                      onChange={event => {
                        let productList = [...this.state.productList];
                        productList.forEach(product => {
                          product.isChecked = event.target.checked;
                        });
                        this.setState({ productList: productList });
                      }}
                    />
                  </th>
                  <th>번호</th>
                  <th>제품군명</th>
                  <th>펌웨어버전</th>
                  <th>측정주기</th>
                </tr>
              </thead>
              <tbody>
                {this.state.productList &&
                  this.state.productList.map((row, index) => (
                    <tr key={row.id}>
                      <td>
                        <input
                          className="w3-check"
                          type="checkbox"
                          checked={row.isChecked}
                          value={row.id}
                          onChange={event => {
                            let productList = [...this.state.productList];
                            productList.forEach(product => {
                              if (product.id === Number(event.target.value)) {
                                product.isChecked = event.target.checked;
                              }
                            });
                            this.setState({ productList: productList });
                          }}
                        />
                      </td>
                      <td>{index + 1}</td>
                      <td>{row.name}</td>
                      <td>{row.Version}</td>
                      <td>{row.period}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  authUser: state.auth.authUser,
  productList: state.product.list,
  selectedNode: state.tree.selectedNode,
  viewMode: state.settings.viewMode
});

const mapDispatchToProps = {
  productListRequest,
  productDeleteRequest,
  setViewMode,
  productSetItem
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(List);
