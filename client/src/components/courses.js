import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Dropdown } from 'react-bootstrap';

function CourseList(props) {
    let navigate = useNavigate()

    return (
        <div className="course-page">
            {
                props.courses.length === 0
                ? <h2>No courses to display.</h2>
                : (
                    <div className="course-container">
                        {props.courses.map((item, i) => {
                            return (
                                <Card className="course-card" key={item.id}>
                                    <Card.Body className="course-body clickable" onClick={() => navigate(`${props.getLink(item.name)}`)}>{item.name}</Card.Body>
                                    <Dropdown className="course-dropdown" align="end">
                                        <Dropdown.Toggle variant="light" className="course-button">
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => props.setRemove(item.id)}>Drop course</Dropdown.Item>
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