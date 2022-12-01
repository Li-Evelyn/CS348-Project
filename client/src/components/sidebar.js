import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Sidebar(props) {
    let navigate = useNavigate();

    // TODO: if on a course page, keep active item highlighted
    return (
        <div className="sidebar">
            <h3 className="medium sidebar-item clickable" onClick={() => navigate('/student/courses')}>Courses</h3>
            <div>
                {props.courses.map((item, i) =>
                    <p
                        key={i}
                        className={`medium sidebar-item link clickable ${props.activeCourse && item.id === props.activeCourse.id ? "sidebar-active" : ""}`}
                        onClick={() => props.handleCourseSelect(item)}>
                            {item.name}
                    </p>
                )}
            </div>
        </div>
    )
}

export default Sidebar;