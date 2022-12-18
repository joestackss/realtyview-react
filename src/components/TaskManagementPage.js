/* Copyright (C) RealtyView, Inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Kevin de Guzman <kevin@realtyview.com>
 */

import React from "react";
import MainLayout from "../components/layouts/main";
import TaskManagement from "./../modules/TaskManagement/index";
import "../styles/TaskManagement.scss";

class TaskManagementPage extends React.Component {
  render() {
    return (
      <MainLayout layoutClassName="task-management-page">
        <TaskManagement />
      </MainLayout>
    );
  }
}

export default TaskManagementPage;
