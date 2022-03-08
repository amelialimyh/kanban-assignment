const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
require('./dbServer');
const app = express();
const port = 3000;


// Inititalize the app and add middleware
app.set('view engine', 'pug'); // Setup the pug
app.use(bodyParser.urlencoded({extended: true})); // Setup the body parser to handle form submits
app.use(session({secret: 'super-secret'})); // Session setup


/** Handle login display and form submit */
app.get('/login', (req, res) => {
  if (req.session.isLoggedIn === true) {
    return res.redirect('/');
  }
  res.render('login', {error: false});
});


app.post('/login', (req, res) => {
  const {username, password} = req.body;
  if (username === 'bob' && password === '1234') {
    req.session.isLoggedIn = true;
    res.redirect(req.query.redirect_url ? req.query.redirect_url : '/');
  } else {
    res.render('login', {error: 'Username or password is incorrect'});
  }
});


/** Handle logout function */
app.get('/logout', (req, res) => {
  req.session.isLoggedIn = false;
  res.redirect('/');
});


/** Simulated bank functionality */
app.get('/', (req, res) => {
  res.render('index', {isLoggedIn: req.session.isLoggedIn});
});


app.get('/balance', (req, res) => {
  if (req.session.isLoggedIn === true) {
    res.send('Your account balance is $1234.52');
  } else {
    res.redirect('/login?redirect_url=/balance');
  }
});


app.get('/account', (req, res) => {
  if (req.session.isLoggedIn === true) {
    res.send('Your account number is ACL9D42294');
  } else {
    res.redirect('/login?redirect_url=/account');
  }
});


app.get('/contact', (req, res) => {
  res.send('Our address : 321 Main Street, Beverly Hills.');
});


//CREATE USER
app.post("/createUser", async (req,res) => {
  const user = req.body.name;
  const hashedPassword = await bcrypt.hash(req.body.password,10);

  db.getConnection( async (err, connection) => {
     if (err) throw (err)
        const sqlSearch = "SELECT * FROM userTable WHERE user = ?"
        const search_query = mysql.format(sqlSearch,[user])
        const sqlInsert = "INSERT INTO userTable VALUES (0,?,?)"
        const insert_query = mysql.format(sqlInsert,[user, hashedPassword])
     await connection.query (search_query, async (err, result) => {
        if (err) throw (err)
           console.log("------> Search Results")
           console.log(result.length)
        if (result.length != 0) {
           connection.release()
           console.log("------> User already exists")
           res.sendStatus(409) 
        } 
     else {
        await connection.query (insert_query, (err, result)=> {
        connection.release()
        if (err) throw (err)
           console.log ("--------> Created new User")
           console.log(result.insertId)
           res.sendStatus(201)
        })
     }
  }) 
}) 
})


//LOGIN (AUTHENTICATE USER)
app.post("/login", (req, res)=> {
  const user = req.body.name
  const password = req.body.password
  db.getConnection ( async (err, connection)=> {
   if (err) throw (err)
   const sqlSearch = "Select * from userTable where user = ?"
   const search_query = mysql.format(sqlSearch,[user])
   await connection.query (search_query, async (err, result) => {
    connection.release()
    
    if (err) throw (err)
    if (result.length == 0) {
     console.log("--------> User does not exist")
     res.sendStatus(404)
    } 
    else {
       const hashedPassword = result[0].password
       //get the hashedPassword from result
      if (await bcrypt.compare(password, hashedPassword)) {
      console.log("---------> Login Successful")
      res.send(`${user} is logged in!`)
      } 
      else {
      console.log("---------> Password Incorrect")
      res.send("Password incorrect!")
      }
    }
   })
  })
})


const port = process.env.PORT
app.listen(port, 
()=> console.log(`Server Started on port ${port}...`))