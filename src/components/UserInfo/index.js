import React from "react";
import Avatar from "@material-ui/core/Avatar";
import { connect } from "react-redux";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IntlMessages from "util/IntlMessages";
import { userSignOut } from "actions/Auth";
import { NavLink, withRouter } from "react-router-dom";

class UserInfo extends React.Component {
  state = {
    anchorEl: null,
    open: false
  };

  handleClick = event => {
    this.setState({ open: true, anchorEl: event.currentTarget });
  };

  handleLogout = () => {
    this.props.userSignOut();
    this.setState({ open: false });
  };

  handleRequestClose = () => {
    this.setState({ open: false });
  };

  render() {
    return (
      <div className="user-profile d-flex flex-row align-items-center">
        <Avatar
          alt="..."
          src="http://via.placeholder.com/150x150"
          className="user-avatar "
        />
        <div className="user-detail">
          <h4 className="user-name" onClick={this.handleClick}>
            {this.props.authUser.LoginID}{" "}
            <i className="zmdi zmdi-caret-down zmdi-hc-fw align-middle" />
          </h4>
        </div>
        <Menu
          className="user-info"
          id="simple-menu"
          anchorEl={this.state.anchorEl}
          open={this.state.open}
          onClose={this.handleRequestClose}
          PaperProps={{
            style: {
              width: 120,
              paddingTop: 0,
              paddingBottom: 0
            }
          }}
        >
          <MenuItem onClick={this.handleRequestClose}>
            <i className="zmdi zmdi-account zmdi-hc-fw mr-2" />
            {/* <IntlMessages id="popup.profile" /> */}

            <NavLink to="/app/profile">
              {/* <i className="zmdi zmdi-view-dashboard zmdi-hc-fw" /> */}
              <span className="nav-text">Profile </span>
            </NavLink>
          </MenuItem>
          <MenuItem onClick={this.handleLogout}>
            <i className="zmdi zmdi-sign-in zmdi-hc-fw mr-2" />
            <IntlMessages id="popup.logout" />
          </MenuItem>
        </Menu>
      </div>
    );
  }
}

const mapStateToProps = ({ settings, auth }) => {
  const { locale } = settings;
  const { authUser } = auth;
  return { locale, authUser };
};
export default connect(
  mapStateToProps,
  { userSignOut }
)(UserInfo);
