import React, { Component } from "react";

export class FormUserDetails extends Component {
  continue = e => {
    e.preventDefault();
    this.props.nextStep();
  };

  state = {
    postData: {
      scrollTime: 5,
      scrollRow: 10,
      monitoringTime: 5
    }
  };

  update = () => {
    if (isNaN(this.state.postData.scrollTime)) {
      alert("테이블 전환주기 값을 입력하세요.");
    } else if (isNaN(this.state.postData.monitoringTime)) {
      alert("모니터링 전환주기 값을 입력하세요.");
    } else {
      this.props.systemUpdateRequest(this.state.postData);
    }
  };

  handleChange = e => {
    this.setState({
      postData: {
        ...this.state.postData,
        [e.target.name]: e.target.value
      }
    });
  };

  render() {
    const { values, handleChange } = this.props;
    // return (
    //   <React.Fragment>
    //     <input
    //       hintText="Enter Your First Name"
    //       floatingLabelText="First Name"
    //       onChange={handleChange("firstName")}
    //       defaultValue={values.firstName}
    //     />
    //     <br />
    //     <input
    //       hintText="Enter Your Last Name"
    //       floatingLabelText="Last Name"
    //       onChange={handleChange("lastName")}
    //       defaultValue={values.lastName}
    //     />
    //     <br />
    //     <input
    //       hintText="Enter Your Email"
    //       floatingLabelText="Email"
    //       onChange={handleChange("email")}
    //       defaultValue={values.email}
    //     />
    //     <br />
    //     <button
    //       label="Continue"
    //       primary={true}
    //       style={styles.button}
    //       onClick={this.continue}
    //     >
    //       Next
    //     </button>
    //   </React.Fragment>
    // );

    return (
      <div className="col-6 mx-auto">
        <form className="text-blue w3-margin">
          <div className="w3-row w3-section">
            <div className="w3-col w3-padding-right" style={{ width: "160px" }}>
              Table 전환주기(초)
            </div>
            <div className="w3-rest">
              <input
                className="form-control"
                name="scrollTime"
                value={this.state.postData.scrollTime}
                type="number"
                placeholder=""
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div className="w3-row w3-section">
            <div className="w3-col w3-padding-right" style={{ width: "160px" }}>
              Table 스크롤 라인수
            </div>
            <div className="w3-rest">
              <select
                className="form-control"
                name="scrollRow"
                value={this.state.postData.scrollRow}
                onChange={this.handleChange}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
              </select>
            </div>
          </div>
          <div className="w3-row w3-section">
            <div className="w3-col w3-padding-right" style={{ width: "160px" }}>
              모니터링 전환주기(초)
            </div>
            <div className="w3-rest">
              <input
                className="form-control"
                name="monitoringTime"
                value={this.state.postData.monitoringTime}
                type="number"
                placeholder=""
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div className="clearfix">
            <span className="float-right">
              {" "}
              <button
                type="button"
                className="btn btn-primary"
                onClick={e => {
                  this.update();
                }}
              >
                저장
              </button>
            </span>
          </div>
        </form>{" "}
      </div>
    );
  }
}

const styles = {
  button: {
    margin: 15
  }
};

export default FormUserDetails;
