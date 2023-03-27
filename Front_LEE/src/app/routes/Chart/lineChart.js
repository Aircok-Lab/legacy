import React from "react";
import { Line } from "react-chartjs-2";

class LineChart extends React.Component {
  render() {
    return (
      // ,height:"272px"
      <div className="card" style={{ borderRadius: "10px" }}>
        <h2 onClick={this.props.modalShow}>{this.props.title}</h2>
        {this.props.lineData.labels.length ? (
          <Line data={this.props.lineData} />
        ) : null}
      </div>
    );
  }
}

export default LineChart;
