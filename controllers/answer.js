const router = require("express").Router();
const verify = require("../middleware/tokenVerification");
const Team = require("../models/Team");
const Log = require("../models/Log");
const Questions = require("../models/Questions");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");

// Define the rate limit options (adjust as needed)
const apiLimiter = rateLimit({
  windowMs: 5000, // 11 seconds window (slightly more than your setTimeout)
  max: 1, // Limit each IP to 1 request within the window
  message: "Too many requests from this IP, please try again later.",
});

require("dotenv").config();

router.post("/answer/", verify, apiLimiter, async (req, res) => {
  let fppoints = 0;
  let bppoints = 0;
 
  const buyer = await Team.findOne({ _id: req.team._id });
  fppoints = buyer.questions.length;


  const ans = req.body.ans;
  

  // Check if this user has already answered the same question within the rate limit window


  if (false) {
    res.send("You have already answered this question within the rate limit window.");
  } else {
    const activity = new Log({
      qtitle: req.body.title,
      sol: ans,
      solver: req.team.email,
    });
    try {
      const logged = await activity.save();
     
    } catch (error) {
      console.error("Error saving log:", error);
      res.status(500).send("Error saving log");
    }
    //save a log of the question and answer in the database write code


    
    const question = await Questions.findOne({
      answer: req.body.ans,
      title: req.body.title,
    }).catch((err) => {
      console.log(err);
    });

    if (!question) {
      if (buyer.jumpscare === true) {
        res.send(`
        <html>
        <body style="background-color: black">
          <video autoplay>
            <source src="https://cdn.discordapp.com/attachments/990559782844899418/1159899773151744070/Bonnie_that_Punch_online-video-cutter.com.mp4?ex=6532b3d7&is=65203ed7&hm=4b0fee5368b1a04ebb3cb2e3ac88531c026ab36205d757dcc2c5a1fd097c4e49&">
          </video>
          <script>
            setTimeout(function () {
              window.location.href = "/questions";
            }, 4000);
          </script>
        </body>
      </html>
        `);
      } else {
        res.redirect("/questions/?question=" + req.body.title);
      }
    } else if (question && !buyer.questions.includes(question.title)) {
    
      const activity = new Log({
        qtitle: question.title,
        sol: ans,
        solver: req.team.email,
        success: true,
      
      });
      try {
        const logged = await activity.save();
      } catch (error) {
        res.send("noobs");
      }
      const timeNow = new Date().getTime();
      Team.updateOne(
        { _id: req.team._id },
        {
          $addToSet: { questions: question.title },
          $inc: { bp: question.points },
          $set: {
            fp: 400*(fppoints + 1),
            timestamp: timeNow
          }
        },
        { multi: true },
        (err, num) => {
          if (err) {
            console.log(err);
          }
        }
      );

      res.redirect("/questions");
    }
  }
});

module.exports = router;
