import React, { Component } from "react";
import { connect } from "react-redux";
import { userUpdateRequest } from "actions/User";
import { productListRequest } from "actions/Product";
import { setViewMode } from "actions/Setting";

class Update extends Component {
  state = {
    postData: {
      loginId: this.props.authUser.loginID,
      name: this.props.authUser.name,
      password: this.props.authUser.Password,
      email: this.props.authUser.email,
      department: this.props.authUser.department,
      phone: this.props.authUser.phone,
      userType: this.props.authUser.userType
    }
  };
  update = () => {
    if (!this.state.postData.name) {
      alert("사용자이름을 입력하세요");
    } else if (!this.state.postData.email) {
      alert("이메일을 입력하세요");
    } else if (!this.state.postData.department) {
      alert("부서를 입력하세요");
    } else if (!this.state.postData.phone) {
      alert("전화번호를 입력하세요");
    } else if (!this.state.postData.userType) {
      alert("사용자권한을 선택하세요");
    } else {
      this.setState(
        {
          postData: {
            ...this.state.postData
          }
        },
        () => {
          this.props.userUpdateRequest(this.state.postData);
        }
      );
    }
  };
  handleChange = e => {
    console.log("handleChange", e.target.value);
    this.setState({
      postData: {
        ...this.state.postData,
        [e.target.name]: e.target.value
      }
    });
  };

  componentDidMount() {
    this.props.productListRequest();
  }

  render() {
    const grades = ["좋음", "보통", "민감군Ⅰ", "민감군Ⅱ", "나쁨", "매우나쁨"];

    return (
      <div className="col-12 mx-auto">
        <form className="text-blue w3-margin">
          <table className="table table-bordered text-center">
            <thead>
              <tr>
                <th>구분</th>
                {grades.map(grade => (
                  <th colspan="2">{grade}</th>
                ))}
                <th>알람</th>
                <th>수정</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>구분</td>
                {grades.map(grade => (
                  <React.Fragment>
                    <td>min</td>
                    <td>max</td>
                  </React.Fragment>
                ))}
                <td>알람</td>
                <td>
                  <button className="btn btn-primary mb-0">수정</button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>{" "}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authUser: state.auth.authUser,
  selectedNode: state.tree.selectedNode,
  productList: state.product.list,
  viewMode: state.settings.viewMode,
  item: state.user.item
});

const mapDispatchToProps = {
  userUpdateRequest,
  productListRequest,
  setViewMode
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Update);
