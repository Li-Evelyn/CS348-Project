import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './sidebar';
import CourseList from './course_list'
import AssignmentList from './assignment_list'
import AssignmentView from './assignment_view';

function StudentDashboard(props) {
    const [authenticated, setAuthenticated] = useState(null);
    const [user, setUser] = useState(null)
    const [courses, setCourses] = useState([])
    const [remove, setRemove] = useState(null)
    const [activeCourse, setActiveCourse] = useState(null)
    const [activeAssignment, setActiveAssignment] = useState(null)

    let conditionalRender = () => {
        switch(props.view) {
            case 'c':
                return <CourseList courses={courses} getLink={getCourseLink} setRemove={setRemove} handleCourseSelect={handleCourseSelect} setActiveCourse={setActiveCourse}/>;
            case 'a':
                return <AssignmentList course={activeCourse} handleAssignmentSelect={handleAssignmentSelect}/>
            case 'q':
                return <AssignmentView assignment={activeAssignment}></AssignmentView>
            default:
                return <></>
        }
    }

    useEffect(() => {
        console.log(activeCourse)
    }, [activeCourse])

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

    let handleCourseSelect = (c) => {
        setActiveCourse(c)
        localStorage.setItem("course_name", c.name)
        localStorage.setItem("course_id", c.id)
        navigate(`${getCourseLink(c.name)}`)
    }

    let handleAssignmentSelect = (a) => {
        setActiveAssignment(a);
        localStorage.setItem("assignment_name", a.name)
        console.log(a.name)
        navigate(`${getAssignmentLink(a.course_id, a.name)}`)
    }

    let getCourseLink = (courseName) => `/student/courses/${courseName.replace(' ', '-').toLowerCase()}`;
    let getAssignmentLink = (courseName, assignmentName) => `/student/assignment/${courseName}/${assignmentName.replace(' ', '-').toLowerCase()}`

    useEffect(() => {
        const isAuthed = localStorage.getItem("authenticated")
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
                <Sidebar courses={courses} handleCourseSelect={handleCourseSelect} activeCourse={activeCourse}/>
                {/* change to dynamically rendered component? can also insert course/assignment page here */}
                {conditionalRender()}
            </div>
        );
    }
}

export default StudentDashboard;