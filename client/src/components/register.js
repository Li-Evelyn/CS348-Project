import React, { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dropVal, setDropVal] = useState("student");
  // TODO: add form authentication functionality
  let handleChange = (e) => {
    setDropVal(e.target.value);
  }

  const registerUser = e => {
    e.preventDefault();
    const data = {
      'email': email,
      'password': password, //this is not ok, gotta hash at some point
      'displayname': name,
      'type': dropVal
    }
    fetch("http://localhost:8080/register", {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      mode: 'cors',
      body: JSON.stringify(data)
    })
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
            <Form onSubmit={registerUser}>
              <Form.Group className="left" controlId="name">
                <Form.Label className="dmsans">NAME</Form.Label>
                <Form.Control type="text" className="light" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}/>
              </Form.Group>
              <Form.Group className="left" controlId="email">
                <Form.Label className="dmsans">EMAIL</Form.Label>
                <Form.Control type="email" className="light" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
              </Form.Group>
              <Form.Group className="left" controlId="password">
                <Form.Label className="dmsans">PASSWORD</Form.Label>
                <Form.Control type="password" className="light" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
              </Form.Group>
              <Form.Group className="left" controlId="type">
                <Form.Label className="dmsans">I AM</Form.Label>
                <br></br>
                <select className="dmsans light left dropdown" style={{width: '100%', 'borderRadius': '0.375em', 'borderColor': 'rgba(0, 0, 0, 0.175)', height: '2.5em', 'textIndent': '0.5em'}} value={`${dropVal}`} onChange={handleChange}>
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