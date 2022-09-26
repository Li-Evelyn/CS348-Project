import React, { useEffect, useState } from 'react';
import { Button, Form, Table } from 'react-bootstrap';

function DebugPage() {
  const [columns, setColumns] = useState([]);
  const [content, setContent] = useState([]);
  const [text, setText] = useState("");

  const deleteData = e => {
    e.preventDefault();
    fetch("http://localhost:8080/delete", {
        method: 'POST',
        mode: 'cors',
        body: ""
    })
    // .then((response) => response.json())
    // .then((result) => {
    //     console.log(result)
    // })
    window.location.reload(false);
  }

  const sendData = e => {
    e.preventDefault();
    const b = {'content': text};
    fetch("http://localhost:8080/", {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify(b)
    })
    // .then((response) => response.json())
    // .then((result) => {
    //     console.log(result)
    // })
    window.location.reload(false);   
  }

  function fetchData() {
    fetch("http://localhost:8080/query/all")
    // fetch("/query")
        .then((response) => response.json())
        .then((data) => {
            let db_content = data.rows.map((item) => [item.id, item.content]);
            setContent(db_content);
        });
  }

  function fetchColumns() {
    fetch("http://localhost:8080/query/columns")
        .then((response) => response.json())
        .then((data) => {
            let db_columns = data.rows.map((item) => item.column_name);
            setColumns(db_columns)
        });
  }

  useEffect(() => {
    console.log(`Page loaded`);
    fetchData();
    fetchColumns();
  }, [""]);

  return (
    <>
        <div style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
            <h1 >Database</h1>
            <Button variant="danger" style={{height: '80%'}} onClick={deleteData}>Reset Table</Button>
        </div>
        <Table striped>
            <thead>
                <tr>
                    {columns.map((item) => {
                        return <th>{item}</th>
                    })}
                </tr>
            </thead>
            <tbody>
                {content.map((item) => {
                    return (
                        <tr>
                            {item.map((i) => {
                                return <td>{i}</td>
                            })}
                        </tr>
                    )
                })} 
            </tbody>
        </Table>
        <Form onSubmit={sendData}>
            <Form.Group controlId="text">
                <Form.Label>Content</Form.Label>
                <Form.Control type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter content"/>
                <Form.Text className="text-muted">Keep at it! ✨</Form.Text>
            </Form.Group>
            <Button variant="secondary" type="submit">Submit</Button>
        </Form>
    </>
  );
}

export default DebugPage;
