import React, { useEffect, useState } from 'react';
import { Button, Card } from 'react-bootstrap';

function AssignmentGradeView (props) {
    const [aid, setAid] = useState(null)
    const [assignment, setAssignment] = useState(null)
    const [assignmentSubmission, setAssignmentSubmission] = useState(null)
    const [uid, setUid] = useState(null)
    const [student, setStudent] = useState(null)
    const [questions, setQuestions] = useState([])
    const [questionSubmissions, setQuestionSubmissions] = useState({})
    const [cumulativeGrade, setCumulativeGrade] = useState(null)
    const [submitted, setSubmitted] = useState(true)
    const [grades, setGrades] = useState([])
    const [comments, setComments] = useState([])

    // TODO: update assignment grade

    let handleGradeSubmit = function(e) {
        e.preventDefault()
        let formData = {}
        let overallGrade = 0
        for (let i = 0; i < grades.length; i++) {
            overallGrade += Number(grades[i])
            formData[i + 1] = { // question num
                grade: grades[i],
                staff_comments: comments[i]
            }
        }
        formData["assn_grade"] = overallGrade
        console.log(formData)
        fetch(`http://localhost:8080/submitGrades?uid=${uid}&aid=${aid}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
        })
        setCumulativeGrade(overallGrade)
        setSubmitted(true)
        window.location.reload()
    }

    let handleGradesChange = function(e, i) {
        let temp = grades;
        temp[i] = e.target.value;
        setGrades(temp)
    }

    let handleCommentsChange = function(e, i) {
        let temp = comments;
        temp[i] = e.target.value;
        setComments(temp)
    }

    let getAssignmentSubmission = function(uid, aid) {
        fetch(`http://localhost:8080/assignmentSubmission?uid=${uid}&aid=${aid}`)
        .then((response) => response.json())
        .then((data) => {
            setAssignmentSubmission(data.rows["0"])
            if (data.rows["0"].grade !== null) {
                setCumulativeGrade(data.rows["0"].grade)
            }
        })
    }

    let getQuestionSubmissions = function(uid, aid) {
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

    let getQuestions = function(aid) {
        fetch(`http://localhost:8080/questions?aid=${aid}`)
        .then((response) => response.json())
        .then((data) => {
            setQuestions(data.rows.sort((a, b) => { return a.number - b.number}))
        })
    }

    let getAssignment = function(aid) {
        fetch(`http://localhost:8080/assignment?id=${aid}`)
        .then((response) => response.json())
        .then((data) => {
            setAssignment(data.rows["0"])
        })
    }

    let getStudent = function(uid) {
        fetch(`http://localhost:8080/user?id=${uid}`)
        .then((response) => response.json())
        .then((data) => {
            setStudent(data.rows["0"])
        })
    }

    useEffect(() => {
        if (questionSubmissions && questions) {
            let temp = []
            let temp2 = []
            for (let i = 0; i < questions.length; i++) {
                if (questions[i].number in questionSubmissions && questionSubmissions[questions[i].number].grade !== null) {
                    temp.push(questionSubmissions[questions[i].number].grade)
                } else {
                    temp.push(0)
                }
                if (questions[i].number in questionSubmissions && questionSubmissions[questions[i].number].staff_comments !== null) {
                    temp2.push(questionSubmissions[questions[i].number].staff_comments)
                } else {
                    temp2.push("")
                }
            }
            setGrades(temp)
            setComments(temp2)
        }
    }, [questionSubmissions, questions])

    useEffect(() => {
        if (assignmentSubmission && assignmentSubmission.grade) {
            setSubmitted(true)
        }
    }, [assignmentSubmission])

    useEffect(() => {
        if (aid && uid) {
            getQuestions(aid)
            getQuestionSubmissions(uid, aid)
            getAssignmentSubmission(uid, aid)
        }
    }, [aid, uid])

    useEffect(() => {
        if (uid) {
            getStudent(uid)
        }
    }, [uid])

    useEffect(() => {
        if (aid) {
            getAssignment(aid)
        }
    }, [aid])

    useEffect(() => {
        if (props.student_id) {
            setUid(props.student_id)
        } else {
            let s = localStorage.getItem("graded_student_id")
            setUid(s)
        }        
    }, [props.student_id])

    useEffect(() => {
        if (props.assignment) {
            setAid(props.assignment.id)
            setAssignment(props.assignment)
        } else {
            let a = localStorage.getItem("assignment_id")
            setAid(a)
        }
    }, [props.assignment])

    return (
        <div className="course-assignment-page">
                {
                    assignment && student ?
                    <div className="course-assignment-container">
                        <h2 className="medium course-assignment-name">{assignment.name} Submission</h2>
                        <br></br>
                        <h3 className="medium">Student: {student.name}</h3>
                        <h3 className="medium">Grade: {submitted ? cumulativeGrade : "-"}/{assignment.max_grade}</h3>
                        <form id="form" onSubmit={handleGradeSubmit}>
                            <div className="center">
                                {
                                    submitted ? 
                                    <Button 
                                        className="medium questions-button" 
                                        onClick={() => {
                                            setSubmitted(false)
                                            setCumulativeGrade(0)
                                        }} 
                                        type="button">Begin Grading</Button> 
                                        : <></>
                                }
                            </div>
                            {questions.map((item, i) => {
                                return (
                                    <Card className="course-assignment-card" key={i}>
                                        <Card.Body style={{width: "60% !important"}}>
                                            <Card.Title className="question-title">
                                                <>Question {item.number}</>
                                                <>
                                                    <Card.Text className="medium corner">
                                                        {
                                                        submitted ? 
                                                            item.number in questionSubmissions && questionSubmissions[item.number].grade !== null ? 
                                                            questionSubmissions[item.number].grade 
                                                            : '-'
                                                        : <input type="text" className="medium num-input" placeholder={grades[i]} onChange={(e) => handleGradesChange(e, i)} required/>
                                                        }
                                                        /{item.max_grade}
                                                    </Card.Text>
                                                </>
                                            </Card.Title>
                                            <Card.Subtitle>{item.description}</Card.Subtitle>
                                            {
                                                item.number in questionSubmissions ?
                                                <img src={questionSubmissions[item.number].image_url} alt={`Question ${item.number} submission file`}></img>
                                                :
                                                <>No file submitted.</>
                                            }
                                            <h5 className="medium">Comments</h5>
                                            {
                                                submitted ?
                                                item.number in questionSubmissions ?
                                                <p className="light">{questionSubmissions[item.number].staff_comments}</p>
                                                :
                                                <></>
                                                :
                                                <input type="text" className="medium long" placeholder="Enter comments" onChange={(e) => handleCommentsChange(e, i)}/>
                                            }
                                        </Card.Body>
                                    </Card>
                                )
                            })}
                            <div className="center">
                                {
                                    submitted ? <></> : <Button className="medium questions-button" type="submit">Submit Grading</Button>
                                }
                            </div>
                        </form>
                    </div>      
                    :
                    <></> // wait for loading ;-;
                }
        </div>
    )
}

export default AssignmentGradeView;