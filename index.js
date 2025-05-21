const express = require('express');
const cors = require("cors")
const mongoose = require("mongoose")
const app = express();
const nodemailer = require('nodemailer');

const PORT =5000;
app.use(cors());
app.use(express.json())

mongoose.connect("mongodb+srv://arun:arun123@cluster0.zgcjldn.mongodb.net/form?retryWrites=true&w=majority&appName=Cluster0").then(()=>{console.log("mongodb connect")})
.catch(()=>{console.log("db connect fail")})

const Contact = mongoose.model("Contact",{name:String,email:String,message:String},"contact")

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'delishkumar800@gmail.com',         
    pass: 'resh bvad hpbe yrps'             
  }
});


app.post('/api/user', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const user = new Contact({ name, email, message });

    await user.save()
      .then(() => console.log("User saved to DB"))
      .catch((err) => {
        console.error("Save failed:", err);
        return res.status(500).send("Database save failed");
      });

    const mailOptions = {
      from: 'delishkumar800@gmail.com',
      to: 'delishkumar39@gmail.com',
      subject: 'New Contact Form Submission',
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).send("Successful");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Email send failed");
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
