import React, { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
                <Form>
                  <Form.Group className="left" controlId="email">
                    <Form.Label className="dmsans">EMAIL</Form.Label>
                    <Form.Control type="email" className="light" placeholder="Email" />
                  </Form.Group>
                  <Form.Group className="left" controlId="password">
                    <Form.Label className="dmsans">PASSWORD</Form.Label>
                    <Form.Control type="password" className="light" placeholder="Password" />
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