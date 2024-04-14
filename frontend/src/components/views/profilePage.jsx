import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigation } from "../navigation";
import { Footer } from "../footer";
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

export const ProfilePage = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: '********',
    money: 1000 
  });

  const [newUsername, setNewUsername] = useState(userData.username || '');
  const [newEmail, setNewEmail] = useState(userData.email || '');
  const [newPassword, setNewPassword] = useState(userData.password || '');
  const [amount, setAmount] = useState('');
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      axios.get(`http://localhost:4567/get_user_by_id/${userId}`)
        .then(response => {
          console.log(response.data);
          setUserData({username: response.data.name, 
            email: response.data.email,
            password: response.data.password
          });
          setNewEmail(response.data.email);
          setNewUsername(response.data.name);
          setNewPassword(response.data.password);

          // Function to retrieve amount available based on user ID
          axios.get(`http://localhost:4567/get_amount_avail_by_user_id/${userId}`)
          .then(response => {
            console.log(response.data)
            setUserData(prevState => ({
              ...prevState,
              money: response.data
            }));
          })
          .catch(error => {
            console.error('Error retrieving amount avail:', error);
          });

        })
        .catch(error => {
          console.error('Error retrieving user data:', error);
        });
    
    }
  }, []);

  const handleTopUp = () => {
    const newMoney = parseFloat(userData.money) + parseFloat(amount);
    setUserData(prevUserData => ({ ...prevUserData, money: newMoney }));
    setAmount('');
  
    const userId = localStorage.getItem("userId");
    if (userId) {
      axios.put(`http://localhost:4567/update_amount_avail/${userId}/${newMoney}`)
        .then(response => {
          console.log('Amount topped up successfully');
        })
        .catch(error => {
          console.error('Error topping up amount:', error);
        });
    }
  };
  
  const handleWithdraw = () => {
    const newMoney = parseFloat(userData.money) - parseFloat(amount);
    if (newMoney >= 0) {
      setUserData(prevUserData => ({ ...prevUserData, money: newMoney }));
  
      const userId = localStorage.getItem("userId");
      if (userId) {
        axios.put(`http://localhost:4567/update_amount_avail/${userId}/${newMoney}`)
          .then(response => {
            console.log('Amount withdrawn successfully');
          })
          .catch(error => {
            console.error('Error withdrawing amount:', error);
          });
      }
    } else {
      alert('Insufficient funds!');
    }
    setAmount('');
  };

  const handleEdit = () => {
    if (editMode) {
      const userId = localStorage.getItem("userId");
      console.log(userId);
      console.log(newUsername);
      console.log(newPassword);
      console.log(newEmail);
      axios.put(`http://localhost:4567/update_user_details/${userId}?newName=${newUsername}&newPassword=${newPassword}&newEmail=${newEmail}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        console.log(response.data);
        if (response.data) {
          console.log('User details updated successfully');
        }
        else {
          console.log('Failed updating user details');
        }
        setUserData({
          ...userData,
          username: newUsername || userData.username,
          email: newEmail || userData.email,
          password: newPassword || userData.password
        });
        setEditMode(false);
      })
      .catch(error => {
        console.error('Error updating user details:', error);
      });
    } else {
      setEditMode(true);
      setNewUsername(userData.username);
      setNewPassword(userData.password);
      setNewEmail(userData.email);
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
              <Form.Label>Email:</Form.Label>
              <Form.Control
                type="text"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
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