import React, { useEffect, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import { useNavigate } from 'react-router-dom';

function AssignmentView(props) {
    const [aid, setAid] = useState('')
    const [assignment, setAssignment] = useState({})
    const [questions, setQuestions] = useState([])
    const [questionSubmissions, setQuestionSubmissions] = useState([])
    const [files, setFiles] = useState([])

    let getFileRefs = function() {
        let ret = []
        for (let i = 0; i < questions.length; i++) {
            ret.push(React.createRef())
        }
        setFiles(ret)
    }

    let handleAssignmentSubmit = function(e) {
        e.preventDefault();
        let uid = localStorage.getItem("user_id")
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            if (files[i].current.files) {
                let file = files[i].current.files[0];
                formData.append(`${uid}-${aid}-${i+1}`, file) // single submission
            }
        }
        fetch(`http://localhost:8080/upload?uid=${uid}&aid=${aid}`, {
            method: 'POST',
            body: formData
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
        })
    }

    let getQuestionSubmissions = function() { // will correspond 1-1 with questions list IN THEORY
        
    }

    let getAssignment = function(id) {
        fetch(`http://localhost:8080/assignment?id=${id}`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data.rows["0"])
            setAssignment(data.rows["0"])
        })
        .catch((e) => {
            console.log(`Error: ${e}`)
        })
    }

    let getQuestions = function(id) {
        fetch(`http://localhost:8080/questions?aid=${id}`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data.rows)
            setQuestions(data.rows)
        })
    }

    useEffect(() => {
        if (files) {
            console.log(files)
        }
    }, [files])

    useEffect(() => {
        if (questions) {
            getFileRefs()
            // getQuestionSubmissions()
        }
    }, [questions])

    useEffect(() => {
        if (aid) {
            getAssignment(aid)
            getQuestions(aid)
            getAssignmentSubmissions(aid)
        }
    }, [aid])

    useEffect(() => {
        if (!props.assignment) {
            const id = localStorage.getItem("assignment_id")
            setAid(id)
        } else {
            setAid(props.assignment.id)
            setAssignment(props.assignment)
        }
    }, [props.assignment])

    let dateString = (s) => {
        const d = new Date(s)
        return d.toString().substring(0, 21)
    }

    return (
        <div className="course-assignment-page">
            <h2 className="medium course-assignment-name">{assignment.name}</h2>
            {
                props.userType === "student" ?
                <form onSubmit={handleAssignmentSubmit}>
                    <h5 className="medium" style={{color: "#5271ff"}}>Deadline: {dateString(assignment.deadline)}</h5>
                    <p className="light">{assignment.description}</p>
                    <h4 className="medium">Submit Your Assignment</h4>
                    {questions.map((item, i) => {
                        return (
                            <Card className="course-assignment-card" key={i}>
                                <Card.Body style={{width: "60% !important"}}>
                                    <Card.Title className="question-title">
                                        <>Question {item.number}</>
                                        <>
                                            {/* something here for grading mayhaps */}
                                            <Card.Text className="medium">/{item.max_grade}</Card.Text>
                                        </>
                                    </Card.Title>
                                    <Card.Subtitle>{item.description}</Card.Subtitle>
                                    <input type="file" className="input-submission" ref={files[i]}/>
                                </Card.Body>
                            </Card>
                        )
                    })}
                    <div className="center"><Button className="medium questions-button" type="submit">Submit Assignment</Button></div>
                </form>
                :
                props.userType === "staff" ?
                <div>
                    <h5 className="medium">{assignment.description}</h5>
                    <div className="splash medium container assignmenteditbuttoncontainer">
                        <Button variant="Light" size="lg" className="assignmenteditbutton" onClick={() => props.handleAssignmentEditing(assignment)}>Edit Assignment</Button>
                    </div>
                    <h5 className="medium">Student Submissions</h5>
                    <div className="course-assignment-container">
                        <Table className="t">
                            <thead>
                                <tr>
                                    <th className="medium">Name</th>
                                    <th className="medium">Email</th>
                                    <th className="medium">Submission</th>
                                    <th className="medium">Grade</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assignmentSubmissions.map((item, i) => {
                                    return (
                                        <tr>
                                            <td className="medium">{item.name}</td>
                                            <td className="medium">{item.email}</td>
                                            <td className="medium" >
                                                <Button variant="Light" size="lg" className="assignmentgradebutton" onClick={() => props.handleAssignmentGrading(assignment, item.uid)}>View and Grade</Button>
                                            </td>
                                            <td className="medium" style={{color: item.gcolor}}>{item.grade}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                    </div>
                </div>
                :
                <div>Error: user type {props.userType} unsupported.</div>
            }
            
        </div>
    )
}

export default AssignmentView;