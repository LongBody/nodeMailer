//env var

const express = require('express')
const app = express()
    // const port = 9000 ||
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")
const session = require("express-session")
let ejs = require('ejs');

var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.set("view engine", "ejs")
app.set("views", "./views")



const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper




app.get('/user', urlencodedParser, (req, res) => {
    res.render("user")
})

app.post('/user', urlencodedParser, (req, res) => {
    console.log(req.body.email)


    let user = `
    <!doctype html>
    <html lang="en">
      <head>
        <title>Title</title>
        <!-- Required meta tags -->
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    
        <!-- Bootstrap CSS -->
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
      </head>
      <body>
          
        <!-- Optional JavaScript -->
        <!-- jQuery first, then Popper.js, then Bootstrap JS -->
         <div>You have a contact from LongBody</div>
        <p></p>
        <p></p>
        <div>Name: ${req.body.name}</div>
        <div>Email: ${req.body.email}</div>
        <p></p>
        <a name="" id="" class="btn btn-success" href="https://www.facebook.com/longbody.nguyen/" role="button">Do you wanna make friends ?</a>
        <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
      </body>
    </html>
    `
    async function main() {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'nguyenthanhlong1120@gmail.com',
                pass: 'longnttbx30112k'
            }
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: 'nguyenthanhlong1120@gmail.com', // sender address
            to: req.body.email, // list of receivers
            subject: "Welcome " + req.body.name + " to my project", // Subject line
            text: "Hello " + req.body.name + " .Have a nice day", // plain text body
            html: user
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }

    main().catch(console.error);
    res.redirect('/')
})
app.use(bodyParser.json())
app.use((req, res, next) => {
    let info = `request coming'${req.method}','${req.path}'`;
    console.log(info);
    next();
})
app.use((err, req, res, next) => {
    let message = err.message;
    let code = 500
    res.status(code).json({ message })
})
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: "my secret string",
    cookie: { maxAge: 60 * 60 * 1000 * 6 }
}))


app.use(cookieParser("my secret string 1"))


// app.get('/', (req, res) => {
//     let reqId = req.cookies.id
//     if (!reqId) {
//         let id = Date.now();
//         res.cookie('id', id)
//     }
//     res.send("Your id is : " + reqId)
// })


// app.get('/', (req, res) => {
//     let reqId = req.session.myId
//     if (!reqId) {
//         req.session.myId = Date.now();
//     }
//     res.send("Your id is : " + reqId)
// })

app.get('/', (req, res) => {
    let reqCount = req.session.reqCount
    if (!reqCount) {
        reqCount = 0
    }
    req.session.reqCount = reqCount + 1;
    if (req.session.reqCount >= 20) {
        throw new Error("You have much time request server")
    } else {
        res.send("Your request :" + req.session.reqCount + " times!")
    }

})




app.post('/test-body', (req, res) => {
    console.log("request coming with body ", req.body)
    res.json({ message: "hello" })
})

app.post('/test', (req, res) => {
    console.log("request coming with body ", req.cookies)
    console.log("request coming with body ", req.session)
    res.json({ message: "hello" })
})

app.listen(process.env.PORT, '0.0.0.0', () => {
    console.log('listening on *:3000');
});