import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import QuestionsCreate from './questions_create';
import { useNavigate } from 'react-router-dom';

function AssignmentCreate(props) {
    const [cid, setCid] = useState("")
    const [cname, setCname] = useState("")
    const [questions, setQuestions] = useState([])

    let navigate = useNavigate();

    useEffect(() => {
        if (!props.course) {
            const courseID = localStorage.getItem("course_id")
            if (courseID) {
                setCid(courseID)
                const courseName = localStorage.getItem("course_name")
                setCname(courseName)
            }
        } else {
            setCid(props.course.id)
            setCname(props.course.name)
        }
    }, [props.course])

    let createAssignment = function(e) {
        try {
            e.preventDefault();
            const assignmentName = document.getElementById("assignmentName").value
            if (assignmentName === "") {
                alert ("Please specify an assignment name.")
                throw new Error("Assignment name not specified")
            }
    
            const deadlineDate = document.getElementById("deadline-date").value
            const deadlineTime = document.getElementById("deadline-time").value
            let deadline = null
            if (deadlineDate && deadlineTime) {
                deadline = deadlineDate + " " + deadlineTime
            }
            else {
                alert ("Please specify a deadline date and time.")
                throw new Error("Please specify a date and time")
            }
     
            if (assignmentName && deadline) {
                let next_aid = 0
                // get max assignment id so we can assign the next assignment id to be 1 greater
                fetch(`http://localhost:8080/max_aid`)
                .then((response) => response.json())
                .then((data) => {
                    let max_aid = data.rows[0].max
                    next_aid = max_aid + 1
                    // get all assignments to check for unique assignment name
                    fetch(`http://localhost:8080/assignments?cid=${cid}`)
                    .then((response) => response.json())
                    .then((data) => {
                        let existingAssignments = data.rows
                        existingAssignments.forEach((existing_a, i) => {
                            // check for unique assignment name
                            if (existing_a.name === assignmentName) {
                                alert(`Assignment with name "${assignmentName}" already exists for this course.`)
                                throw new Error("Duplicate assignment name")
                            }
                        })
        
                        // check that deadline is in the future
                        let deadline_timestamp = new Date(deadline)
                        const today = new Date();
                        if (deadline_timestamp <= today.getTime()) {
                            alert("Assignment deadline must be set to a future time.")
                            throw new Error("Assignment deadline must be set to a future time.")
                        }
                        deadline_timestamp = deadline_timestamp.toISOString()
        
                        // compute total max grade from question max grades
                        var max_grade = 0
                        questions.forEach((q, i) => {
                            max_grade += q.max_grade
                        })
        
                        // optional, can be blank
                        const description = document.getElementById("description").value
        
                        // create assignment
                        fetch(`http://localhost:8080/createAssignment?aid=${next_aid}&cid=${cid}&a_name=${assignmentName}&deadline=${deadline_timestamp}&max_grade=${max_grade}&description=${description}`)
                        .then((response) => response.json())
                        .then((data) => {
                            // get users in course to create assignmentsubmissions for
                            fetch(`http://localhost:8080/usersInCourse?cid=${cid}`)
                            .then((response) => response.json())
                            .then((data) => {
                                let usersInCourse = data.rows
                                // create assignmentsubmissions
                                Promise.all(usersInCourse.map((u) => {
                                    fetch(`http://localhost:8080/createAssignmentSubmission?uid=${u.student_id}&aid=${next_aid}`)
                                    return 0
                                }))
                                .then(() => {
                                    // create questions
                                    Promise.all(questions.map((q, i) => {
                                        fetch(`http://localhost:8080/createQuestion?aid=${next_aid}&num=${i+1}&max_grade=${q.max_grade}&description=${q.description}`)
                                        return 0
                                    }))
                                    .then(() => {
                                        // no need to create questionsubmissions since they're created on assignment submission
                                        // done, navigate back to assignments list for this course
                                        navigate(`${props.getCourseLink(props.userType, cname)}`)
                                    })
                                })
                            })
                        })
                    })
                })
            }
        } catch (error) {
            return
        }
    }

    return (
        <div className="course-assignment-page">
            <h2 className="medium course-assignment-name">{cname}</h2>
            {
                props.userType === "student" ?
                    <div>
                        <h3>You have insufficient permissions to create assignments.</h3>
                    </div>
                :
                props.userType === "staff" ?
                    <div>
                        <h2>Create Assignment</h2>
                        <br/>
                        <Form>
                            <div className="form-group">
                                <label htmlFor="assignmentName" className="create-assignment-text">Assignment Name</label>
                                <input type="text" className="form-control" id="assignmentName" required/>
                            </div>
                            <br/>
                            <div className="form-group">
                                <label htmlFor="deadline-date" className="create-assignment-text">Deadline</label>
                                <div className="deadline-date-time">
                                    <input type="date" className="form-control deadline-date" id="deadline-date" required/>
                                    <input type="time" className="form-control deadline-time" id="deadline-time" required/>
                                </div>
                            </div>
                            <br/>
                            <div className="form-group">
                                <label htmlFor="description" className="create-assignment-text">Description</label>
                                <textarea className="form-control" id="description"/>
                            </div>
                            <br/>
                            <QuestionsCreate userType={props.userType} questions={questions} setQuestions={setQuestions} course={props.course}/>
                            <br/>
                            <Button className='purple-button' onClick={createAssignment} type="submit">Save</Button>
                        </Form>
                    </div>
                :
                    <div>Error: user type {props.userType} unsupported.</div>
                
            }
        </div>
    )
}

export default AssignmentCreate;