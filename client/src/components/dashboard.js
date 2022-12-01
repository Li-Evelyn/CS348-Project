import React, { useState, useEffect } from 'react'; // useReducer
import { useNavigate } from 'react-router-dom';
import Sidebar from './sidebar';
import CourseList from './course_list'
import AssignmentList from './assignment_list'
import AssignmentView from './assignment_view';
import AssignmentCreate from './assignment_create';
import AssignmentGradeView from './assignment_grade';

function Dashboard(props) {
    const [authenticated, setAuthenticated] = useState(null);
    const [user, setUser] = useState(null)
    const [userType, setUserType] = useState(null)
    const [courses, setCourses] = useState([])
    const [removeCourse, setRemoveCourse] = useState(null)
    const [removeAssignment, setRemoveAssignment] = useState(null)
    const [rerenderAssignments, setRerenderAssignments] = useState(null)
    const [activeCourse, setActiveCourse] = useState(null)
    const [activeAssignment, setActiveAssignment] = useState(null)
    const [gradingID, setGradingID] = useState(null)

    let conditionalRender = () => {
        switch(props.view) {
            case 'c':
                return <CourseList userType={userType} courses={courses} getLink={getCourseLink} setRemove={setRemoveCourse} handleCourseSelect={handleCourseSelect} setActiveCourse={setActiveCourse}/>;
            case 'a':
                return <AssignmentList userType={userType} course={activeCourse} rerenderAssignments={rerenderAssignments} setRerenderAssignments={setRerenderAssignments} setRemove={setRemoveAssignment} handleAssignmentSelect={handleAssignmentSelect} handleCreateAssignment={handleCreateAssignment} user={user} clearActiveAssignment={clearActiveAssignment}/>            
            case 'q':
                return <AssignmentView userType={userType} assignment={activeAssignment} handleAssignmentEditing={handleAssignmentEditing} handleAssignmentGrading={handleAssignmentGrading}></AssignmentView>
            case 'ca':
                return <AssignmentCreate userType={userType} course={activeCourse} getCourseLink={getCourseLink}></AssignmentCreate>
            case 'g':
                return <AssignmentGradeView assignment={activeAssignment} student_id={gradingID}></AssignmentGradeView>
            default:
                return <></>
        }
    }

    let navigate = useNavigate();

    let getCourses = function(uid, user_type) {
        fetch (`http://localhost:8080/courses?uid=${uid}&userType=${user_type}`)
        .then((response) => response.json())
        .then((data) => {
            setCourses(data.rows)
        })
    }

    let unEnroll = function() {
        if (removeCourse != null) {
            fetch (`http://localhost:8080/unenroll?uid=${user}&course=${removeCourse}`)
            .then((response) => response.json())
            .then(() => {
                setRemoveCourse(null);
                getCourses(user, userType);
            })
        }
    }

    let deleteCourse = function() {
        if (removeCourse != null) {
            fetch (`http://localhost:8080/deleteCourse?course=${removeCourse}`)
            .then((response) => response.json())
            .then(() => {
                setRemoveCourse(null);
                getCourses(user, userType);
            })
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
        localStorage.setItem("assignment_id", a.id)
        navigate(`${getAssignmentLink(userType, activeCourse.name, a.name)}`)
    }

    let handleCreateAssignment = () => {
        navigate(`${getCreateAssignmentLink(userType, activeCourse.name)}`)
    }

    let clearActiveAssignment = () => {
        setActiveAssignment(null);
        localStorage.removeItem("assignment_name")
        localStorage.removeItem("assignment_id")
    }

    let handleAssignmentEditing = (a) => {
        setActiveAssignment(a);
        navigate(`${getAssignmentEditingLink(a.name, activeCourse.name)}`)
    }

    let handleAssignmentGrading = (a, uid) => {
        setActiveAssignment(a);
        localStorage.setItem("assignment_id", a.id)
        setGradingID(uid)
        localStorage.setItem("graded_student_id", uid)
        navigate(`${getGradingLink(a.id, uid)}`)
    }

    let deleteAssignment = function() {
        if (removeAssignment != null) {
            // TODO: change to assignment id
            fetch (`http://localhost:8080/deleteAssignment?assignment_id=${removeAssignment.assignment_id}`)
            .then((response) => response.json())
            .then(() => {
                setRemoveAssignment(null);
                // flips rerenderAssignments bool so child assignment_list rerenders
                if (rerenderAssignments == null) {
                    setRerenderAssignments(true)
                }
                else {
                    setRerenderAssignments(!rerenderAssignments)
                }
            })
        }
    }

    let getCourseLink = (userType, courseName) => `/${userType}/courses/${courseName.replace(' ', '-').toLowerCase()}`;
    let getCreateAssignmentLink = (userType, courseName) => `/${userType}/createAssignment/${courseName.replace(' ', '-').toLowerCase()}`;
    let getAssignmentLink = (userType, courseName, assignmentName) => `/${userType}/assignment/${courseName.replace(' ', '-').toLowerCase()}/${assignmentName.replace(' ', '-').toLowerCase()}`
    let getGradingLink = (assignmentId, userId) => `/staff/grading/${assignmentId}/${userId}`
    let getAssignmentEditingLink = (assignmentName, courseName) => `/staff/edit-assignment/${courseName.replace(' ', '-').toLowerCase()}/${assignmentName.replace(' ', '-').toLowerCase()}`

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

		if (activeCourse === null) {
			const courseId = localStorage.getItem("course_id")
			const courseName = localStorage.getItem("course_name");
			if (courseId && courseName) {
				const curCourse = {
					id: parseInt(courseId),
					name: courseName
				};

				setActiveCourse(curCourse);
			}
		}
    }, []);

    useEffect(() => {
        if (userType === "student") {
            unEnroll();
        }
        else if (userType === "staff") {
            deleteCourse();
        }
    }, [removeCourse])

    useEffect(() => {
        if (userType === "staff") {
            deleteAssignment();
        }
    }, [removeAssignment])

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