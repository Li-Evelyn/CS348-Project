import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

function StudentList(props) {
    const [cid, setCid] = useState("")
    const [cname, setCname] = useState("")

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

    let deleteStudent = function(e) {
        // TODO
        alert("TODO")
    }

    return (
        <div>
            {
                props.userType === "student" ?
                    <div>
                    </div>
                :
                props.userType === "staff" ?
                    <div>
                        <h4>Students</h4>
                        <Table className="students-table">
                            <thead>
                                <tr>
                                    <th className="medium">Number</th>
                                    <th className="medium">Description</th>
                                    <th className="medium">Max Grade</th>
                                    <th className="medium"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {props.questions.map((item, i) => {
                                    return (
                                        <tr>
                                            <td className="medium">{i + 1}</td>
                                            <td className="medium">{item.description}</td>
                                            <td className="medium">{item.max_grade}</td>
                                            <td className="medium">
                                                <Button className="purple-button small delete" onClick={deleteQuestion}>Delete</Button>
                                            </td>
                                        </tr>
                                    )
                                })}
                                <tr>
                                    <td className="medium">
                                        {props.questions.length + 1}
                                    </td>
                                    <td className="medium">
                                        <input type="text" id="description_input"></input>
                                    </td>
                                    <td className="medium">
                                        <input type="text" id="max_grade_input"></input>
                                    </td>
                                    <td className="medium">
                                        <Button className="purple-button small save" onClick={saveQuestion}>Save and New</Button>
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                :
                    <div></div>
            }
        </div>
    )
}

export default StudentList;