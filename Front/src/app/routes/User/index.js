import React from "react";
import { connect } from "react-redux";
import BuildingPositionTree from "components/Tree/BuildingPositionTree";
import Container from "components/User/Container";
class UserPage extends React.Component {
  render() {
    return (
      <div className="container-fluid h-100 d-flex flex-fill flex-column">
        <div className="row flex-shrink-0 w3-white shadow-sm">
          <h2 className="pt-2 pl-2">사용자 관리</h2>
        </div>
        <div className="row flex-fill d-flex">
          <div className="col-3 h-100 d-flex flex-column shadow-sm">
            <BuildingPositionTree
              hideButton={false}
              hidePosition={false}
              checkable={this.props.viewMode === "list" ? false : true}
              selectable={false}
              isUserMenu={true}
            />
          </div>
          <div className="col-9 h-100 d-flex flex-column shadow-sm">
            <Container />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  viewMode: state.settings.viewMode
});

const mapDispatchToProps = {
  // setViewMode
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserPage);
