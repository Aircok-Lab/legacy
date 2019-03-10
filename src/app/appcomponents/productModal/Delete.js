import React, { Component } from "react";
import { connect } from "react-redux";
import { productDeleteRequest } from "actions/Product";
class DeleteProduct extends Component {
  add = () => {
    this.props.productDeleteRequest({
      loginId: "" + new Date().getTime(),
      name: "" + new Date().getTime(),
      password: "" + new Date().getTime(),
      email: "test@test.com",
      department: "Sales Department",
      phone: "010-555-5555",
      buildinglist: "" + this.props.selectedNode.BuildingID,
      positionlist: "" + this.props.selectedNode.id
    });
  };

  render() {
    return (
      <div>
        선택항목을 삭제하시겠습니까?
        <br />
        <div className="w3-right">
          <button
            type="button"
            className="w3-button w3-blue w3-padding"
            onClick={() => {
              const selectedProducts = this.props.productList.filter(
                product => product.isChecked
              );

              const ids = selectedProducts.map(({ id }) => id);
              // console.log("deleteProducts:", selectedProducts, ids.join());
              this.props.productDeleteRequest({
                node: this.props.selectedNode,
                ids: ids.join()
              });
              this.props.closeModal();
            }}
          >
            OK
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authProduct: state.auth.authProduct,
  selectedNode: state.tree.selectedNode
});

const mapDispatchToProps = {
  productDeleteRequest: productDeleteRequest
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeleteProduct);
