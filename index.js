const express = require('express');
const cors = require("cors")
const mongoose = require("mongoose")
const app = express();
const nodemailer = require('nodemailer');

const PORT =5000;
app.use(cors());
app.use(express.json())

mongoose.connect("mongodb+srv://arun:arun123@cluster0.zgcjldn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(()=>{console.log("mongodb connect")})
.catch(()=>{console.log("db connect fail")})

const Contact = mongoose.model("Contact",{name:String,email:String,message:String},"contact")

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'delishkumar800@gmail.com',         
    pass: 'uamj nmry repl qdnn'             
  }
});


app.post('/api/user', async (req, res) => {

  try{
  const user = new Contact({name:req.body.name,
    email:req.body.email,message:req.body.message
  })
 await user.save().then(()=>{console.log("saved")}).catch(()=>{console.log("save fail")})
  const mailOptions = {
    from: 'delishkumar800@gmail.com',
    to: 'delishkumar39@gmail.com', // or any recipient
    subject: 'New Contact Form Submission',
    text: `
      Name: ${req.body.name}
      Email: ${req.body.email}
      Message: ${req.body.message}
    `
  };

await transporter.sendMail(mailOptions);}
catch(error){
  console.log("email send fail")
}



});



// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error to console
  res.status(500).send('Something went wrong!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
