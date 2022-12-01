import React, { useEffect, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function AssignmentView(props) {
    const [aid, setAid] = useState('')
    const [assignment, setAssignment] = useState({})
    const [questions, setQuestions] = useState([])
    const [assignmentSubmissions, setAssignmentSubmissions] = useState([])
    const [stats, setStats] = useState({})
    const [distribution, setDistribution] = useState([])
    const [assignmentNotGraded, setAssignmentNotGraded] = useState([])

    let navigate = useNavigate();

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
                console.log(item);
                ret.push({"text": ss, "grade": g, "tcolor": sc, "gcolor": gc, "name": item.name, "email": item.email, "uid": item.id})
                return 0
            })
            console.log(ret)
            setAssignmentSubmissions(ret)
        })
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

    let getAssignmentStats = function(id) {
        fetch(`http://localhost:8080/assignmentstats?aid=${id}`)
        .then((response) => response.json())
        .then((data) => {
            if (data.rows.length > 0) {
                console.log(data.rows["0"])
                setStats(data.rows["0"])
            }
            else {
                setStats({})
            }
        })
        .catch((e) => {
            console.log(`Error: ${e}`)
        })
    }

    let getAssignmentDistribution = function(id) {
        fetch(`http://localhost:8080/assignmentdistribution?aid=${id}`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data.rows)
            const distribution = []
            const bin_distance = 10
            for (let i=0; i<100; i+=bin_distance) {
                distribution.push({
                    range: i.toString() + "% - " + (i+bin_distance).toString() + "%",
                    range_med: (i+bin_distance/2).toString() + "%",
                    students: 0
                })
            }

            data.rows.forEach(row => {
                distribution[row.grade_range/bin_distance].students = row.count
            })

            setDistribution(distribution)
        })
        .catch((e) => {
            console.log(`Error: ${e}`)
        })
    }

    let getAssignmentNotGraded = function(id) {
        fetch(`http://localhost:8080/assignmentnotgraded?aid=${id}`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data.rows)
            setAssignmentNotGraded(data.rows)
        })
        .catch((e) => {
            console.log(`Error: ${e}`)
        })
    }

    useEffect(() => {
        if (aid) {
            getAssignment(aid)
            getQuestions(aid)
            getAssignmentSubmissions(aid)
            getAssignmentStats(aid)
            getAssignmentDistribution(aid)
            getAssignmentNotGraded(aid)
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

    useEffect(() => {
        const distribution_copy = distribution
        if (distribution_copy.length > 0 && 'total_count' in stats && 'graded_count' in stats) {
            distribution_copy[0].students += stats.total_count - stats.graded_count
        }
        setDistribution(distribution_copy)
    }, [distribution, stats])

    let dateString = (s) => {
        const d = new Date(s)
        return d.toString().substring(0, 21)
    }

    const CustomTooltip = ({active, payload, label}) => {
        if (active && payload && payload.length && payload[0].value > 0) {
            const range_med = parseInt(label.slice(0,-1))
            const bin_distance = 10;
            return (
                <div className="custom-tooltip">
                    <p className="label">{`${range_med-bin_distance/2}% - ${range_med+bin_distance/2}%`}</p>
                    <p className="desc">{`students: ${payload[0].value}`}</p>
                </div>
            )
        }
    }

    return (
        <div className="course-assignment-page">
            <h2 className="medium course-assignment-name">{assignment.name}</h2>
            {
                props.userType === "student" ?
                <div>
                    <h5 className="medium" style={{color: "#5271ff"}}>Deadline: {dateString(assignment.deadline)}</h5>
                    <p className="light">{assignment.description}</p>
                    {assignmentNotGraded.length === 0 && Date.parse(assignment.deadline) < new Date() && 'avg' in stats &&
                    <div className="course-assignment-stats">
                    <p className="light">Students: {stats.total_count} &ensp; Mean: {parseFloat(stats.avg).toFixed(2)} &ensp; Std: {parseFloat(stats.std).toFixed(2)}</p>
                    <ResponsiveContainer width="60%">
                        <BarChart data={distribution}>
                            <XAxis dataKey="range_med" />
                            <YAxis />
                            <Tooltip wrapperStyle={{outline : "none"}} content={<CustomTooltip />} />
                            <Bar dataKey="students" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                    </div>}
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
                    <h5 className="medium">{assignment.description}</h5>
                    {'avg' in stats &&
                    <div className="course-assignment-stats">
                    <p className="light">Students: {stats.total_count} &ensp; Mean: {parseFloat(stats.avg).toFixed(2)} &ensp; Std: {parseFloat(stats.std).toFixed(2)}</p>
                    <ResponsiveContainer width="60%">
                        <BarChart data={distribution}>
                            <XAxis dataKey="range_med" />
                            <YAxis />
                            <Tooltip wrapperStyle={{outline : "none"}} content={<CustomTooltip />} />
                            <Bar dataKey="students" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                    </div>}
                    <Button className="purple-button" onClick={() => props.handleAssignmentEditing(assignment)}>Edit Assignment</Button>
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
                                                <Button className="purple-button small" onClick={() => props.handleAssignmentGrading(assignment, item.uid)}>View and Grade</Button>
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