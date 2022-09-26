import React from 'react';
import { Outlet, Link } from "react-router-dom";

function Layout() {
    return (
        <>
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/login">Log In</Link></li>
                </ul>
            </nav>
            <Outlet />
        </>
    )
}

export default Layout;