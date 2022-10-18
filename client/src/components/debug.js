import React, { useEffect, useState } from 'react';
import { Table, Dropdown, DropdownButton } from 'react-bootstrap';

const tables = [
    '"User"',
    "Course",
    "Teaches",
    "EnrolledIn",
    "Assignment",
    "Question",
    "File",
    "QuestionSubmission",
    "AssignmentSubmission",
    "test"
]

function DebugPage() {
  const [columns, setColumns] = useState([]);
  const [content, setContent] = useState([]);
  const [relation, setRelation] = useState('"User"');

  function fetchData() {
    console.log(`fetching data for table ${relation} with columns ${columns}`);
    fetch(`http://localhost:8080/query/all?table=${relation}`)
        .then((response) => response.json())
        .then((data) => {
            console.log(`data: ${JSON.stringify(data.rows)}`)
            let db_content = data.rows.map((item) => {
                let ret = [];
                for (var key in columns) {
                    // console.log(columns[key])
                    ret.push(item[columns[key]]);
                }
                console.log(`ret is ${ret}`)
                return ret;
            });
            setContent(db_content);
        });
    console.log(`content is ${content}`)
  }

  function fetchColumns() {
    fetch(`http://localhost:8080/query/columns?table=${relation}`)
        .then((response) => response.json())
        .then((data) => {
            let db_columns = data.rows.map((item) => item.column_name);
            setColumns(db_columns)
        });
  }

  useEffect(() => {
    console.log(`Page loaded`);
    // fetchColumns();
    // fetchData();
    document.title = "Debug";
  }, [""]);

  useEffect(() => {
    fetchColumns();
  }, [relation])

  useEffect(() => {
    fetchData();
  }, [columns])

  return (
    <>
        <div style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
            <h1>Database Viewer</h1>
            <DropdownButton title={relation} style={{height: '80%'}}>
                {tables.map((item, i) => {
                    return <Dropdown.Item onClick={() => setRelation(item)}>{item}</Dropdown.Item>
                })}
            </DropdownButton>
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
        {/* <Form onSubmit={sendData}>
            <Form.Group controlId="text">
                <Form.Label>Content</Form.Label>
                <Form.Control type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter content"/>
                <Form.Text className="text-muted">Keep at it! ✨</Form.Text>
            </Form.Group>
            <Button variant="secondary" type="submit">Submit</Button>
        </Form> */}
    </>
  );
}

export default DebugPage;
