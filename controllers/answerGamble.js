const router = require("express").Router();
const verify = require("../middleware/tokenVerification");
const Team = require("../models/Team");
const Log = require("../models/Log");
const Questions = require("../models/QuestionsGamble");

require("dotenv").config();

router.post("/answerGamble/", verify, async (req, res) => {
  try {
    let ans = req.body.ans;
    if (ans === "") {
      ans = " ";
    }

    // Save initial log
    const activity = new Log({
      qtitle: req.body.title,
      sol: ans,
      solver: req.team.email,
    });
    await activity.save();

    const question = await Questions.findOne({
      answer: req.body.ans,
      title: req.body.title,
    });
    const buyer = await Team.findOne({ _id: req.team._id });

    if (!question) {
      if (buyer.jumpscare === true) {
        return res.send(`
          <html>
            <body style="background-color: black">
              <img src="https://gifdb.com/images/high/huggy-wuggy-jumpscare-lnvrp48ny1ask4xq.webp" width="100%" height="100%"/>
              <script>
                setTimeout(() => {
                  window.location.href = "/questions";
                }, 2000);
              </script>
            </body>
          </html>
        `);
      } else {
        return res.redirect("/gamble/");
      }
    } else if (question && buyer.gamble === true) {
      const successActivity = new Log({
        qtitle: question.title,
        sol: ans,
        solver: req.team.email,
        success: true,
      });
      await successActivity.save();

      let point = 0;
      if (buyer.powerupTimer >= 15) {
        point += 200;
      } else if (buyer.powerupTimer > 0) {
        point += 100;
      }

      await Team.updateOne(
        { _id: req.team._id },
        {
          $push: { questionsGamble: question.title },
          $set: { gamble: false, timestamp: new Date().getTime() },
          $inc: { fp: point },
        }
      );
      return res.redirect("/questions");
    } else {
      return res.redirect("/questions");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});

module.exports = router;