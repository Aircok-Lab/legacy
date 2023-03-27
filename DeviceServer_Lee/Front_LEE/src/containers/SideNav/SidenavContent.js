import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink, withRouter } from "react-router-dom";
import IntlMessages from "util/IntlMessages";
import CustomScrollbars from "util/CustomScrollbars";
import { userSignOut } from "actions/Auth";

class SidenavContent extends Component {
  componentDidMount() {
    const { history } = this.props;
    const that = this;
    const pathname = `#${history.location.pathname}`; // get current path

    const subMenuLi = document.querySelectorAll(".sub-menu > li");
    for (let i = 0; i < subMenuLi.length; i++) {
      subMenuLi[i].onclick = function(event) {
        event.stopPropagation();
      };
    }

    const menuLi = document.getElementsByClassName("menu");
    for (let i = 0; i < menuLi.length; i++) {
      menuLi[i].onclick = function(event) {
        for (let j = 0; j < menuLi.length; j++) {
          const parentLi = that.closest(this, "li");
          if (
            menuLi[j] !== this &&
            (parentLi === null || !parentLi.classList.contains("open"))
          ) {
            menuLi[j].classList.remove("open");
          }
        }
        this.classList.toggle("open");
        event.stopPropagation();
      };
    }

    const activeLi = document.querySelector('a[href="' + pathname + '"]'); // select current a element
    try {
      const activeNav = this.closest(activeLi, "ul"); // select closest ul
      if (activeNav.classList.contains("sub-menu")) {
        this.closest(activeNav, "li").classList.add("open");
      } else {
        this.closest(activeLi, "li").classList.add("open");
      }
    } catch (error) {}
  }

  closest(el, selector) {
    try {
      let matchesFn;
      // find vendor prefix
      [
        "matches",
        "webkitMatchesSelector",
        "mozMatchesSelector",
        "msMatchesSelector",
        "oMatchesSelector"
      ].some(function(fn) {
        if (typeof document.body[fn] == "function") {
          matchesFn = fn;
          return true;
        }
        return false;
      });

      let parent;

      // traverse parents
      while (el) {
        parent = el.parentElement;
        if (parent && parent[matchesFn](selector)) {
          return parent;
        }
        el = parent;
      }
    } catch (error) {}

    return null;
  }

  handleLogout = e => {
    alert("logout");
    e.preventDefault();
    this.props.userSignOut();
  };

  render() {
    switch (this.props.authUser.userType) {
      case "master":
        return (
          <div>
            <ul className="nav-menu">
              <li className="nav-header" />
              <li className="nav-header">
                <IntlMessages id="sidebar.main" />
              </li>
              <li className="menu no-arrow">
                <NavLink to="/app/monitoring">
                  <i className="zmdi zmdi-view-dashboard zmdi-hc-fw" />
                  <span className="nav-text" style={{fontFamily:"Noto Sans KR"}}>대기질센서 결과 확인 </span>
                </NavLink>
                {/* <NavLink to="/app/batchRegister">
                  <i className="zmdi zmdi-hc-fw  zmdi-widgets" />
                  <span className="nav-text" style={{fontFamily:"Noto Sans KR"}}>일괄등록 </span>
                </NavLink> */}
                <NavLink to="/app/device">
                  <i className="zmdi zmdi-hc-fw  zmdi-view-web" />
                  <span className="nav-text" style={{fontFamily:"Noto Sans KR"}}>측정기 관리 </span>
                </NavLink>
                <NavLink to="/app/product">
                  <i className="zmdi zmdi-hc-fw zmdi-time-restore" />
                  <span className="nav-text" style={{fontFamily:"Noto Sans KR"}}>제품군 관리 </span>
                </NavLink>
                <NavLink to="/app/user">
                  <i className="zmdi zmdi-hc-fw  zmdi-account-box"/>
                  <span className="nav-text" style={{fontFamily:"Noto Sans KR"}}>사용자 관리 </span>
                </NavLink>
                <NavLink to="/app/system">
                  <i className="zmdi zmdi-hc-fw  zmdi-shopping-cart" />
                  <span className="nav-text" style={{fontFamily:"Noto Sans KR"}}>시스템 관리 </span>
                </NavLink>
                {/* <NavLink to="/app/sensor">
                  <i className="zmdi zmdi-hc-fw  zmdi-collection-bookmark zmdi-hc-rotate-90" />
                  <span className="nav-text" style={{fontFamily:"Noto Sans KR"}}>센서 관리 </span>
                </NavLink> */}
                <NavLink to="/app/profile">
                  <i className="zmdi zmdi-hc-fw  zmdi-key" />
                  <span className="nav-text" style={{fontFamily:"Noto Sans KR"}}>내 정보 관리 </span>
                </NavLink>
                <NavLink to="/app/TimeMonitoring">
                  <i className="zmdi zmdi-hc-fw zmdi-time" />
                  <span className="nav-text" style={{fontFamily:"Noto Sans KR"}}>실시간 디바이스 현황</span>
                </NavLink>
                <NavLink to="/app/DeviceYul">
                  <i className="zmdi zmdi-hc-fw  zmdi-swap-alt zmdi-hc-rotate-90" />
                  <span className="nav-text" style={{fontFamily:"Noto Sans KR"}}>디바이스 배율 변경</span>
                </NavLink>
                <NavLink to="/app/Setting">
                  <i className="zmdi zmdi-hc-fw  zmdi-device-hub" />
                  <span className="nav-text" style={{fontFamily:"Noto Sans KR"}}>기기 설정</span>
                </NavLink>
              
              </li>
            </ul>
          </div>
        );
        break;

      case "manager":
        return (
          <div>
            <ul className="nav-menu">
              <li className="nav-header" />
              <li className="nav-header">
                <IntlMessages id="sidebar.main" />
              </li>
              <li className="menu no-arrow">
                <NavLink to="/app/monitoring">
                  <i className="zmdi zmdi-view-dashboard zmdi-hc-fw" />
                  <span className="nav-text" style={{fontFamily:"Noto Sans KR"}}>대기질센서 결과 확인 </span>
                </NavLink>
                {/* <NavLink to="/app/device">
                  <i className="zmdi zmdi-hc-fw  zmdi-view-web" />
                  <span className="nav-text" style={{fontFamily:"Noto Sans KR"}}>측정기 관리 </span>
                </NavLink> */}
                {/* <NavLink to="/app/user">
                  <i className="zmdi zmdi-hc-fw  zmdi-account-box" />
                  <span className="nav-text" style={{fontFamily:"Noto Sans KR"}}>사용자 관리 </span>
                </NavLink> */}
                <NavLink to="/app/profile">
                  <i className="zmdi zmdi-hc-fw  zmdi-key" />
                  <span className="nav-text" style={{fontFamily:"Noto Sans KR"}}>내 정보 관리 </span>
                </NavLink>
                {/* <NavLink to="/app/Setting">
                  <i className="zmdi zmdi-hc-fw  zmdi-device-hub" />
                  <span className="nav-text" style={{fontFamily:"Noto Sans KR"}}>기기 설정</span>
                </NavLink> */}
              </li>
            </ul>
          </div>
        );
        break;

      case "user":
        return (
          <div>
            <ul className="nav-menu">
              <li className="nav-header" />
              <li className="nav-header">
                <IntlMessages id="sidebar.main" />
              </li>
              <li className="menu no-arrow">
                <NavLink to="/app/monitoring">
                  <i className="zmdi zmdi-view-dashboard zmdi-hc-fw" />
                  <span className="nav-text" style={{fontFamily:"Noto Sans KR"}}>대기질센서 결과 확인 </span>
                </NavLink>

                <NavLink to="/app/profile">
                  <i className="zmdi zmdi-hc-fw  zmdi-key" />
                  <span className="nav-text" style={{fontFamily:"Noto Sans KR"}}>내 정보 관리 </span>
                </NavLink>
                {/* <NavLink to="/app/Setting">
                  <i className="zmdi zmdi-hc-fw  zmdi-device-hub" />
                  <span className="nav-text" style={{fontFamily:"Noto Sans KR"}}>기기 설정</span>
                </NavLink> */}
              </li>
            </ul>
          </div>
        );
        break;

      case "monitoring":
        return (
          <div>
            <ul className="nav-menu">
              <li className="nav-header" />
              <li className="nav-header">
                <IntlMessages id="sidebar.main" />
              </li>
              <li className="menu no-arrow">
                <NavLink to="/app/monitoring">
                  <i className="zmdi zmdi-view-dashboard zmdi-hc-fw" />
                  <span className="nav-text" style={{fontFamily:"Noto Sans KR"}}>대기질센서 결과 확인 </span>
                </NavLink>
                <NavLink to="/app/monitoringSelection">
                  <i className="zmdi zmdi-hc-fw  zmdi-view-web" />
                  <span className="nav-text" style={{fontFamily:"Noto Sans KR"}}>모니터링 측정기 관리 </span>
                </NavLink>
                <NavLink to="/app/profile">
                  <i className="zmdi zmdi-hc-fw  zmdi-key" />
                  <span className="nav-text" style={{fontFamily:"Noto Sans KR"}}>내 정보 관리 </span>
                </NavLink>
                {/* <NavLink to="/app/Setting">
                  <i className="zmdi zmdi-hc-fw  zmdi-device-hub" />
                  <span className="nav-text" style={{fontFamily:"Noto Sans KR"}}>기기 설정</span>
                </NavLink> */}
              </li>
            </ul>
          </div>
        );
        break;

      default:
        break;
    }
    return (
      <div>
        <ul className="nav-menu">
          <li className="nav-header" />
          <li className="nav-header">
            <IntlMessages id="sidebar.main" />
          </li>
          <li className="menu no-arrow">
            <NavLink to="/app/monitoring">
              <i className="zmdi zmdi-view-dashboard zmdi-hc-fw" />
              <span className="nav-text" style={{fontFamily:"Noto Sans KR"}}>대기질센서 결과 확인 </span>
            </NavLink>
            {this.props.authUser.userType === "master"}
            <NavLink to="/app/batchRegister">
              <i className="zmdi zmdi-hc-fw  zmdi-widgets" />
              <span className="nav-text" style={{fontFamily:"Noto Sans KR"}}>일괄등록 </span>
            </NavLink>
            <NavLink to="/app/device">
              <i className="zmdi zmdi-hc-fw  zmdi-view-web" />
              <span className="nav-text" style={{fontFamily:"Noto Sans KR"}}>측정기 관리 </span>
            </NavLink>
            <NavLink to="/app/monitoringSelection">
              <i className="zmdi zmdi-hc-fw  zmdi-view-web" />
              <span className="nav-text" style={{fontFamily:"Noto Sans KR"}}>모니터링 측정기 관리 </span>
            </NavLink>
            <NavLink to="/app/product">
              <i className="zmdi zmdi-hc-fw zmdi-time-restore" />
              <span className="nav-text" style={{fontFamily:"Noto Sans KR"}}>제품군 관리 </span>
            </NavLink>
            <NavLink to="/app/user">
              <i className="zmdi zmdi-hc-fw  zmdi-account-box" />
              <span className="nav-text" style={{fontFamily:"Noto Sans KR"}}>사용자 관리 </span>
            </NavLink>
            <NavLink to="/app/system">
              <i className="zmdi zmdi-hc-fw  zmdi-shopping-cart" />
              <span className="nav-text" style={{fontFamily:"Noto Sans KR"}}>시스템 관리 </span>
            </NavLink>
            <NavLink to="/app/sensor">
              <i className="zmdi zmdi-hc-fw  zmdi-collection-bookmark zmdi-hc-rotate-90" />
              <span className="nav-text" style={{fontFamily:"Noto Sans KR"}}>센서 관리 </span>
            </NavLink>
            <NavLink to="/app/profile">
              <i className="zmdi zmdi-hc-fw  zmdi-key" />
              <span className="nav-text" style={{fontFamily:"Noto Sans KR"}}>내 정보 관리 </span>
            </NavLink>
            <NavLink to="/app/Setting">
                  <i className="zmdi zmdi-hc-fw  zmdi-device-hub" />
                  <span className="nav-text" style={{fontFamily:"Noto Sans KR"}}>기기 설정</span>
                </NavLink>
          </li>
        </ul>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authUser: state.auth.authUser
});

const mapDispatchToProps = {
  userSignOut
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SidenavContent)
);
