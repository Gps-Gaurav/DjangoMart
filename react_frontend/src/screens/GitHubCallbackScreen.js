import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useDispatch } from 'react-redux';
import { githubAuth } from '../actions/authActions';

function GitHubCallbackScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    if (!code) {
      setError('Missing GitHub code.');
      return;
    }

    setLoading(true);
    dispatch(githubAuth(code))
      .unwrap()
      .then(() => {
        navigate('/');
      })
      .catch((err) => {
        setError(err || 'GitHub login failed.');
        setLoading(false);
      });
  }, [dispatch, navigate]);

  return (
    <div className="mt-5 text-center">
      {loading ? <Loader /> : error && <Message variant="danger">{error}</Message>}
    </div>
  );
}

export default GitHubCallbackScreen;
