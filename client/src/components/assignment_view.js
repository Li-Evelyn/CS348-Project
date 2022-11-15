import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AssignmentView(props) {
    

    useEffect(() => {
        console.log(props.assignment);
    }, [])
    return (
        <div className="course-page">
            <p>TODO</p>
            {/* <p>{props.assignment}</p> */}
        </div>
    )
}

export default AssignmentView;