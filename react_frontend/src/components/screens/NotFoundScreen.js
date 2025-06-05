import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundScreen = () => {
  return (
    <div className="container text-center my-5">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for doesn't exist.</p>
      <Link to="/" className="btn btn-primary">
        Go Back to Home
      </Link>
    </div>
  );
};

export default NotFoundScreen;