import mongoose from "mongoose";
import app from "./app.js";

// const DB_HOST = 'mongodb+srv://Gabriella:MkrzUBn7szgS0Tt6@cluster0.i5vmm9f.mongodb.net/db-contacts?retryWrites=true&w=majority'
const {DB_HOST, PORT=3000}=process.env;

mongoose.connect(DB_HOST)
 .then(()=>{
  app.listen(PORT, () => {
    console.log("Database connection successful")
    console.log(`Server running. Use our API on port: ${PORT} `)
    
  })
 })
 .catch(error =>{
console.log(error.message);
process.exit(1);
 })

console.log(process.env)
const key = 'MkrzUBn7szgS0Tt6';
// mongodb+srv://Gabriella:MkrzUBn7szgS0Tt6@cluster0.i5vmm9f.mongodb.net/