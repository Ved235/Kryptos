const router = require("express").Router();
const verify = require("../middleware/tokenVerification");

router.get("/jumpscare", verify, (req, res) => {
  var error = req.query.error;
  res.render("jumpscare.ejs", {
    team: req.team,
    error: error,
    active: "jumpscare",
  });
});

module.exports = router;