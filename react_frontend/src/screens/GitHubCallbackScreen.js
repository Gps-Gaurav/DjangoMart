import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { githubAuth } from '../actions/authActions';

const GitHubCallbackScreen = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const code = params.get('code');

        if (code) {
            dispatch(githubAuth(code))
                .unwrap()
                .then(() => navigate('/'))
                .catch((err) => console.error('GitHub Auth failed', err));
        }
    }, [location, dispatch, navigate]);

    return <p>Authenticating with GitHub...</p>;
};

export default GitHubCallbackScreen;
