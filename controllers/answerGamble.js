const router = require("express").Router();
const verify = require("../middleware/tokenVerification");
const Team = require("../models/Team");
const Log = require("../models/Log");
const Questions = require("../models/QuestionsGamble");
const mongoose = require("mongoose");

require("dotenv").config();

router.post("/answerGamble/", verify, async (req, res) => {
  var ans = " ";
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
    res.send(error);
  }
  const question = await Questions.findOne({
    answer: req.body.ans,
    title: req.body.title,
  }).catch((err) => {
    console.log(err);
  });
  const buyer = await Team.findOne({ _id: req.team._id });
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
      res.redirect("/gamble/");
    }
   
  } else if (question && buyer.gamble === true) {
    const activity = new Log({
      qtitle: question.title,
      sol: req.body.ans,
      solver: req.team.email,
      success: true,
    });
    try {
      const logged = await activity.save();
    } catch (error) {
      res.send(error);
    }
    var point = 0;
    if(buyer.powerupTimer >= 15){
      point = point + 200;
    }
    else if(buyer.powerupTimer >= 10){
      point = point + 100;
    }
    Team.updateOne(
      { _id: req.team._id },
      {
        $push: { questionsGamble: question.title },
        gamble: false,
        $inc: { fp: point },
        $set:{
          timestamp: new Date().getTime()
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
  else{
    res.redirect("/questions");
  }
});

module.exports = router;
