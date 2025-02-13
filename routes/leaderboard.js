const router = require("express").Router();
const verify = require("../middleware/tokenVerification");
const Team = require("../models/Team");

router.get("/leaderboard", verify, async (req, res) => {
  try {
    const success = req.query.success;
    const allteams = await Team.find({}).sort({ fp: "desc", timestamp: "asc" });
    res.render("leaderboard.ejs", {
      team: req.team,
      allteams,
      active: "leaderboard",
      success,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.get(
  "/questions/shop/leaderboard/dashboard/supersecretpage",
  verify,
  (req, res) => {
    res.render("flag.ejs");
  }
);

router.get("/leaderboardout", async (req, res) => {
  try {
    const allteams = await Team.find({}).sort({ fp: "desc", timestamp: "asc" });
    res.render("leaders.ejs", { active: "leaderboard", allteams });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;