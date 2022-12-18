import React from "react";
import { Sidebar, Nav, Icon } from "rsuite";
import { connect } from 'react-redux';
import * as CommonAction from "../../actions/commonAction";

class MobileLayout extends React.Component {
  componentDidMount() {
    const { setDesktopMode, resetOpen } = this.props;
    resetOpen();
    setDesktopMode(false);
  }

  render() {
    const { children, isSideMenuOpen, toggleSidebarOpen } = this.props;
    return (
      <React.Fragment>
        <div className="rv-sidebar">
          <Sidebar
            style={{
              display: "flex",
              flexDirection: "column",
              transition: "width 1s",
              overflowX: "hidden",
            }}
            width={isSideMenuOpen ? 258 : 0}
            collapsible
          >
            {children}
            <Nav pullRight className="sidebar-toggle-btn-wrap">
              <Nav.Item
                onClick={toggleSidebarOpen}
                style={{ width: 56, textAlign: "center" }}
              >
                <Icon icon={"angle-left"} />
              </Nav.Item>
            </Nav>
          </Sidebar>
        </div>
      </React.Fragment>
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
  },
  resetOpen: () => {
    dispatch(CommonAction.setSidebarOpen(false))
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(MobileLayout);
