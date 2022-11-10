import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';

function AssignmentList(props) {
    const [cid, setCid] = useState("")
    const [cname, setCname] = useState("")
    const [assignments, setAssignments] = useState([])
    let navigate = useNavigate()

    let getAssignments = function() {
        fetch(`http://localhost:8080/assignments?cid=${cid}`)
        .then((response) => response.json())
        .then((data) => {
            setAssignments(data.rows)
        })
    }

    useEffect(() => {
        if (cid) {
            getAssignments();
        }
    }, [cid])

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
        <div className="course-page">
            <h2 className="medium course-name">{cname}</h2>
            {
                assignments.length === 0
                ? <h3>No assignments to display.</h3>
                : (
                    <div className="course-container">
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
                                    return (
                                        <tr onClick={() => props.handleAssignmentSelect(item)} key={i}>
                                            <td className="medium">{item.name}</td>
                                            <td className="medium">{dateString(item.deadline)}</td>
                                            <td className="medium">CHANGE ME</td>
                                            <td className="medium">CHANGE ME</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                    </div>
                )
            }
        </div>
    )
}

export default AssignmentList;