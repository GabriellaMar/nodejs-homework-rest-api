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

    test("the response should return a 200 status code, token and user object with email and subscription as strings", async () => {
        const loginData = {
            email: "gabriellamar@gmail.com", 
            password: "99999999", 
        };
    
        const response = await request(app).post("/api/users/login").send(loginData);
    
        expect(response.statusCode).toBe(200); //перевіряє чи відповідь приходить зі  статусом 200
        expect(response.body.token).toBeDefined(); // чи повертається токен
        expect(typeof response.body.user.email).toBe('string'); // чи  user.емail  є рядком
        expect(typeof response.body.user.subscription).toBe('string'); //чи поле user.subscription  є рядком
    
        const user = await User.findOne({ email: loginData.email });
        expect(user.email).toBe(loginData.email);
    });

   
})