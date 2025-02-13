const router = require("express").Router();
const verify = require("../middleware/tokenVerification");
const Questions = require("../models/Questions");

router.get("/questions", verify, async (req, res) => {
  if (req.team.gamble === true) {
    return res.redirect("/gamble");
  }
  try {
    const docs = await Questions.find({}).sort({ qnum: "asc" });
    res.render("questions.ejs", {
      team: req.team,
      curr: req.query.question,
      questions: docs,
      active: "questions",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;