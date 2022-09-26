import React, { useEffect, useState } from 'react';

function Home() {
  const [content, setContent] = useState([]);

  function fetchData() {
    fetch("http://localhost:8080/query/all")
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
