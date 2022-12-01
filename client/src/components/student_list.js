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

    let unenrollStudent = function(e) {
        let uid = parseInt(e.target.parentElement.parentElement.children[0].id.replace('student_', ''))
        props.unenrollStudent(uid)
    }

    let enrollStudent = function() {
        let name = document.getElementById("name_input").value 
        let email = document.getElementById("email_input").value 
        let successful_add = props.enrollStudent(name, email)
        if (successful_add) {
            document.getElementById("name_input").value = ""
            document.getElementById("email_input").value = ""
        }
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
                                {props.courseStudents.map((student, i) => {
                                    return (
                                        <tr>
                                            <td className="medium" id={`student_${student.id}`}>{student.name}</td>
                                            <td className="medium">{student.email}</td>
                                            <td className="medium">
                                                <Button className="purple-button small" onClick={unenrollStudent}>Unenroll</Button>
                                            </td>
                                        </tr>
                                    )
                                })}
                                <tr>
                                    <td className="medium">
                                        <input type="text" id="name_input"></input>
                                    </td>
                                    <td className="medium">
                                        <input type="text" id="email_input"></input>
                                    </td>
                                    <td className="medium">
                                        <Button className="purple-button small" onClick={enrollStudent}>Save and New</Button>
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