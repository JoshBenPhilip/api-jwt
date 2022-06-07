import functions from "firebase-functions";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import mySecretKey from "./secret.js";

// vitoria ghi789
//damian def456
//todd abc123

const users = [
  // fake database
  {
    id: 1,
    email: "todd@bocacode.com",
    password: "$2b$10$r7QjINHBd6tv/M6UgNs5muAY5vc2NS0woClsP9b2QPwEK49x7c/yG",
  },
  {
    id: 2,
    email: "damian@bocacode.com",
    password: "$2b$10$r7QjINHBd6tv/M6UgNs5muA67xV0yZTIjuLZyv1O9xGuFXht.ukQS",
  },
  {
    id: 3,
    email: "vitoria@bocacode.com",
    password: "$2b$10$r7QjINHBd6tv/M6UgNs5mu0XseAuWTpEyD9SSwbytE1EGJAJ5oXCq",
  },
];

const app = express();
app.use(cors());
app.use(express.json());

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  // check to see if that email and password exist in our db
  // if they do, create and send back a token
  // if they don't send back and error message
  let user = users.find(
    (user) => user.email === email && user.password === password
  );
  if (!user) {
    res.status(401).send({ error: "Invalid email or password" });
    return;
  }
  user.password = undefined; // remove password from the user object
  // now we want to sign / create a token...
  const token = jwt.sign(user, mySecretKey, { expiresIn: "1h" });
  res.send({ token });
});
app.get("/public", (req, res) => {
  res.send({ message: "Welcome!" }); // anyone can see this..
});
app.get("/private", (req, res) => {
  // let's require a valid token to see this
  const token = req.headers.authorization || "";
  if (!token) {
    res.status(401).send({ error: "You must be logged in to see this" });
    return;
  }
  jwt.verify(token, mySecretKey, (err, decoded) => {
    if (err) {
      res.status(401).send({ error: "You must use a valid token to see this" });
      return;
    }
    // here we know that the token is valid...
    res.send(`Welcome ${decoded.email}!`);
  });
});

app.listen(5050, () => {
  console.log("Express running...");
});

export const api = functions.https.onRequest(app);
