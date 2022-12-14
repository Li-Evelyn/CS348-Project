import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const navigateTo = {
	student: '/student/courses',
	staff: '/staff/courses',
	admin: '/debug'
}

function Home(props) {
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

    const isAuthed = localStorage.getItem("authenticated");
	if (isAuthed) {
		const user_type = localStorage.getItem("user_type");
		navigate(`${navigateTo[user_type]}`);
	}
  }, [""]);

  return (
    <div className="App">
      <div className="container homepage">
        <h1 className="splash splash-title">GenericMark</h1>
        <div className="splash medium container homebuttoncontainer">
          <Button variant="Light" size="lg" className="homebutton" onClick={() => {navigate('/login')}}>Login</Button>
          <Button variant="Light" size="lg" className="homebutton" onClick={() => {navigate('/register')}}>Register</Button>
        </div>
      </div>
    </div>
  );
}

export default Home;
