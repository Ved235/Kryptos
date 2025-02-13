const router = require("express").Router();
const verify = require("../middleware/tokenVerification");
const Team = require("../models/Team");
const Log = require("../models/Log");
const Questions = require("../models/Questions");
const rateLimit = require("express-rate-limit");

// Define the rate limit options
const apiLimiter = rateLimit({
  windowMs: 5000, // 5 seconds window  
  max: 1, // Limit each IP to 1 request within the window
  message: "Too many requests from this IP, please try again later.",
});

require("dotenv").config();

router.post("/answer/", verify, apiLimiter, async (req, res) => {
  try {
    const buyer = await Team.findOne({ _id: req.team._id });
    const fppoints = buyer.questions.length;
    let ans = req.body.ans;
    if (ans === "") {
      ans = " ";
    }

    // Save log of the answer attempt
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

    if (!question) {
      if (buyer.jumpscare === true) {
        return res.send(`
          <html>
            <body style="background-color: black">
              <video autoplay>
                <source src="https://cdn.discordapp.com/attachments/990559782844899418/1159899773151744070/Bonnie_that_Punch_online-video-cutter.com.mp4?ex=6532b3d7&is=65203ed7&hm=4b0fee5368b1a04ebb3cb2e3ac88531c026ab36205d757dcc2c5a1fd097c4e49&">
              </video>
              <script>
                setTimeout(() => {
                  window.location.href = "/questions";
                }, 4000);
              </script>
            </body>
          </html>
        `);
      } else {
        return res.redirect("/questions/?question=" + req.body.title);
      }
    } else if (question && !buyer.questions.includes(question.title)) {
      const successActivity = new Log({
        qtitle: question.title,
        sol: ans,
        solver: req.team.email,
        success: true,
      });
      await successActivity.save();

      const timeNow = new Date().getTime();
      await Team.updateOne(
        { _id: req.team._id },
        {
          $addToSet: { questions: question.title },
          $inc: { bp: question.points },
          $set: {
            fp: 400 * (fppoints + 1) + 100 * buyer.questionsGamble.length,
            timestamp: timeNow,
          },
        }
      );
      return res.redirect("/questions");
    } else {
      return res.redirect("/questions");
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Server error");
  }
});

module.exports = router;