import React, { useEffect, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
// import { useNavigate } from 'react-router-dom';

function AssignmentView(props) {
    const [aid, setAid] = useState('')
    const [assignment, setAssignment] = useState({})
    const [assignmentSubmissions, setAssignmentSubmissions] = useState([]) // staff
    const [questions, setQuestions] = useState([])
    const [questionSubmissions, setQuestionSubmissions] = useState({})
    const [files, setFiles] = useState([])
    const [submitted, setSubmitted] = useState(false)
    const [deadlinePassed, setDeadlinePassed] = useState(false)

    let getAS = function(aid) {
        let uid = localStorage.getItem("user_id")
        let utype = localStorage.getItem("user_type")
        if (utype === "student") { // don't run this for staff
            fetch(`http://localhost:8080/assignmentsubmission?uid=${uid}&aid=${aid}`)
            .then((response) => response.json())
            .then((data) => {
                setSubmitted(data.rows["0"].is_submitted)
            })
        }
    }

    let getFileRefs = function() {
        let ret = []
        let ret2 = []
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
        setSubmitted(true)
        getQuestionSubmissions(aid)
    }

    let getQuestionSubmissions = function(aid) { 
        let uid = localStorage.getItem("user_id")
        fetch(`http://localhost:8080/questionSubmissions?uid=${uid}&aid=${aid}`)
        .then((response) => response.json())
        .then((data) => {
            let ret = {}
            for (let i = 0; i < data.rows.length; i++) {
                let row = data.rows[i]
                ret[`${row.question_number}`] = {
                    file_path: row.file_path, 
                    staff_comments: row.staff_comments, 
                    grade: row.grade,
                    image_url: `http://localhost:8080/${row.file_path}.png`
                }
            }
            setQuestionSubmissions(ret)
        })
    }

    let getAssignmentSubmissions = function(aid) { // will correspond 1-1 with assignment list
        fetch(`http://localhost:8080/submissioninfofromassignment?aid=${aid}`)
        .then((response) => response.json())
        .then((data) => {
            let ret = []
            data.rows.map((item, i) => {
                let ss = "Not submitted";
                let g = "-"
                let gc = "black"
                let sc = "red"
                if (item.grade) {
                    ss = "Graded"
                    g = `${item.grade}%`
                    gc = "green"
                    sc = "green"
                } else if (item.is_submitted) {
                    ss = "Submitted"
                    sc = "green"
                }
                ret.push({"text": ss, "grade": g, "tcolor": sc, "gcolor": gc, "name": item.name, "email": item.email, "uid": item.id})
                return 0
            })
            setAssignmentSubmissions(ret)
        })
    }

    let getAssignment = function(id) {
        fetch(`http://localhost:8080/assignment?id=${id}`)
        .then((response) => response.json())
        .then((data) => {
            setAssignment(data.rows["0"])
            setDeadlinePassed(new Date(data.rows["0"].deadline) - new Date() < 0)
        })
        .catch((e) => {
            console.log(`Error: ${e}`)
        })
    }

    let getQuestions = function(id) {
        fetch(`http://localhost:8080/questions?aid=${id}`)
        .then((response) => response.json())
        .then((data) => {
            setQuestions(data.rows)
        })
    }

    useEffect(() => {
        if (questions) {
            getFileRefs()
            // getQuestionSubmissions()
        }
    }, [questions, submitted])

    useEffect(() => {
        if (aid) {
            getAssignment(aid)
            getQuestions(aid)
            getAssignmentSubmissions(aid)
            getAS(aid)
            getQuestionSubmissions(aid)
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
        <div className="course-assignment-page assignment">
            <div className="course-assignment-container">
                <h2 className="medium course-assignment-name">{assignment.name}</h2>
                {
                    props.userType === "student" ?
                    <form onSubmit={handleAssignmentSubmit}>
                        <h5 className="medium" style={{color: "#5271ff"}}>Deadline: {dateString(assignment.deadline)}</h5>
                        <p className="light">{assignment.description}</p>
                        <h4 className="medium" style={{color: submitted ? "green" : deadlinePassed ? "red" : "black"}}>{submitted ? "Submitted!" : deadlinePassed ? "Overdue" : "Submit Your Assignment" }</h4>
                        <div className="center">
                            {
                                submitted && !deadlinePassed ? <Button className="medium questions-button" onClick={() => setSubmitted(false)} type="button">Edit Submission</Button> : <></>
                            }
                        </div>
                        {questions.map((item, i) => {
                            return (
                                <Card className="course-assignment-card" key={i}>
                                    <Card.Body style={{width: "60% !important"}}>
                                        <Card.Title className="question-title">
                                            <>Question {item.number}</>
                                            <>
                                                {/* something here for grading mayhaps */}
                                                <Card.Text className="medium">{item.number in questionSubmissions && questionSubmissions[item.number].grade ? questionSubmissions[item.number].grade : ""}/{item.max_grade}</Card.Text>
                                            </>
                                        </Card.Title>
                                        <Card.Subtitle>{item.description}</Card.Subtitle>
                                        {
                                            submitted ?
                                            item.number in questionSubmissions ?
                                            <img src={questionSubmissions[item.number].image_url} alt={`Question ${item.number} submission file`}></img> // image here
                                            :
                                            <Card.Text>No file submitted.</Card.Text>
                                            :
                                            deadlinePassed ?
                                            <></>
                                            :
                                            <>
                                                <input id={`in-${i}`} type="file" className="input-submission" key={i} ref={files[i]} accept="image/png" hidden/>
                                                <label htmlFor={`in-${i}`} className="custom-input medium">Click to upload a single file.</label>
                                            </>
                                        }
                                        {
                                            item.number in questionSubmissions && questionSubmissions[item.number].staff_comments ?
                                            <Card.Text>Staff Comments: {questionSubmissions[item.number].staff_comments}</Card.Text>
                                            :
                                            <></>
                                        }
                                    </Card.Body>
                                </Card>
                            )
                        })}
                        <div className="center">
                            {
                                submitted || deadlinePassed ? <></> : <Button className="medium questions-button" type="submit">Submit Assignment</Button>
                            }
                        </div>
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
                                            <tr key={i}>
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
        </div>
    )
}

export default AssignmentView;