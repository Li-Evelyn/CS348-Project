import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
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

    let saveQuestion = function() {
        const description_input = document.getElementById("description_input").value
        const max_grade_input = document.getElementById("max_grade_input").value
        if (!Number.isInteger(parseInt(max_grade_input))) {
            alert("Max Grade must be an integer.");
        }
        else {
            let new_question = {
                description: description_input,
                max_grade: max_grade_input
            }
            questions.push(new_question)
            setQuestions(questions)
        }
    }

    let createAssignment = function(e) {
        e.preventDefault();

        const assignmentName = document.getElementById("assignmentName").value
        const deadlineDate = document.getElementById("deadline-date").value
        const deadlineTime = document.getElementById("deadline-time").value
        let deadline = null
        if (deadlineDate && deadlineTime) {
            deadline = deadlineDate + " " + deadlineTime
        }

        if (assignmentName && deadline) {
            let next_aid = 0
            fetch(`http://localhost:8080/max_aid`)
            .then((response) => response.json())
            .then((data) => {
                let max_aid = data.rows[0].max
                next_aid = max_aid + 1

                fetch(`http://localhost:8080/assignments?cid=${cid}`)
                .then((response) => response.json())
                .then((data) => {
                    let existingAssignments = data.rows
    
                    existingAssignments.forEach((existing_a, i) => {
                        // check for unique assignment name
                        if (existing_a.name === assignmentName) {
                            alert(`Assignment with name "${assignmentName}" already exists for this course.`)
                            return
                        }
                    })
    
                    // check that deadline is in the future
                    const deadline_timestamp = new Date(deadline).toISOString()
                    const today = new Date();
                    if (deadline_timestamp <= today.getTime()) {
                        alert("Assignment deadline must be set to a future time.")
                        return
                    }
    
                    // compute total max grade from question max grades
                    var max_grade = 0
                    questions.forEach((q, i) => {
                        max_grade += q.max_grade
                    })
    
                    // optional, can be blank
                    const description = document.getElementById("description").value
    
                    // TODO remove
                    //alert(`http://localhost:8080/createAssignment?aid=${next_aid}&cid=${cid}&a_name=${assignmentName}&deadline=${deadline_timestamp}&max_grade=${max_grade}&description=${description}`)
    
                    // create assignment
                    fetch(`http://localhost:8080/createAssignment?aid=${next_aid}&cid=${cid}&a_name=${assignmentName}&deadline=${deadline_timestamp}&max_grade=${max_grade}&description=${description}`)
                    .then((response) => response.json())
                    .then((data) => {
                        // create questions
                        Promise.all(questions.map((q, i) => {
                            // TODO: remove
                            //alert(`http://localhost:8080/createQuestion?aid=${next_aid}&num=${i+1}&max_grade=${q.max_grade}&description=${q.description}`)
                            fetch(`http://localhost:8080/createQuestion?aid=${next_aid}&num=${i+1}&max_grade=${q.max_grade}&description=${q.description}`)
                            .then((response) => response.json())
                            .then(() => {
                                navigate(`${props.getCourseLink(props.userType, cname)}`)
                            })
                        }))
                    })
                })
            })
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
                            <div class="form-group">
                                <label for="assignmentName" class="create-assignment-text">Assignment Name</label>
                                <input type="text" class="form-control" id="assignmentName" required/>
                            </div>
                            <br/>
                            <div class="form-group">
                                <label for="deadline-date" class="create-assignment-text">Deadline</label>
                                <div class="deadline-date-time">
                                    <input type="date" class="form-control deadline-date" id="deadline-date" required/>
                                    <input type="time" class="form-control deadline-time" id="deadline-time" required/>
                                </div>
                            </div>
                            <br/>
                            <div class="form-group">
                                <label for="description" class="create-assignment-text">Description</label>
                                <textarea class="form-control" id="description"/>
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