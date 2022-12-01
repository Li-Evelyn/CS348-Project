import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { Card, Dropdown } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

function AssignmentList(props) {
    const [cid, setCid] = useState("")
    const [cname, setCname] = useState("")
    const [assignments, setAssignments] = useState([])
    const [assignmentSubmissions, setAssignmentSubmissions] = useState({})

    let getAssignmentSubmissions = function() { // will correspond 1-1 with assignment list
        fetch(`http://localhost:8080/assignmentsubmissions?uid=${props.user}`)
        .then((response) => response.json())
        .then((data) => {
            let ret = {}
            data.rows.map((item) => {
                let ss = "Not submitted";
                let g = "-"
                let gc = "black"
                let sc = "red"
                if (item.grade !== null) {
                    ss = "Graded"
                    g = item.grade
                    gc = "green"
                    sc = "green"
                } else if (item.is_submitted) {
                    ss = "Submitted"
                    sc = "green"
                }
                ret[item.assignment_id] = {"text": ss, "grade": g, "tcolor": sc, "gcolor": gc}
                return 0
            })
            setAssignmentSubmissions(ret)
        })
    }

    let getAssignments = function() {
        fetch(`http://localhost:8080/assignments?cid=${cid}`)
        .then((response) => response.json())
        .then((data) => {
            setAssignments(data.rows)
        })
    }

    useEffect(() => {
        props.clearActiveAssignment();
    }, [])

    useEffect(() => {
        if (cid) {
            getAssignments()
        }
    }, [assignmentSubmissions])

    useEffect(() => {
        if (cid) {
            getAssignmentSubmissions();
        }
    }, [cid])

    useEffect(() => {
        if (cid) {
            props.setRerenderAssignments(props.rerenderAssignments)
            getAssignmentSubmissions();
        }
    }, [props.rerenderAssignments])

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

    let dateString = (s) => {
        const d = new Date(s)
        return d.toString().substring(0, 21)
    }

    return (
        <div>
            <h2 className="medium course-assignment-name">{cname}</h2>
            {
                props.userType === "student" ?
                    <div>
                        {
                            assignments.length === 0
                            ? <h3>No assignments to display.</h3>
                            : (
                                <div className="course-assignment-container">
                                    <h3 className="medium">Assignments</h3>
                                    <Table className="t">
                                        <thead>
                                            <tr>
                                                <th className="medium">Name</th>
                                                <th className="medium">Deadline</th>
                                                <th className="medium">Status</th>
                                                <th className="medium">Grade</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {assignments.map((item, i) => {
                                                let as = assignmentSubmissions[item.id]
                                                console.log(as.grade)
                                                console.log(item.max_grade)
                                                let ovr_grade = as.grade != '-' ? `${((as.grade / item.max_grade) * 100).toFixed(2)}%` : as.grade
                                                return (
                                                    <tr onClick={() => props.handleAssignmentSelect(item)} key={i}>
                                                        <td className="medium">{item.name}</td>
                                                        <td className="medium">{dateString(item.deadline)}</td>
                                                        <td className="medium" style={{color: as.tcolor}}>{as.text}</td>
                                                        <td className="medium" style={{color: as.gcolor}}>{ovr_grade}</td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </Table>
                                </div>
                            )
                        }
                    </div>
                :
                props.userType === "staff" ?
                    <div>
                        {
                            assignments.length === 0
                            ? <div>
                                <h2>No assignments to display.</h2>
                                <Button className='purple-button' onClick={() => props.handleCreateAssignment()}>Create Assignment</Button>
                              </div>
                            : (
                                <div className="course-assignment-container">
                                    <h2 className="medium">Assignments</h2>
                                    <Button className='purple-button'onClick={() => props.handleCreateAssignment()}>Create Assignment</Button>
                                    {assignments.map((item, i) => {
                                        return (
                                            <Card className="course-assignment-card" key={item.id}>
                                                <Card.Body className="course-assignment-body clickable" onClick={() => props.handleAssignmentSelect(item)}>{item.name}</Card.Body>
                                                <Dropdown className="course-assignment-dropdown" align="end">
                                                    <Dropdown.Toggle variant="light" className="course-assignment-button">
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        {/* change setRemove to assignment id*/}
                                                        <Dropdown.Item onClick={() => props.setRemove({"assignment_id": item.id})}>Delete Assignment</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </Card>
                                        )
                                    })}
                                </div>
                            )
                        }
                    </div>
                :
                    <div>Error: user type {props.userType} unsupported.</div>
                
            }
        </div>
    )
}

export default AssignmentList;