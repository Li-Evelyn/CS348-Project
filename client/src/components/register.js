import React, { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';

function RegisterPage() {
  const [dropVal, setDropVal] = useState("student");
  // TODO: add form authentication functionality
    let handleChange = (e) => {
      setDropVal(e.target.value);
    }
    return (
        <div className="App">
          <header className="App-header">
          </header>
          <div className="custom-container">
            <Card className="sign-in">
              <Card.Body>
                <Card.Title className="medium"><h2>Register</h2></Card.Title>
                <Card.Subtitle className="mb-2 dmsans">Already registered? <a href="/login">Log in.</a></Card.Subtitle>
                <Form>
                  <Form.Group className="left" controlId="name">
                    <Form.Label className="dmsans">NAME</Form.Label>
                    <Form.Control type="email" className="light" placeholder="Name" />
                  </Form.Group>
                  <Form.Group className="left" controlId="email">
                    <Form.Label className="dmsans">EMAIL</Form.Label>
                    <Form.Control type="email" className="light" placeholder="Email" />
                  </Form.Group>
                  <Form.Group className="left" controlId="password">
                    <Form.Label className="dmsans">PASSWORD</Form.Label>
                    <Form.Control type="password" className="light" placeholder="Password" />
                  </Form.Group>
                  <Form.Group className="left" controlId="type">
                    <Form.Label className="dmsans">I AM</Form.Label>
                    <br></br>
                    <select className="dmsans light left dropdown" style={{width: '100%', 'border-radius': '0.375em', 'border-color': 'rgba(0, 0, 0, 0.175)', height: '2.5em', 'text-indent': '0.5em'}} value={`${dropVal}`} onChange={handleChange}>
                      <option value="student">A Student</option>
                      <option value="faculty">A Member of Faculty</option>
                      <option value="admin">An Administrator</option>
                    </select>
                  </Form.Group>
                  <br></br>
                  <Button type="submit" variant="dark" className="bold sign-in-button">sign up</Button>
                </Form>
              </Card.Body>
            </Card>
          </div>
        </div>
      );
}

export default RegisterPage;