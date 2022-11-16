import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Dropdown } from 'react-bootstrap';

function CourseList(props) {
    let navigate = useNavigate()

    useEffect(() => {
        props.setActiveCourse(null)
    }, [])

    return (
        <div className="course-assignment-page">
            {
                props.courses.length === 0
                ? <h2>No courses to display.</h2>
                : (
                    <div className="course-assignment-container">
                        <h2 className="medium">Courses</h2>
                        {props.courses.map((item, i) => {
                            return (
                                <Card className="course-assignment-card" key={item.id}>
                                    <Card.Body className="course-assignment-body clickable" onClick={() => props.handleCourseSelect(item)}>{item.name}</Card.Body>
                                    <Dropdown className="course-assignment-dropdown" align="end">
                                        <Dropdown.Toggle variant="light" className="course-assignment-button">
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => props.setRemove(item.id)}>
                                                {props.userType === "student" ? 
                                                    "Drop course" 
                                                : props.userType === "staff" ?
                                                    "Delete course"
                                                : ""}
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Card>
                            )
                        })}
                    </div>
                )
            }
        </div>
    )
}

export default CourseList;