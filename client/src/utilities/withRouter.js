import React from 'react';
import { useLocation, useParams } from 'react-router-dom';

const withRouter = (WrappedCompnent) => (props) => {
  const params = useParams();
  const location = useLocation();

  return <WrappedCompnent {...props} params={params} location={location} />;
};

export default withRouter;