import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

function Dashboard() {
    const [authenticated, setAuthenticated] = useState(null);
    
    useEffect(() => { // something in here is broken
        setAuthenticated(localStorage.getItem("authenticated"));
    }, []);
    if (!authenticated) {
        navigate("/login");
    } else {
        return (
            <div className="App">
              <p>You are logged in!</p>
            </div>
        );
    }
}

export default Dashboard;