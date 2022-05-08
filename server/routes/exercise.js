const express = require('express');
const Exercise = require('../models/exercise');
const router = express.Router();

router
  .get('/', (req, res) => {
    try {
      const exercises = Exercise.getExercises();
      res.send(exercises);
    } catch(err) {
      res.status(401).send({message: err.message});
    }
  })

  .post('/create', async (req, res) => {
    try {
    const exercise = await Exercise.createEntries(req.body.userId);
    res.send({exercise})
    } catch(error) {
    res.status(401).send({message: error.message});
    }
  })
  
  .post('/setInstructions', async (req, res) => {
    try {
      console.log(req.body.instructions)
      console.log(req.body.userId)
      const exercise = await Exercise.setInstructions(req.body.instructions, req.body.userId);
      res.send({...exercise, content: undefined})
    } catch(error) {
    res.status(401).send({message: error.message});
    }
  })

module.exports = router;

