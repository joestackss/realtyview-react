/* Copyright (C) RealtyView, Inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Joshua Santiago <jsantiago@realtyview.com>
 */

import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import empty from 'is-empty';


const ProtectedRoute = ({ user, component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={
        (props) => {
          if (!empty(user)) {
            return <Component {...props} />
          } else {
            return <Redirect to={
              {
                pathname: "/sign-in",
                state: {
                  from: props.location
                }
              }
            } />
          }
        }
      }
    />
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(ProtectedRoute);
