const cron = require("node-cron");
const Team = require("../models/Team");

module.exports = cron.schedule(
  "* * * * *",
  () => {
    Team.find({}, function (err, docs) {
      docs.forEach((element) => {
        if (element.attackCooldown > 0) {
          Team.updateOne(
            { email: element.email },
            {
              $inc: {
                attackCooldown: -1,
              },
            },
            { multi: true },
            attcoolcallback
          );
          function attcoolcallback(err, num) {
            if (err) {
              console.log(err);
            }
          }
        }
        else{
          Team.updateOne(
            { email: element.email },
            {
              $set: {
                jumpscare: false,
                sabotage: false
            
              },
            },
            { multi: true },
            donescene
          );
          function donescene(err, num) {
            if (err) {
              console.log(err);
            }
          }
        }
      });
    });
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata",
  }
);
