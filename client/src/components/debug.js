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
    "AssignmentSubmission"
]

function DebugPage(props) {
  const [columns, setColumns] = useState([]);
  const [content, setContent] = useState([]);
  const [relation, setRelation] = useState('"User"');

  function fetchData() {
    fetch(`http://localhost:8080/query/all?table=${relation}`)
        .then((response) => response.json())
        .then((data) => {
            let db_content = data.rows.map((item) => {
                let ret = [];
                for (var key in columns) {
                    ret.push(item[columns[key]]);
                }
                return ret;
            });
            setContent(db_content);
        });
  }

  function fetchColumns() {
    fetch(`http://localhost:8080/query/columns?table=${relation}`)
        .then((response) => response.json())
        .then((data) => {
            let db_columns = data.rows.map((item) => item.column_name);
            setColumns(db_columns)
        }
    );
  }

  useEffect(() => {
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
                {tables.map((item) => {
                    return <Dropdown.Item onClick={() => setRelation(item)}>{item}</Dropdown.Item>
                })}
            </DropdownButton>
        </div>
        <Table striped>
            <thead>
                <tr>{columns.map((item) => <th>{item}</th>)}</tr>
            </thead>
            <tbody>
                {content.map((item) => <tr>{item.map((i) => <td>{i}</td>)}</tr>)} 
            </tbody>
        </Table>
    </>
  );
}

export default DebugPage;
