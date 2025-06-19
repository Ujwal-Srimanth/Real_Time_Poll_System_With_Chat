const express = require('express');
const {
  createPoll,
  getActivePoll,
  getPollResults,
  closePoll,
  submitAnswer,
  getPollHistory
} = require('../controllers/PollControllers');

const createPollRouter = (io) => {
  const router = express.Router();

  router.post('/create', (req, res) => createPoll(req, res, io));
  router.get('/active', (req, res) => getActivePoll(req, res)); // 👈 wrap it
  router.get('/results/:pollId', (req, res) => getPollResults(req, res)); // 👈 wrap it
  router.post('/close/:pollId', (req, res) => closePoll(req, res, io));
  router.post('/answer', (req, res) => submitAnswer(req, res, io));
  router.get('/history', (req,res) => getPollHistory(req,res));

  return router;
};

module.exports = createPollRouter;
