import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';

function AssignmentView(props) {
    const [aid, setAid] = useState('')
    const [assignment, setAssignment] = useState({})
    const [questions, setQuestions] = useState([])

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
        if (aid) {
            getAssignment(aid)
            getQuestions(aid)
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
                <div>
                    <h5 className="medium" style={{color: "#5271ff"}}>Deadline: {dateString(assignment.deadline)}</h5>
                    <p className="light">{assignment.description}</p>
                    <h4 className="medium">Submit Your Assignment</h4>
                    {questions.map((item, i) => {
                        return (
                            <Card className="course-assignment-card" key={i}>
                                <Card.Body style={{width: "60% !important"}}>
                                    <Card.Title>Question {item.number}</Card.Title>
                                    <Card.Subtitle>{item.description}</Card.Subtitle>
                                    <input type="file"/>
                                </Card.Body>
                                <Card.Text className="medium">/{item.max_grade}</Card.Text>
                            </Card>
                        )
                    })}
                </div>
                :
                props.userType === "staff" ?
                <div>
                    <p>TODO</p>
                </div>
                :
                <div>Error: user type {props.userType} unsupported.</div>
            }
            
        </div>
    )
}

export default AssignmentView;