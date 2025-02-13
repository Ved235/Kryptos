const router = require("express").Router();
const verify = require("../middleware/tokenVerification");
const Team = require("../models/Team");
const crypto = require("crypto");

router.post("/powerup", verify, async (req, res) => {
  try {
    const admin = await Team.findOne({ email: "admin@admin.com" });
    const powerupAllowed = admin.dp;

    if (powerupAllowed === "false") {
      return res.send("Powerups are not allowed right now");
    }

    if (req.body.crys1 < 0) {
      return res.send("no");
    }

    let totalCost = req.body.crys1 * 1000;
    const buyer = await Team.findOne({ email: req.team.email });

    if (req.body.crys1 == 0) {
      return res.redirect("/shop/?error=buyless");
    }
    // Check for omega powerup (placeholder condition)
    if (false) {
      return res.redirect("/shop/?error=powerup");
    }
    if (buyer.powerupTimer > 0) {
      return res.redirect("/shop/?error=powerupcooldown");
    } else if (buyer.bp >= totalCost) {
      const setter = [req.body.crys1 === "1" ? true : false];
      const listOfPowerups = ["hintspire", "gamble", "jumpscare", "sabotage"];
      let powerupself = "";
      const currentPowerupAttack = buyer.tempPowerup;

      if (req.body.crys1 === "1") {
        const random = Math.floor(Math.random() * listOfPowerups.length);
        powerupself = listOfPowerups[random];
      }
      if (currentPowerupAttack === "jumpscare" || currentPowerupAttack === "sabotage") {
        powerupself = currentPowerupAttack;
      }
      if (setter.filter((v) => v).length > 1) {
        return res.redirect("/shop/?error=powerup");
      } else {
        if (powerupself === "jumpscare" || powerupself === "sabotage") {
          await Team.updateOne(
            { email: req.team.email },
            {
              $set: {
                tempPowerup: powerupself,
              },
            }
          );
          return res.redirect("/shop/?error=entervictim");
        } else if (powerupself === "hintspire" || powerupself === "gamble") {
          await Team.updateOne(
            { email: req.team.email },
            {
              $set: {
                [powerupself]: true,
                powerupTimer: 30,
              },
              $inc: { bp: -totalCost },
            }
          );
          if (powerupself === "hintspire") {
            const ques = buyer.questions.length;
            const comb = ques.toString() + buyer.email;
            const hash = crypto.createHash("sha256").update(comb).digest("hex");
            return res.send(
              hash + " is the hash of your hint. Send this to a kryptos admin along with your registered email."
            );
          } else if (powerupself === "gamble") {
            return res.redirect("/gamble");
          }
        } else {
          return res.redirect("/shop/?error=powerup");
        }
      }
    } else {
      return res.redirect("/shop/?error=buywrong");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

module.exports = router;