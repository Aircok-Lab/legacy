import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Header from "components/Header/index";
import Sidebar from "containers/SideNav/index";
import Footer from "components/Footer";
import Monitoring from "./routes/Monitoring";
import MonitoringSelection from "./routes/MonitoringSelection";
import Device from "./routes/Device";
import Product from "./routes/Product";
import User from "./routes/User";
import System from "./routes/System";
import Profile from "./routes/Profile";
import {
  ABOVE_THE_HEADER,
  BELOW_THE_HEADER,
  COLLAPSED_DRAWER,
  FIXED_DRAWER,
  HORIZONTAL_NAVIGATION
} from "constants/ActionTypes";
import { isIOS, isMobile } from "react-device-detect";
import asyncComponent from "../util/asyncComponent";
import TopNav from "components/TopNav";

class App extends React.Component {
  render() {
    const {
      match,
      drawerType,
      navigationStyle,
      horizontalNavPosition
    } = this.props;
    const drawerStyle = drawerType.includes(FIXED_DRAWER)
      ? "fixed-drawer"
      : drawerType.includes(COLLAPSED_DRAWER)
      ? "collapsible-drawer"
      : "mini-drawer";

    //set default height and overflow for iOS mobile Safari 10+ support.
    if (isIOS && isMobile) {
      document.body.classList.add("ios-mobile-view-height");
    } else if (document.body.classList.contains("ios-mobile-view-height")) {
      document.body.classList.remove("ios-mobile-view-height");
    }
    return (
      <div className={`app-container ${drawerStyle}`}>
        <Sidebar />
        <div className="app-main-container">
          <div
            className={`app-header ${
              navigationStyle === HORIZONTAL_NAVIGATION
                ? "app-header-horizontal"
                : ""
            }`}
          >
            {navigationStyle === HORIZONTAL_NAVIGATION &&
              horizontalNavPosition === ABOVE_THE_HEADER && (
                <TopNav styleName="app-top-header" />
              )}
            <Header />
            {navigationStyle === HORIZONTAL_NAVIGATION &&
              horizontalNavPosition === BELOW_THE_HEADER && <TopNav />}
          </div>

          <main className="app-main-content-wrapper">
            <div className="app-main-content">
              <Switch>
                <Route
                  path={`${match.url}/monitoring`}
                  component={Monitoring}
                />
                <Route
                  path={`${match.url}/monitoringSelection`}
                  component={MonitoringSelection}
                />
                <Route path={`${match.url}/device`} component={Device} />
                <Route path={`${match.url}/product`} component={Product} />
                <Route path={`${match.url}/user`} component={User} />
                <Route path={`${match.url}/system`} component={System} />
                <Route path={`${match.url}/profile`} component={Profile} />
                <Route
                  component={asyncComponent(() =>
                    import("components/Error404")
                  )}
                />
              </Switch>
            </div>
            <Footer />
          </main>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ settings }) => {
  const { drawerType, navigationStyle, horizontalNavPosition } = settings;
  return { drawerType, navigationStyle, horizontalNavPosition };
};
export default withRouter(connect(mapStateToProps)(App));
