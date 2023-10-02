const router = require("express").Router();
const verify = require("../middleware/tokenVerification");
const Questions = require("../models/QuestionsGamble");


router.get("/gamble", verify, (req, res) => {
  if(req.team.gamble === true){
    Questions.find({})
    .sort({ qnum: "asc" })
    .exec(function (err, docs) {
      if (err) {
        console.log(err);
      }
      res.render("gamble.ejs", {
        team: req.team,
        curr: req.query.question,
        questions: docs,
        active: "questions",
      });
    });
  }
  else{
    res.redirect("/questions");
  }

});

module.exports = router;
