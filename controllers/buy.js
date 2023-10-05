const router = require("express").Router();
const verify = require("../middleware/tokenVerification");
const Team = require("../models/Team");
const crypto = require('crypto');


router.post("/powerup", verify, async (req, res) => {
  if (
    req.body.crys1 < 0 

  ) {
    res.send("no");
  } else {
    let totalCost =req.body.crys1 * 1000;

     
    const buyer = await Team.findOne({ email: req.team.email });
    if (
      req.body.crys1 == 0 

 
    ) {
      return res.redirect("/shop/?error=buyless");
    }
    if (
      //add code here to check if omega powerup on user is active or not
      //something like buyer.omega == true
     false
    ) {
      return res.redirect("/shop/?error=powerup");
    } 
    if(buyer.powerupTimer > 0){
      return res.redirect("/shop/?error=powerupcooldown");
    }
    else if (buyer.bp >= totalCost) {
      const setter = [
        req.body.crys1 === "1" ? true : false,

 
      ];
      const category = [0, 1];
      const listOfPowerupsSelf = ["hintspire","gamble"];
     
      var powerupself = "";
      var currentPowerup =0;
      if(req.body.crys1 === "1"){
        var random = Math.floor(Math.random() * listOfPowerupsSelf.length);
        powerupself = listOfPowerupsSelf[random];
        random = Math.floor(Math.random() * category.length);
        currentPowerup = category[random];
      }
 
      if (setter.filter((v) => v).length > 1) {
        
        return res.redirect("/shop/?error=powerup");
      } else {
        
       
        // if (buyer.discountsLeft === 1) {
        //   Team.updateOne(
        //     { email: req.team.email },
        //     {
        //       $set: {
        //         halfPrice: false,
        //         discountsLeft: 0,
        //       },
        //     },
        //     { multi: true },
        //     () => {}
        //   );
        // } else if (buyer.discountsLeft > 1) {
        //   Team.updateOne(
        //     { email: req.team.email },
        //     {
        //       $inc: {
        //         discountsLeft: -1,
        //       },
        //     },
        //     { multi: true },
        //     () => {}
        //   );
        // }
       
         
      

        if(currentPowerup == 0){
          res.redirect("/shop/?error=entervictim");
          
        
        }else if(currentPowerup == 1){

          Team.updateOne(
            { email: req.team.email },
            {
              $set: {
                [powerupself]: true,
                powerupTimer: 20,
              
              },
              $inc: {
                bp: -totalCost,
              },
            },
            { multi: true },
            () => {}
          );
          if(powerupself == "hintspire"){
            var ques = buyer.questions.length;
            var comb = ques.toString() + buyer.email;
            var hash = crypto.createHash('sha256').update(comb).digest('hex');
            res.send(hash + " is the hash of your hint. Send this to a kryptos admin to get your hint.");
          }
          else if(powerupself == "gamble"){
            res.redirect("/gamble");
          }
        }

      }
    } else {
    
      res.redirect("/shop/?error=buywrong");
    }
  }
});

module.exports = router;
