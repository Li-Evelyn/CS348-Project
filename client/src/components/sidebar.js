import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Sidebar(props) {
    const [ac, setAc] = useState(null)
    let navigate = useNavigate();

    useEffect(() => {
        setAc(props.activeCourse)
    }, [props.activeCourse])

    // TODO: if on a course page, keep active item highlighted
    return (
        <div className="sidebar">
            <h3 className="medium sidebar-item clickable" onClick={() => navigate('/student/courses')}>Courses</h3>
            <div>
                {props.courses.map((item, i) =>
                    <p
                        key={i}
                        className={`medium sidebar-item link clickable ${ac && item.id === ac.id ? "sidebar-active" : ""}`}
                        onClick={() => props.handleCourseSelect(item)}>
                            {item.name}
                    </p>
                )}
            </div>
        </div>
    )
}

export default Sidebar;