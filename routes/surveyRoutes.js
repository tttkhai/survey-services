const mongoose = require('mongoose');
const _ = require('lodash');
const Path = require('path-parser');
const { URL } = require('url');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplate/surveyTemplates');

const Survey = mongoose.model('survey');

module.exports = (app) =>{
  app.get('/api/surveys/thanks', (req, res)=>{
    res.send('Thanks for voting!');
  });

  app.post('/api/surveys/webhooks', (req, res)=>{
    const events = _.map(req.body, ({email, url}) =>{
      const pathname = new URL(url).pathname;
      const p = new Path('/api/surveys/:surveyId/:choice');
      const match = p.test(pathname);
      if(match){
        return {email, surveyId: match.surveyId, choice: match.choice};
      }
    });

    const compactEvent = _.compact(events);
    const uniqueEvent = _.uniqBy(compactEvent, 'email', 'surveyId');
    const updateEvent = _.each(uniqueEvent, ({ surveyId, email, choice }) =>{
      Survey.updateOne({
        _id: surveyId,
        recipients: {
          $elemMatch: {email: email, responded: false}
        }
      }, {
      $inc: { [choice]: 1},
      $set: {'recipients.$.responded': true }
      });
    }).exec();

  });
  app.post('/api/surveys', requireLogin, requireCredits, async (req, res)=>{
    const { title, subject, body, recipients } = req.body;

    const survey = new Survey({
      title,
      subject,
      body,
      recipients: recipients.split(',').map(email => ({ email })),
      _user: req.user.id,
      dateSent: Date.now()
    });

    // place to send an email!
    const mailer = new Mailer(survey, surveyTemplate(survey));
    try {
      await mailer.send();
      await survey.save();
      req.user.credits -=1;
      const user = await req.user.save();

      res.send(user);
    } catch(err) {
      res.status(422).send(err);
    };

  });
};
