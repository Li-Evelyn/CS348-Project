const request = require("supertest");

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
    const res = await request('http://localhost:8080').get('/login?email=fmatczak5@yandex.ru&pw=bQyx9pqubLSl')
    const data = res.body.rows[0]
    expect(res.status).toBe(200)

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
    expect(res.status).toBe(200)
    console.log(data)
    expect(data[0].id).toBe(11)
    expect(data[1].id).toBe(9)
    expect(data[2].id).toBe(7)
    expect(data[3].id).toBe(14)
    expect(data[4].id).toBe(5)
})