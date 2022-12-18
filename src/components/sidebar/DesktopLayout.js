import React from "react";
import { Sidebar, Nav, Icon } from "rsuite";
import { connect } from 'react-redux';
import * as CommonAction from "../../actions/commonAction";

class DesktopLayout extends React.Component {
  componentDidMount() {
    const { setDesktopMode } = this.props;
    setDesktopMode(true);
  }

  render() {
    const { children, isSideMenuOpen, toggleSidebarOpen } = this.props;
    return (
      <div className="rv-sidebar">
        <Sidebar
          style={{
            display: "flex",
            flexDirection: "column",
            transition: "width 1s",
            overflowX: "hidden",
          }}
          width={isSideMenuOpen ? 258 : 60}
          collapsible
        >
          {children}
          <Nav pullRight className="sidebar-toggle-btn-wrap">
            <Nav.Item
              onClick={toggleSidebarOpen}
              style={{ width: 56, textAlign: "center" }}
            >
              <Icon icon={isSideMenuOpen ? "angle-left" : "angle-right"} />
            </Nav.Item>
          </Nav>
        </Sidebar>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isSideMenuOpen: state.common.isSideMenuOpen,
  isDesktop: state.common.isDesktop
});

const mapDispatchToProps = (dispatch) => ({
  toggleSidebarOpen: () => {
    dispatch(CommonAction.toggleSidebarOpen())
  },
  setDesktopMode: (isDesktop) => {
    dispatch(CommonAction.setDesktopMode(isDesktop))
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(DesktopLayout);
