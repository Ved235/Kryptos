const express = require("express");
const session = require('express-session');
const cors = require('cors');
const rateLimit = require("express-rate-limit");
const app = express();
app.use(session({
  secret: 'e84b0a9720e4198391ffce850d2acbf4d6f4ce3bf628f2ddc7d3f1e8ab328912', // Change this to a strong, random secret
  resave: false,
  saveUninitialized: true,
}));

const path = require("path");
const mongoose = require("mongoose");
const helmet = require("helmet");
const limiter = rateLimit({
  windowMs: 5000, // 1 minute
  max: 1, // Limit each IP to 100 requests per minute
});
// cronjobs
const powerupManager = require("./jobs/powerups");
powerupManager.start();
const cooldownManager = require("./jobs/cooldown");
cooldownManager.start();


// routes
const authRoute = require("./routes/auth");
const dashRoute = require("./routes/dashboard");
const boardRoute = require("./routes/leaderboard");
const admin = require("./routes/admin");
const questionRoute = require("./routes/questions");
const shopRoute = require("./routes/shop");
const gamble = require("./routes/questionsGamble");
const attackRoute = require("./controllers/attack");
const makerRoute = require("./controllers/questionMaker");
const buyRoute = require("./controllers/buy");
const defRoute = require("./controllers/defense");
const ansRoute = require("./controllers/answer");
const GambleansRoute = require("./controllers/answerGamble");
const jumpscareRoute = require("./routes/jumpscare");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const port = 5000 || process.env.PORT;
require("dotenv").config();

mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  () => {
    console.log("connected to db");
  }
);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());
app.use(express.json());
app.use(helmet({ contentSecurityPolicy: false }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/", ansRoute);
app.use("/", authRoute);
app.use("/", dashRoute);
app.use("/", boardRoute);
app.use("/", attackRoute);
app.use("/", makerRoute);
app.use("/", admin);
app.use("/", questionRoute);
app.use("/", shopRoute);
app.use("/", buyRoute);
app.use("/", defRoute);
app.use("/", jumpscareRoute);
app.use("/", gamble);
app.use("/", GambleansRoute);
app.use('/answer/',limiter);
app.get("/", (req, res) => {
  res.render("index.ejs", { active: "home" });
});

app.get("/register", (req, res) => {
  res.render("register.ejs", { active: "register" });
});

app.get("/login", (req, res) => {
  res.render("login.ejs", { active: "login" });
});

app.get("*", function (req, res) {
  res.status(404).render("404.ejs");
});

app.listen(port, () => console.log(`running on port ${port}`));
