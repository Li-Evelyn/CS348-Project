import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './sidebar';
import CourseList from './courses'

function StudentDashboard(props) {
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
                <Sidebar courses={courses} getLink={getCourseLink}/>
                {/* change to dynamically rendered component? can also insert course/assignment page here */}
                <CourseList courses={courses} setRemove={setRemove} getLink={getCourseLink}/>
            </div>
        );
    }
}

export default StudentDashboard;