const Poll = require('../models/Poll');

exports.createPoll = async (req, res, io) => {
    const { question, options, duration = 60 } = req.body;

    console.log(options)
    const existingActivePoll = await Poll.findOne({ isActive: true });
    if (existingActivePoll) {
      return res.status(400).json({ message: "An active poll already exists" });
    }
  
    const newPoll = new Poll({ question, options, duration });
    await newPoll.save();
  
    io.emit('pollCreated', newPoll);
  
    // 🕒 Auto-close after duration
    setTimeout(async () => {
      const activePoll = await Poll.findById(newPoll._id);
      if (activePoll && activePoll.isActive) {
        activePoll.isActive = false;
        await activePoll.save();
        io.emit('pollClosed', newPoll._id);
      }
    }, duration * 1000);
  
    res.status(201).json(newPoll);
  };
  
  // Same for closePoll and submitAnswer
  exports.closePoll = async (req, res, io) => {
    const { pollId } = req.params;
    const poll = await Poll.findByIdAndUpdate(pollId, { isActive: false }, { new: true });
    if (!poll) return res.status(404).json({ message: "Poll not found" });
  
    io.emit('pollClosed', pollId); // Notify clients
    res.status(200).json({ message: "Poll closed" });
  };

  exports.getPollHistory = async (req, res) => {
    try {
      const history = await Poll.find().sort({ createdAt: -1 }).limit(10); // Last 10
      res.status(200).json(history);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching history' });
    }
  };
  
  exports.submitAnswer = async (req, res, io) => {
    const { pollId, studentName, answer } = req.body;
  
    try {
      const poll = await Poll.findById(pollId);
      if (!poll) return res.status(404).json({ message: 'Poll not found' });
      if (!poll.isActive) return res.status(400).json({ message: 'Poll is closed' });
  
      const alreadyAnswered = poll.responses.find(r => r.studentName === studentName);
      if (alreadyAnswered) {
        return res.status(400).json({ message: 'You already submitted an answer' });
      }
  
      poll.responses.push({ studentName, answer });
      await poll.save();

      const totalStudents = io.connectedStudents.size;
      const uniqueAnswers = new Set(poll.responses.map(r => r.studentName));

        if (uniqueAnswers.size === totalStudents) {
            poll.isActive = false;
            await poll.save();
            io.emit('pollClosed', poll._id); // Notify clients
        }
  
      io.emit('pollUpdate', poll);
  
      res.status(200).json({ message: 'Answer submitted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  