import React, { useEffect, useState } from 'react';
import { Container, Nav, Navbar, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


function Navigate() {
    const [displayName, setDisplayName] = useState("")
    const [authenticated, setAuthenticated] = useState(false);

    let navigate = useNavigate();

    let logOut = function() {
        localStorage.clear();
        setAuthenticated(false);
        navigate("/")
    }

    let getDisplayName = function() {
        const isAuthed = localStorage.getItem("authenticated")
        if (isAuthed) {
            setAuthenticated(true);
            const uid = localStorage.getItem("user_id")
            fetch (`http://localhost:8080/user?id=${uid}`)
                .then((response) => response.json())
                .then ((data) => {
                    setDisplayName(data.rows["0"].name)
                })
        }
    }
    useEffect(() => {
        document.title = "GenericMark";
        getDisplayName();
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
                        <Nav.Link href={`/${localStorage.getItem("user_type")}/courses`}>Dashboard</Nav.Link>
                    </Nav>
                    {
                        authenticated ? 
                        <Navbar.Text>
                            <Dropdown className="user-dropdown">
                                <Dropdown.Toggle variant="light">
                                    {displayName + "   "}
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={logOut}>Log Out</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Navbar.Text>
                        
                        :
                        <></>
                    }
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Navigate;