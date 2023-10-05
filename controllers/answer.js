  const router = require("express").Router();
  const verify = require("../middleware/tokenVerification");
  const Team = require("../models/Team");
  const Log = require("../models/Log");
  const Questions = require("../models/Questions");
  const mongoose = require("mongoose");

  require("dotenv").config();

  router.post("/answer/", verify, async (req, res) => {
    let fppoints = 0;
    let bppoints = 0;
    var ans = " ";
    const buyer = await Team.findOne({ _id: req.team._id });
    fppoints = buyer.questions.length;

    if(req.body.ans !== ""){
      ans = req.body.ans;
    }

    const activity = new Log({
      qtitle: req.body.title,
      sol: ans,
      solver: req.team.email,
    });
    try {
      const logged = await activity.save();
    } catch (error) {
      res.send("noobs");
    }
    const question = await Questions.findOne({
      answer: req.body.ans,
      title: req.body.title,
    }).catch((err) => {
      console.log(err);
    });
    if (!question) {
      
     
      
      if(buyer.jumpscare === true){
      
        res.send(`
        <html>
          <body style="background-color: black">
            <img src = "https://gifdb.com/images/high/huggy-wuggy-jumpscare-lnvrp48ny1ask4xq.webp" width="100%" height="100%"/>
            <script>
              setTimeout(function () {
                window.location.href = "/questions";
              }, 2000);
            </script>
          </body>
        </html>
      `);
      }
      else{
        res.redirect("/questions/?question=" + req.body.title);
      }
    
    } else if (question && !buyer.questions.includes(question.title)) {
      const activity = new Log({
        qtitle: question.title,
        sol: req.body.ans,
        solver: req.team.email,
        success: true,
      });
      try {
        const logged = await activity.save();
      } catch (error) {
        res.send("noobs");
      }
      Team.updateOne(
        { _id: req.team._id },
        {
          $addToSet: { questions: question.title },
          $inc: { bp: question.points},
          $set: {
            fp : fppoints+1
          }
        },
        { multi: true },
        answercallback
      );
      function answercallback(err, num) {
        if (err) {
          console.log(err);
        }
      }

      res.redirect("/questions");
    }
  });

  module.exports = router;
