import React, { useEffect, useState } from 'react';
import './App.css';

function Home() {
  const [content, setContent] = useState([]);

  function fetchData() {
    fetch("http://localhost:8080/query")
    // fetch("/query")
      .then((response) => response.json())
      .then((data) => {
        let db_content = data.rows.map((item) => item.content).join(" ");
        setContent(db_content);
      });
  }

  useEffect(() => {
    console.log(`Page loaded`);
    fetchData();
  }, [""]);

  console.log(`content: ${content}`)

  return (
    <div className="App">
      <header className="App-header">
        <p>
          { content }
        </p>
      </header>
    </div>
  );
}

export default Home;
