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

    let addStudent = function(e) {
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
                                    <th className="medium">Name</th>
                                    <th className="medium">Email</th>
                                    <th className="medium"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {/*props.students.map((student, i) => {
                                    return (
                                        <tr>
                                            <td className="medium">{i + 1}</td>
                                            <td className="medium">{student.name}</td>
                                            <td className="medium">{student.email}</td>
                                            <td className="medium">
                                                <Button className="purple-button small" onClick={deleteStudent}>Unenroll</Button>
                                            </td>
                                        </tr>
                                    )
                                })*/}
                                <tr>
                                    <td className="medium">
                                        <input type="text" id="name_input"></input>
                                    </td>
                                    <td className="medium">
                                        <input type="text" id="email_input"></input>
                                    </td>
                                    <td className="medium">
                                        <Button className="purple-button small" onClick={addStudent}>Save and New</Button>
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