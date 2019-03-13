import React, { cloneElement, Component } from "react";
import { connect } from "react-redux";
import { productListRequest, productDeleteRequest } from "actions/Product";
import ProductModalContainer from "components/product/ProductContainer";

class ProductTable extends React.Component {
  state = {
    showModal: false,
    modalMode: "addProduct",
    productList: []
  };

  openModal = param => e => {
    let modalMode = param;
    this.setState({ showModal: true, modalMode });
  };

  closeModal = () => {
    this.setState({ showModal: false });
  };

  componentDidMount() {
    // this.setState({ productList: this.props.productList });
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
      if (this.props.selectedNode.BuildingID) {
        // 층
        this.props.productListByPositionIdRequest({
          positionID: "" + this.props.selectedNode.id
        });
      } else {
        // 건물
        this.props.productListRequest({
          buildingID: "" + this.props.selectedNode.id
        });
      }
    }
  }

  render() {
    return (
      <div className="">
        <div className="animated slideInUpTiny animation-duration-3">
          <div className="text-right w3-margin-bottom">
            <button
              onClick={this.openModal("addProduct")}
              style={{ marginLeft: "2px" }}
            >
              등록
            </button>

            <button
              onClick={this.openModal("updateProduct")}
              style={{ marginLeft: "2px" }}
              disabled={
                this.state.productList.filter(product => product.isChecked)
                  .length != 1
              }
            >
              수정
            </button>
            <button
              onClick={this.openModal("deleteConfirmProduct")}
              style={{ marginLeft: "2px" }}
              disabled={
                this.state.productList.filter(product => product.isChecked)
                  .length == 0
              }
            >
              삭제
            </button>
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
                      <td>{row.Name}</td>
                      <td>{row.Version}</td>
                      <td>{row.Period}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <ProductModalContainer
          showModal={this.state.showModal}
          modalMode={this.state.modalMode}
          closeModal={this.closeModal}
          productList={this.state.productList}
        />
      </div>
    );
  }
}
const mapStateToProps = state => ({
  authProduct: state.auth.authProduct,
  productList: state.product.list,
  selectedNode: state.tree.selectedNode
});

const mapDispatchToProps = {
  productListRequest: productListRequest,
  productDeleteRequest
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductTable);
