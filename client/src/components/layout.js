import React from 'react';
import { Outlet } from "react-router-dom";
// import Container from 'react-bootstrap/Container';
import Navigate from './navigation';

function Layout() {
    return (
        <>
            <Navigate />
            <Outlet />
        </>
    )
}

export default Layout;