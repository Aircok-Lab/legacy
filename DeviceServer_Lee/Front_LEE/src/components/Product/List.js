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
    this.setState({ productList: this.props.productList });
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
      <React.Fragment>
        {!this.props.hideButton && (
          <div className="row px-2">
            <div className="col-12">
              <div className="clearfix pb-1 pt-2">
                <div className="float-left" />
                <div className="float-right" style={{marginRight:"21px"}}>
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
                      const selectedProducts = this.state.productList.filter(
                        product => product.isChecked
                      );
                      this.props.setViewMode("update", selectedProducts[0]);
                    }}
                    style={{ marginLeft: "2px" }}
                    disabled={
                      this.state.productList.filter(
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
                      this.state.productList.filter(
                        product => product.isChecked
                      ).length == 0
                    }
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="px-2">
          <table className="table" style={{height:"100%",marginLeft:"49px"}}>
            <thead>
              <tr>
                <th  style={{border:"1px solid rgb(72, 68, 68)" , fontFamily:"Noto Sans KR",backgroundColor:"rgb(37, 36, 36)",borderRight:"1px solid rgb(72, 68, 68)"}}> 
                  <input
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
                <th style={{borderBottom:"1px solid rgb(72, 68, 68)",minWidth:"100px" ,backgroundColor:"rgb(37, 36, 36)" ,color:"white",border:"1px solid rgb(72, 68, 68)" , fontFamily:"Noto Sans KR"}}>번호</th>
                <th style={{borderBottom:"1px solid rgb(72, 68, 68)",minWidth:"330px" ,backgroundColor:"rgb(37, 36, 36)" ,color:"white",border:"1px solid rgb(72, 68, 68)" , fontFamily:"Noto Sans KR"}}>제품군명</th>
                <th style={{borderBottom:"1px solid rgb(72, 68, 68)",minWidth:"100px" ,backgroundColor:"rgb(37, 36, 36)" ,color:"white",border:"1px solid rgb(72, 68, 68)" , fontFamily:"Noto Sans KR"}}>펌웨어버전</th>
                <th style={{borderBottom:"1px solid rgb(72, 68, 68)",minWidth:"367px" ,backgroundColor:"rgb(37, 36, 36)" ,color:"white",border:"1px solid rgb(72, 68, 68)" , fontFamily:"Noto Sans KR"}}>펌웨어파일</th>
                <th style={{borderBottom:"1px solid rgb(72, 68, 68)",minWidth:"330px" ,backgroundColor:"rgb(37, 36, 36)" ,color:"white",border:"1px solid rgb(72, 68, 68)" , fontFamily:"Noto Sans KR"}}>파일사이즈</th>
                <th style={{borderBottom:"1px solid rgb(72, 68, 68)",minWidth:"537px" ,backgroundColor:"rgb(37, 36, 36)" ,color:"white",border:"1px solid rgb(72, 68, 68)" , fontFamily:"Noto Sans KR"}}>측정주기</th>
              </tr>
            </thead>
            <tbody style={{height:"100%",width:"100%"}}>
              {this.state.productList &&
                this.state.productList.map((row, index) => (
                  <tr key={row.id}>
                    <td style={{ width: "60px" ,backgroundColor:"rgb(26, 24, 24)",border:"1px solid rgb(72, 68, 68)" , fontFamily:"Noto Sans KR"}}>
                      <input
                        type="checkbox"
                        checked={row.isChecked}
                        value={row.id}
                        style={{backgroundColor:"rgb(37, 36, 36)" ,color:"white",borderRight:"1px solid rgb(72, 68, 68)"}}
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
                    <td style={{minWidth:"100px" ,backgroundColor:"rgb(26, 24, 24)" ,color:"white",border:"1px solid rgb(72, 68, 68)" , fontFamily:"Noto Sans KR"}}>{index + 1}</td>
                    <td style={{minWidth:"330px" ,backgroundColor:"rgb(26, 24, 24)" ,color:"white",border:"1px solid rgb(72, 68, 68)" , fontFamily:"Noto Sans KR"}}>{row.name}</td>
                    <td style={{minWidth:"100px" ,backgroundColor:"rgb(26, 24, 24)" ,color:"white",border:"1px solid rgb(72, 68, 68)" , fontFamily:"Noto Sans KR"}}>{row.version}</td>
                    <td style={{minWidth:"340px" ,backgroundColor:"rgb(26, 24, 24)" ,color:"white",border:"1px solid rgb(72, 68, 68)" , fontFamily:"Noto Sans KR"}}>{row.firmware}</td>
                    <td style={{minWidth:"330px" ,backgroundColor:"rgb(26, 24, 24)" ,color:"white",border:"1px solid rgb(72, 68, 68)" , fontFamily:"Noto Sans KR"}}>{row.filesize}</td>
                    <td style={{minWidth:"537px" ,backgroundColor:"rgb(26, 24, 24)" ,color:"white",border:"1px solid rgb(72, 68, 68)" , fontFamily:"Noto Sans KR"}}>{row.period} 분</td>
                  </tr>
                ))}
            </tbody>
          </table>{" "}
        </div>

       
        <div>&nbsp;</div>
        <div>&nbsp;</div>
        <div>&nbsp;</div>
        <div>&nbsp;</div>
      </React.Fragment>
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
