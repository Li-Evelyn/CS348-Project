import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Home() {
  // const [content, setContent] = useState([]);
  let navigate = useNavigate();
  // grabs all data from the test database and outputs it, delimited by a space
  // function fetchData() {
  //   fetch("http://localhost:8080/query/all")
  //   // fetch("/query")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       let db_content = data.rows.map((item) => item.content).join(" ");
  //       setContent(db_content);
  //     });
  // }

  useEffect(() => {
    console.log(`Page loaded`);
    // fetchData();
  }, [""]);

  return (
    <div className="App">
      <div class="container homepage">
        <h1 class="splash">GenericMark</h1>
        <div class="splash container homebuttoncontainer">
          <Button variant="Light" size="lg" className="homebutton" onClick={() => {navigate('/login')}}>Login</Button>
          <Button variant="Light" size="lg" className="homebutton" onClick={() => {navigate('/register')}}>Register</Button>
        </div>
      </div>
    </div>
  );
}

export default Home;
