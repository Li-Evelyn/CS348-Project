import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Dropdown } from 'react-bootstrap';

function StudentDashboard() {
    const [authenticated, setAuthenticated] = useState(null);
    const [user, setUser] = useState(null)
    const [courses, setCourses] = useState([])
    const [remove, setRemove] = useState(null)

    let navigate = useNavigate();

    let getCourses = function(uid) {
        fetch (`http://localhost:8080/courses?uid=${uid}`)
            .then((response) => response.json())
            .then((data) => {
                // console.log(data.rows)
                setCourses(data.rows)
            })
    }

    let unEnroll = function() {
        if (remove != null) {
            fetch (`http://localhost:8080/unenroll?uid=${user}&course=${remove}`)
            setRemove(null);
            getCourses(user);
        }
    }

    let getCourseLink = (courseName) => `/student/courses/${courseName.replace(' ', '-').toLowerCase()}`;

    useEffect(() => {
        const isAuthed = localStorage.getItem("authenticated")
        // console.log(isAuthed)
        if (isAuthed) {
            setAuthenticated(true);
            const uid = localStorage.getItem("user_id");
            setUser(uid);
            getCourses(uid);
        } else {
            navigate("/login");
        }
    }, []);

    useEffect(() => {
        unEnroll();
    }, [remove])

    if (!authenticated) {
        navigate("/login");
    } else {
        return (
            <div className="dashboard">
                <div className="sidebar">
                    <h3 className="medium sidebar-item">Courses</h3>
                    <div>
                        {courses.map((item, i) => 
                            <p 
                                key={i} 
                                className="medium sidebar-item link clickable" 
                                onClick={() => navigate(`${getCourseLink(item.name)}`)}>
                                    {item.name}
                            </p>
                        )}
                    </div>
                </div>
                <div className="course-page">
                    <h2 className="medium">Courses</h2>
                    {
                        courses.length == 0
                        ? <h2>No courses to display.</h2>
                        : (
                            <div className="course-container">
                                {courses.map((item, i) => {
                                    return (
                                        <Card className="course-card" key={item.id}>
                                            <Card.Body className="course-body clickable" onClick={() => navigate(`${getCourseLink(item.name)}`)}>{item.name}</Card.Body>
                                            <Dropdown className="course-dropdown" align="end">
                                                <Dropdown.Toggle variant="light" className="course-button">
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    <Dropdown.Item onClick={() => setRemove(item.id)}>Drop course</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </Card>
                                    )
                                })}
                            </div>
                        )
                    }  
                </div>
            </div>
        );
    }
}

export default StudentDashboard;