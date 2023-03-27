import React, { Component } from "react";
import { connect } from "react-redux";
import { productUpdateRequest } from "actions/Product";
import { setViewMode } from "actions/Setting";

class Update extends Component {
  state = {
    postData: {
      id: this.props.selectedItem.id,
      name: this.props.selectedItem.name,
      version: this.props.selectedItem.version,
      file: null,
      firmware: this.props.selectedItem.firmware,
      filesize: this.props.selectedItem.filesize,
      period: this.props.selectedItem.period,
      indoor: this.props.selectedItem.indoor,
      pm25: "" + this.props.selectedItem.pm25,
      pm10: "" + this.props.selectedItem.pm10,
      co2: "" + this.props.selectedItem.co2,
      co: "" + this.props.selectedItem.co,
      hcho: "" + this.props.selectedItem.hcho,
      voc: "" + this.props.selectedItem.voc,
      temperature: "" + this.props.selectedItem.temperature,
      humidity: "" + this.props.selectedItem.humidity,
      noise: "" + this.props.selectedItem.noise
    }
  };
  update = () => {
    if (!this.state.postData.name) {
      alert("제품군명을 입력하세요");
    } else if (!this.state.postData.version) {
      alert("펌웨어버전을 입력하세요");
    } else {
      this.props.productUpdateRequest(this.state.postData);
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
    this.setState({
      postData: {
        ...this.state.postData,
        [name]: value
      }
    });
  };

  render() {
    return (
      <div className="col-6 mx-auto">
        <form className="text-blue w3-margin">
          <h2 className="text-center" style={{color:"white",fontFamily:"Noto Sans KR"}}>제품군 수정</h2>
          <div className="w3-row w3-section">
            <div className="w3-col w3-padding-right" style={{ width: "80px",color:"white",fontFamily:"Noto Sans KR" }}>
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
            <div className="w3-col w3-padding-right" style={{ width: "80px",color:"white",fontFamily:"Noto Sans KR" }}>
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
            <div className="w3-col w3-padding-right" style={{ width: "80px",color:"white",fontFamily:"Noto Sans KR" }}>
              측정항목
            </div>
            <div className="w3-rest text-black">
              <table className="table table-bordered table-sm">
                <thead>
                  <tr>
                    <th />
                    <th style={{width: "100%",color:"white",fontFamily:"Noto Sans KR",borderBottom:"1px solid white"}}>측정항목 설정</th>
                  </tr>
                </thead>
                <tbody style={{width:"100%"}}>
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
                    <td style={{width: "100%",color:"white",fontFamily:"Noto Sans KR"}}>PM10</td>
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
                    <td  style={{ width: "80px",color:"white",fontFamily:"Noto Sans KR",color:"white",fontFamily:"Noto Sans KR" }}>PM25</td>
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
                    <td style={{ width: "80px",color:"white",fontFamily:"Noto Sans KR",color:"white",fontFamily:"Noto Sans KR" }}>CO2</td>
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
                    <td style={{ width: "80px",color:"white",fontFamily:"Noto Sans KR",color:"white",fontFamily:"Noto Sans KR" }}>CO</td>
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
                    <td style={{ width: "80px",color:"white",fontFamily:"Noto Sans KR",color:"white",fontFamily:"Noto Sans KR" }}>HCHO</td>
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
                    <td style={{ width: "80px",color:"white",fontFamily:"Noto Sans KR",color:"white",fontFamily:"Noto Sans KR" }}>VOC</td>
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
                    <td style={{ width: "80px",color:"white",fontFamily:"Noto Sans KR",color:"white",fontFamily:"Noto Sans KR" }}>Temperature</td>
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
                    <td style={{ width: "80px",color:"white",fontFamily:"Noto Sans KR",color:"white",fontFamily:"Noto Sans KR" }}>humidity</td>
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
                    <td style={{ width: "80px",color:"white",fontFamily:"Noto Sans KR",color:"white",fontFamily:"Noto Sans KR" }}>Noise</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="w3-row w3-section">
            <div className="w3-col w3-padding-right" style={{ width: "80px",color:"white",fontFamily:"Noto Sans KR" }}>
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
            <div className="w3-col w3-padding-right" style={{ width: "80px",color:"white",fontFamily:"Noto Sans KR" }}>
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
            <div className="w3-col w3-padding-right" style={{ width: "80px",color:"white",fontFamily:"Noto Sans KR" }}>
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
                this.update();
              }}
            >
              OK
            </button>
          </div>
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          <div>&nbsp;</div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  selectedItem: state.settings.selectedItem
});

const mapDispatchToProps = {
  productUpdateRequest,
  setViewMode
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Update);
