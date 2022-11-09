import React from 'react';
import { useNavigate } from 'react-router-dom';

function Sidebar(props) {    
    let navigate = useNavigate();

    // TODO: if on a course page, keep active item highlighted
    return (
        <div className="sidebar">
            <h3 className="medium sidebar-item" onClick={() => navigate('/student/courses')}>Courses</h3>
            <div>
                {props.courses.map((item, i) =>
                    <p
                        key={i}
                        className="medium sidebar-item link clickable"
                        onClick={() => navigate(`${props.getLink(item.name)}`)}>
                            {item.name}
                    </p>
                )}
            </div>
        </div>
    )
}

export default Sidebar;