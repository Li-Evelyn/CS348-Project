const request = require("supertest");
const shajs = require('sha.js');

test('Getting User by ID', async () => {
    const res = await request('http://localhost:8080').get('/user?id=10')

    const data = res.body.rows[0]
    expect(res.status).toBe(200)
    expect(data)
    expect(data.name).toBe("Gwyneth D'Aguanno")
    expect(data.email).toBe("gdaguannolt@springer.com")
    expect(data.type).toBe('admin')
});

test('Login Success', async () => {
    const a = shajs('sha256').update('bQyx9pqubLSl').digest('hex')
    console.log(a)
    const email = 'fmatczak5@yandex.ru'
    const password = 'c34a98165b0eb5686c4a1c30b2dee597318d55749c2bc4e61f576c8bbe6915db'
    const res = await request('http://localhost:8080').get(`/login?email=${email}pw=${password}`)
    const data = res.body.rows[0]
    expect(res.status).toBe(200)
    console.log(res.body)
    expect(data.name).toBe("Faith Matczak")
    expect(data.email).toBe("fmatczak5@yandex.ru")
    expect(data.type).toBe('admin')
});

test('Login Failure', async () => {
    const res = await request('http://localhost:8080').get('/login?email=fmatczak5@yandix.ru&pw=bQyx9pqubLSl')
    const data = res.body.rows[0]
    expect(res.status).toBe(200)
    expect(data).toBe(undefined)
});

test('Student View Courses', async () => {
    const res = await request('http://localhost:8080').get('/courses?uid=350&userType=student')
    const data = res.body.rows
    expect(res.status).toBe(200)
    
    expect(data[0].id).toBe(11)
    expect(data[1].id).toBe(12)
})

test('Staff View Courses', async () => {
    const res = await request('http://localhost:8080').get('/courses?uid=110&userType=staff')
    const data = res.body.rows
    console.log(data)
    expect(res.status).toBe(200)
    expect(data[0].id).toBe(11)
    expect(data[1].id).toBe(9)
    expect(data[2].id).toBe(7)
    expect(data[3].id).toBe(14)
    expect(data[4].id).toBe(5)
})

test('Unenroll in class', async () => {
    const res = await request('http://localhost:8080').get('/unenroll?uid=153&course=1')
    const res2 = await request('http://localhost:8080').get('/courses?uid=153&userType=student')
    const data2 = res2.body.rows
    expect(data2[0]).toBe(undefined)
    const res3 = await request('http://localhost:8080').get('/enrollinto?uid=153&cid=1')
    const res4 = await request('http://localhost:8080').get('/courses?uid=153&userType=student')
    const data4 = res4.body.rows
    expect(data4[0].id).toBe(1)
    expect(data4[0].name).toBe('CS 135')
})

test('Set Assignment Grade', async () => {
    const res = await request('http://localhost:8080').get('/updateassignmentgrade?grade=40&aid=1&uid=126')
    const res2 = await request('http://localhost:8080').get('/assignmentsubmissions?uid=126')
    const  data = res2.body.rows
    expect(data[2].grade).toBe(40)
    const res3 = await request('http://localhost:8080').get('/updateassignmentgrade?grade=30&aid=1&uid=126')
    const res4 = await request('http://localhost:8080').get('/assignmentsubmissions?uid=126')
    const data2 = res4.body.rows
    expect(data2[2].grade).toBe(30)
})

test('Calculate Assignment Average', async () => {
    const res = await request('http://localhost:8080').get('/submissioninfofromassignment?aid=18')
    const data = res.body.rows
    let sum = 0
    for (const i in data) {
        sum = data[i].grade ? sum + data[i].grade : sum
    }
    avg = (sum / data.length)
    expect(avg).toBe(23)
})