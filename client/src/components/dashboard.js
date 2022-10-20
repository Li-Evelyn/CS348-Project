import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'react-bootstrap';

function Dashboard() {
    const [authenticated, setAuthenticated] = useState(null);
    const [courses, setCourses] = useState([])

    let navigate = useNavigate();

    let getCourses = function() {
        const uid = localStorage.getItem("user_id");
        fetch (`http://localhost:8080/courses?uid=${uid}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data.rows)
                setCourses(data.rows)
            })
    }

    useEffect(() => {
        const isAuthed = localStorage.getItem("authenticated")
        console.log(isAuthed)
        if (isAuthed) {
            setAuthenticated(true);
            getCourses();
        } else {
            navigate("/login");
        }
    }, []);
    if (!authenticated) {
        navigate("/login");
    } else {
        return (
            <div className="course-page">
                <h2>Courses</h2>
                {
                    courses.length == 0
                    ? <h2>No courses to display.</h2>
                    : (
                        <div className="course-container">
                            {courses.map((item) => {
                                return (
                                    <Card>
                                        <Card.Body>{item.name}</Card.Body>
                                    </Card>
                                )
                            })}
                        </div>
                    )
                }  
            </div>
        );
    }
}

export default Dashboard;