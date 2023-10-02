const router = require("express").Router();
const verify = require("../middleware/tokenVerification");
const Team = require("../models/Team");

router.post("/attack", verify, async (req, res) => {
  const powerupattack = req.body.powerupType;

  try {
    const defender = await Team.findOne({ name: req.body.victimname });

    if (defender) {
      // Set the power-up in the session storage
      if(defender.attackCooldown == 0 && defender.hintspire == false && defender.gamble == false){

      await Team.updateOne(
        { email: defender.email },
        {
          $set: {
            [powerupattack]: true,
            attackCooldown: 60,
          },
        }
      );

      await Team.updateOne(
        { email: req.team.email },
        {
          $set: {
            powerupTimer: 60,
            dp: powerupattack
          },
          $inc: {
            bp: -1000,
          },
        }
      );

      res.redirect("/dashboard");
      }
      else{
        console.log("Already under attack");
        res.status(404).send("Victim already under attack");
      }
    } else {
      console.log("Victim not found");
      res.status(404).send("Victim not found");
    }
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
