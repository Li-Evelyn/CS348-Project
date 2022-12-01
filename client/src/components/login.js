import React, { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import shajs from 'sha.js';

const navigateTo = {
	student: '/student/courses',
	staff: '/staff/courses',
	admin: '/debug'
}

function LoginPage(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [authenticated, setAuthenticated] = useState(false);

  let navigate = useNavigate();

  let handleSubmit = e => {
    e.preventDefault();
    fetch(`http://localhost:8080/login?email=${email}&pw=${shajs('sha256').update(password).digest('hex')}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.rows.length > 0) {
          // setAuthenticated(true);
          localStorage.setItem("authenticated", true)
          localStorage.setItem("user_id", data.rows["0"].id)
          localStorage.setItem("user_type", data.rows["0"].type)
          navigate(`${navigateTo[data.rows["0"].type]}`);
        }
      })
  }
  // TODO: add form authentication functionality
    return (
        <div className="App">
          <header className="App-header">
          </header>
          <div className="custom-container">
            <Card className="sign-in">
              <Card.Body>
                <Card.Title className="medium"><h2>Login</h2></Card.Title>
                <Card.Subtitle className="mb-2 dmsans">Don't have an account? <a href="/register">Register here.</a></Card.Subtitle>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="left" controlId="email">
                    <Form.Label className="dmsans">EMAIL</Form.Label>
                    <Form.Control type="email" className="light" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                  </Form.Group>
                  <Form.Group className="left" controlId="password">
                    <Form.Label className="dmsans">PASSWORD</Form.Label>
                    <Form.Control type="password" className="light" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}/>
                  </Form.Group>
                  <br></br>
                  <Button type="submit" variant="dark" className="bold sign-in-button">login</Button>
                </Form>
              </Card.Body>
            </Card>
          </div>
        </div>
      );
}

export default LoginPage;