import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile, getUserDetails } from '../actions/userActions';
import Message from '../components/Message';
import Loader from '../components/Loader';
import moment from 'moment';

const ProfileScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(null);

  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo) {
      window.location.href = '/login';
    } else {
      if (!user || !user.firstName) {
        dispatch(getUserDetails('profile'));
      } else {
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setEmail(user.email);
        setPreviewAvatar(user.avatar);
      }
    }
  }, [dispatch, userInfo, user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    if (password) {
      formData.append('password', password);
    }
    if (avatar) {
      formData.append('avatar', avatar);
    }

    try {
      await dispatch(updateUserProfile(formData));
      setSuccessMessage('Profile updated successfully');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Update failed');
    }
  };

  const profileCardStyle = {
    backgroundColor: '#2a2a2a',
    color: '#fff',
    borderRadius: '10px',
    padding: '2rem',
    marginTop: '2rem',
  };

  const avatarStyle = {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid #007bff',
    marginBottom: '1rem',
  };

  return (
    <Row className="justify-content-md-center">
      <Col md={8}>
        <Card style={profileCardStyle}>
          <Card.Body>
            <div className="text-center mb-4">
              <img
                src={previewAvatar || '/default-avatar.png'}
                alt="Profile"
                style={avatarStyle}
              />
              <h2 className="mt-2">My Profile</h2>
              <p className="text-muted">
                Last updated: {moment(user?.updatedAt).format('MMMM DD, YYYY')}
              </p>
            </div>

            {message && <Message variant="danger">{message}</Message>}
            {error && <Message variant="danger">{error}</Message>}
            {successMessage && <Message variant="success">{successMessage}</Message>}
            {loading && <Loader />}

            <Form onSubmit={submitHandler}>
              <Row>
                <Col md={6}>
                  <Form.Group controlId="firstName" className="mb-3">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter first name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="bg-dark text-light"
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="lastName" className="mb-3">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="bg-dark text-light"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group controlId="email" className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  disabled
                  className="bg-dark text-light"
                />
                <Form.Text className="text-muted">
                  Email cannot be changed
                </Form.Text>
              </Form.Group>

              <Form.Group controlId="avatar" className="mb-3">
                <Form.Label>Profile Picture</Form.Label>
                <Form.Control
                  type="file"
                  onChange={handleAvatarChange}
                  accept="image/*"
                  className="bg-dark text-light"
                />
                <Form.Text className="text-muted">
                  Maximum file size: 5MB. Supported formats: JPG, PNG
                </Form.Text>
              </Form.Group>

              <hr className="my-4" />

              <h4 className="mb-3">Change Password</h4>
              <Row>
                <Col md={6}>
                  <Form.Group controlId="password" className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-dark text-light"
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="confirmPassword" className="mb-3">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-dark text-light"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-grid gap-2">
                <Button type="submit" variant="primary" size="lg">
                  Update Profile
                </Button>
              </div>
            </Form>

            <div className="mt-4">
              <h4>Account Information</h4>
              <hr />
              <Row>
                <Col md={6}>
                  <p>
                    <strong>Member Since:</strong>{' '}
                    {moment(user?.createdAt).format('MMMM DD, YYYY')}
                  </p>
                  <p>
                    <strong>Account Status:</strong>{' '}
                    <span className={`text-${user?.isActive ? 'success' : 'warning'}`}>
                      {user?.isActive ? 'Active' : 'Pending Verification'}
                    </span>
                  </p>
                </Col>
                <Col md={6}>
                  <p>
                    <strong>Username:</strong> {user?.username}
                  </p>
                  <p>
                    <strong>Last Login:</strong>{' '}
                    {user?.lastLogin
                      ? moment(user.lastLogin).format('MMMM DD, YYYY, HH:mm')
                      : 'Never'}
                  </p>
                </Col>
              </Row>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default ProfileScreen;