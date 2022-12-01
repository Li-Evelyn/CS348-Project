import React, { useEffect, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function AssignmentView(props) {
    const [aid, setAid] = useState('')
    const [assignment, setAssignment] = useState({})
    const [assignmentSubmissions, setAssignmentSubmissions] = useState([]) // staff
    const [questions, setQuestions] = useState([])
    const [questionSubmissions, setQuestionSubmissions] = useState({})
    const [files, setFiles] = useState([])
    const [submitted, setSubmitted] = useState(false)
    const [deadlinePassed, setDeadlinePassed] = useState(false)
    const [stats, setStats] = useState({})
    const [distribution, setDistribution] = useState([])
    const [assignmentNotGraded, setAssignmentNotGraded] = useState([])

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
                console.log(file)
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
            setQuestions(data.rows.sort((a, b) => { return a.number - b.number}))
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

    const bin_distance = 10
    let getAssignmentDistribution = function(id) {
        fetch(`http://localhost:8080/assignmentdistribution?aid=${id}`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data.rows)
            const distribution = []
            for (let i=0; i<100; i+=bin_distance) {
                distribution.push({
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
        if (questions && aid) {
            getFileRefs()
            getQuestionSubmissions(aid)
        }
    }, [questions, submitted])

    useEffect(() => {
        if (aid) {
            getAssignment(aid)
            getQuestions(aid)
            getAssignmentSubmissions(aid)
            getAssignmentStats(aid)
            getAssignmentDistribution(aid)
            getAssignmentNotGraded(aid)
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
            return (
                <div className="custom-tooltip">
                    <p className="label">{`${range_med-bin_distance/2}% - ${range_med+bin_distance/2}%`}</p>
                    <p className="desc">{`students: ${payload[0].value}`}</p>
                </div>
            )
        }
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
                        <div style={{width: "100%", justifyContent: "center"}}>
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
        </div>
    )
}

export default AssignmentView;