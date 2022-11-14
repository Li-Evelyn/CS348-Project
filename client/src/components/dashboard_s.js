import React, { useState, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './sidebar';
import CourseList from './course_list'
import AssignmentList from './assignment_list'

function Dashboard(props) {
    const [authenticated, setAuthenticated] = useState(null);
    const [user, setUser] = useState(null)
    const [userType, setUserType] = useState(null)
    const [courses, setCourses] = useState([])
    const [remove, setRemove] = useState(null)
    const [activeCourse, setActiveCourse] = useState(null)
    const [activeAssignment, setActiveAssignment] = useState(null)

    let conditionalRender = () => {
        switch(props.view) {
            case 'c':
                return <CourseList userType={userType} courses={courses} getLink={getCourseLink} setRemove={setRemove} handleCourseSelect={handleCourseSelect} setActiveCourse={setActiveCourse}/>;
            case 'a':
                // TODO: update AssignmentList for staff view
                return <AssignmentList userType={userType} course={activeCourse} handleAssignmentSelect={handleAssignmentSelect}/> // TODO: persist this
            case 'q':
                return <></>
            default:
                return <></>
        }
    }

    useEffect(() => {
        console.log(activeCourse)
    }, [activeCourse])

    let navigate = useNavigate();

    let getCourses = function(uid, user_type) {
        fetch (`http://localhost:8080/courses?uid=${uid}&userType=${user_type}`)
        .then((response) => response.json())
        .then((data) => {
            setCourses(data.rows)
        })
    }

    let unEnroll = function() {
        if (remove != null) {
            fetch (`http://localhost:8080/unenroll?uid=${user}&course=${remove}`)
            setRemove(null);
            getCourses(user, userType);
        }
    }

    // TODO: courses don't auto-refresh after delete? 
    let deleteCourse = function() {
        if (remove != null) {
            fetch (`http://localhost:8080/deleteCourse?course=${remove}`)
            setRemove(null);
            getCourses(user, userType);
        }
    }

    let handleCourseSelect = (c) => {
        setActiveCourse(c)
        localStorage.setItem("course_name", c.name)
        localStorage.setItem("course_id", c.id)
        navigate(`${getCourseLink(userType, c.name)}`)
    }

    let handleAssignmentSelect = (a) => {
        setActiveAssignment(a);
        localStorage.setItem("assignment_name", a.name)
        console.log(a.name)
        navigate(`${getAssignmentLink(userType, a.course_id, a.name)}`)
    }

    let getCourseLink = (userType, courseName) => `/${userType}/courses/${courseName.replace(' ', '-').toLowerCase()}`;
    let getAssignmentLink = (userType, courseName, assignmentName) => `/${userType}}/assignment/${courseName}/${assignmentName.replace(' ', '-').toLowerCase()}`

    useEffect(() => {
        const isAuthed = localStorage.getItem("authenticated")
        if (isAuthed) {
            setAuthenticated(true);
            const uid = localStorage.getItem("user_id");
            setUser(uid);
            const user_type = localStorage.getItem("user_type");
            setUserType(user_type);
            getCourses(uid, user_type);
        } else {
            navigate("/login");
        }
    }, []);

    useEffect(() => {
        if (userType === "student") {
            unEnroll();
        }
        else if (userType === "staff") {
            deleteCourse();
        }
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

export default Dashboard;