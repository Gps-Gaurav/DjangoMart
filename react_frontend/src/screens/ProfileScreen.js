import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile } from '../actions/userActions';

const ProfileScreen = () => {
  const dispatch = useDispatch();

  const { loading, error, user } = useSelector((state) => state.userProfile || {});

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Profile</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : user ? (
        <div className="bg-white p-4 rounded-lg shadow">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      ) : (
        <p>No user data.</p>
      )}
    </div>
  );
};

export default ProfileScreen;
