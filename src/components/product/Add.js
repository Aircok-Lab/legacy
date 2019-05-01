import React, { Component } from "react";
import { connect } from "react-redux";
import { productAddRequest } from "actions/Product";
import { setViewMode } from "actions/Setting";
import setInitValue from "../../util/setInitValue";

class Add extends Component {
  state = {
    postData: {
      name: setInitValue("" + new Date().getTime()),
      version: "v2.0.0",
      file: null,
      firmware: "",
      filesize: 0,
      period: "1",
      indoor: "1",
      pm25: "1",
      pm10: "1",
      co2: "1",
      co: "1",
      hcho: "1",
      voc: "1",
      temperature: "1",
      humidity: "1",
      noise: "1"
    }
  };
  add = () => {
    if (!this.state.postData.name) {
      alert("제품군명을 입력하세요");
    } else if (!this.state.postData.version) {
      alert("펌웨어버전을 입력하세요");
    } else {
      this.props.productAddRequest(this.state.postData);
    }
  };
  handleChange = e => {
    const target = e.target;
    let value;
    if (target.type === "checkbox") {
      value = target.checked ? "1" : "0";
    } else if (target.type === "file") {
      value = e.target.files[0];
    } else {
      value = target.value;
    }
    const name = target.name;
    this.setState(
      {
        postData: {
          ...this.state.postData,
          [name]: value
        }
      }
    );
  };

  render() {
    return (
      <div className="col-6 mx-auto">
        <form className="text-blue w3-margin">
          <h2 className="text-center">제품군 등록</h2>
          <div className="w3-row w3-section">
            <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
              제품군명
            </div>
            <div className="w3-rest">
              <input
                className="form-control"
                name="name"
                value={this.state.postData.name}
                type="text"
                placeholder=""
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div className="w3-row w3-section">
            <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
              장치타입
            </div>
            <div className="w3-rest">
              <select
                className="form-control"
                name="indoor"
                value={this.state.postData.indoor}
                onChange={this.handleChange}
              >
                <option value="1">실내형</option>
                <option value="0">실외형</option>
              </select>
            </div>
          </div>

          <div className="w3-row w3-section">
            <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
              측정항목
            </div>
            <div className="w3-rest text-black">
              <table className="table table-bordered table-sm">
                <thead>
                  <tr>
                    <th />
                    <th>측정항목 설정</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="form-check">
                        <label className="form-check-label">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            name="pm10"
                            checked={
                              this.state.postData.pm10 === "1" ? true : false
                            }
                            onChange={this.handleChange}
                          />
                          &nbsp;
                        </label>
                      </div>
                    </td>
                    <td>PM10</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="form-check">
                        <label className="form-check-label">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            name="pm25"
                            checked={
                              this.state.postData.pm25 === "1" ? true : false
                            }
                            onChange={this.handleChange}
                          />
                          &nbsp;
                        </label>
                      </div>
                    </td>
                    <td>PM25</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="form-check">
                        <label className="form-check-label">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            name="co2"
                            checked={
                              this.state.postData.co2 === "1" ? true : false
                            }
                            onChange={this.handleChange}
                          />
                          &nbsp;
                        </label>
                      </div>
                    </td>
                    <td>CO2</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="form-check">
                        <label className="form-check-label">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            name="co"
                            checked={
                              this.state.postData.co === "1" ? true : false
                            }
                            onChange={this.handleChange}
                          />
                          &nbsp;
                        </label>
                      </div>
                    </td>
                    <td>CO</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="form-check">
                        <label className="form-check-label">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            name="hcho"
                            checked={
                              this.state.postData.hcho === "1" ? true : false
                            }
                            onChange={this.handleChange}
                          />
                          &nbsp;
                        </label>
                      </div>
                    </td>
                    <td>HCHO</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="form-check">
                        <label className="form-check-label">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            name="voc"
                            checked={
                              this.state.postData.voc === "1" ? true : false
                            }
                            onChange={this.handleChange}
                          />
                          &nbsp;
                        </label>
                      </div>
                    </td>
                    <td>VOC</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="form-check">
                        <label className="form-check-label">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            name="temperature"
                            checked={
                              this.state.postData.temperature === "1"
                                ? true
                                : false
                            }
                            onChange={this.handleChange}
                          />
                          &nbsp;
                        </label>
                      </div>
                    </td>
                    <td>Temperature</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="form-check">
                        <label className="form-check-label">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            name="humidity"
                            checked={
                              this.state.postData.humidity === "1"
                                ? true
                                : false
                            }
                            onChange={this.handleChange}
                          />
                          &nbsp;
                        </label>
                      </div>
                    </td>
                    <td>humidity</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="form-check">
                        <label className="form-check-label">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            name="noise"
                            checked={
                              this.state.postData.noise === "1" ? true : false
                            }
                            onChange={this.handleChange}
                          />
                          &nbsp;
                        </label>
                      </div>
                    </td>
                    <td>Noise</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="w3-row w3-section">
            <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
              펌웨어버전
            </div>
            <div className="w3-rest">
              <input
                className="form-control"
                name="version"
                value={this.state.postData.version}
                type="text"
                placeholder=""
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div className="w3-row w3-section">
            <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
              펌웨어파일
            </div>
            <div className="w3-rest">
              <input
                className="form-control"
                name="file"
                type="file"
                placeholder=""
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div className="w3-row w3-section">
            <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
              측정주기
            </div>
            <div className="w3-rest">
              <select
                className="form-control"
                name="period"
                value={this.state.postData.period}
                onChange={this.handleChange}
              >
                {/* <option value="" /> */}
                <option value="1">1분</option>
                <option value="5">5분</option>
                <option value="10">10분</option>
                <option value="60">60분</option>
              </select>
            </div>
          </div>
          <div className="w3-right">
            <button
              type="button"
              className="btn btn-primary"
              onClick={e => {
                this.props.setViewMode("list");
              }}
            >
              List
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={e => {
                this.add();
              }}
            >
              OK
            </button>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authUser: state.auth.authUser,
  selectedNode: state.tree.selectedNode,
  productList: state.product.list,
  viewMode: state.settings.viewMode
});

const mapDispatchToProps = {
  productAddRequest,
  setViewMode
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Add);
