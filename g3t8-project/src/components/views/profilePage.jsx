import React, { useState } from 'react';
import { Navigation } from "../navigation";
import { Footer } from "../footer";
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

export const ProfilePage = () => {
  const [userData, setUserData] = useState({
    username: 'JohnDoe',
    password: '********',
    money: 1000 
  });

  const [newUsername, setNewUsername] = useState(userData.username);
  const [newPassword, setNewPassword] = useState(userData.password);
  const [amount, setAmount] = useState('');
  const [editMode, setEditMode] = useState(false);

  const handleTopUp = () => {
    const newMoney = userData.money + parseFloat(amount);
    setUserData({ ...userData, money: newMoney });
    setAmount('');
  };

  const handleWithdraw = () => {
    const newMoney = userData.money - parseFloat(amount);
    if (newMoney >= 0) {
      setUserData({ ...userData, money: newMoney });
    } else {
      alert('Insufficient funds!');
    }
    setAmount('');
  };

  const handleEdit = () => {
    if (editMode) {
      setUserData({
        ...userData,
        username: newUsername || userData.username,
        password: newPassword || userData.password
      });
      setEditMode(false);
    } else {
      setEditMode(true);
      setNewUsername(userData.username);
      setNewPassword(userData.password);
    }
  };

  return (
    <>
      <Navigation/>
      <Container className="mb-5">
        <h2 className="mt-5">Profile Details</h2>
        <Row className="mt-3">
          <Col>
          <h3>Your Account</h3>
            <Form.Group>
              <Form.Label>Username:</Form.Label>
              <Form.Control
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                disabled={!editMode}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={!editMode}
              />
            </Form.Group>
            <Button variant="primary" size="sm" className="mt-4" onClick={handleEdit}>
              {editMode ? 'Save' : 'Edit Username/Password'}
            </Button>
          </Col>
          <Col>
            <h3>Current Balance: ${userData.money}</h3>
            <p style={{ fontStyle: "italic" }}>Input amount before selecting top up / withdraw</p>
            <Form.Group>
              <Form.Label>Amount:</Form.Label>
              <Form.Control
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" size="sm" className="mx-2 mt-4" onClick={handleTopUp}>
              Top Up
            </Button>
            <Button variant="primary" size="sm" className="mx-2 mt-4" onClick={handleWithdraw}>
              Withdraw
            </Button>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};