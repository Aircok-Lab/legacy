import React, { Component } from "react";
import { connect } from "react-redux";
import { systemItemRequest, systemUpdateRequest } from "actions/System";
import { setViewMode } from "actions/Setting";

class Update extends Component {
  state = {
    postData: {}
  };

  update = () => {
    this.props.systemUpdateRequest(this.state.postData);
  };

  handleChange = e => {
    this.setState({
      postData: {
        ...this.state.postData,
        [e.target.name]: e.target.value
      }
    });
  };

  componentDidMount() {
    this.props.systemItemRequest({ id: "1" });
  }

  static getDerivedStateFromProps(props, state) {
    if (props.data.id !== state.postData.id) {
      return {
        postData: props.data
      };
    }
    return null;
  }

  render() {
    return (
      <div className="col-6 mx-auto">
        <form className="text-blue w3-margin">
          <div className="w3-row w3-section">
            <div className="w3-col w3-padding-right" style={{ width: "160px" }}>
              Table 전환주기(초)
            </div>
            <div className="w3-rest">
              <select
                className="form-control"
                name="scrollTime"
                value={this.state.postData.scrollTime}
                onChange={this.handleChange}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="25">25</option>
                <option value="30">30</option>
              </select>
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
                <option value="20">20</option>
                <option value="25">25</option>
                <option value="30">30</option>
              </select>
            </div>
          </div>
          <div className="w3-row w3-section">
            <div className="w3-col w3-padding-right" style={{ width: "160px" }}>
              모니터링 전환주기(초)
            </div>
            <div className="w3-rest">
              <select
                className="form-control"
                name="monitoringTime"
                value={this.state.postData.monitoringTime}
                onChange={this.handleChange}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="25">25</option>
                <option value="30">30</option>
              </select>
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

const mapStateToProps = state => ({
  data: state.system.data
});

const mapDispatchToProps = {
  systemUpdateRequest,
  systemItemRequest
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Update);
