import mongoose from "mongoose";
import app from "../../app.js";
import User from "../../models/User.js";
import request from 'supertest';

const {DB_HOST_TEST, PORT} = process.env;


describe("test login route", ()=>{
    let server = null;
    beforeAll(async()=>{
        await mongoose.connect(DB_HOST_TEST);
       server =  app.listen(PORT);
    })

    afterAll(async()=>{
        await mongoose.connection.close();
        server.close();
    })

    test("the response should return a 200 status code, token and user object with email and subscription as strings ", async()=>{
        const responseData = {

            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MGQ0NTdmOWU5NTA5NzM1YzBjMmU4YyIsImlhdCI6MTY5NTM3MzkzNSwiZXhwIjoxNjk1NTQ2NzM1fQ.s1EjLjOTLA5jTckdwxmcatgKHeNI53aeN3_xUWnh6hs",
            user: {
                email: "gabriella13@gmail.com",
                subscription: "starter"
            }
        }

        const {statusCode, body} = await request(app).post("/api/users/login").send(responseData);
      
       expect(statusCode).toBe(200);  //перевіряє чи відповідь приходить зі  статусом 200
        expect(body.token).toBeDefined(); // чи повертається токен
        expect(body.token).toBe(responseData.token); // чи співпадає токен
        expect(typeof body.user.email).toBe('string'); // чи  user.емail  є рядком
        expect(typeof body.user.subscription).toBe('string'); //чи  user.subscription  є рядком
        
        

        const user = await User.findOne({email: responseData.user.email})
        expect(user.email).toBe(responseData.user.email)

    })

   
})