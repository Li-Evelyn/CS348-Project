import React, { useEffect } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';

function Navigate() {
    useEffect(() => {
        document.title = "GenericMark";
      }, []);
    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="/">GenericMark</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/login">Log In</Nav.Link>
                    <Nav.Link href="/register">Register</Nav.Link>
                    <Nav.Link href="/debug">Debug</Nav.Link>
                    <Nav.Link href="/dashboard">Dashboard</Nav.Link>
                </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Navigate;