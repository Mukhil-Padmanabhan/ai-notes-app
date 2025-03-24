const express = require('express');
const router = express.Router();

const validate = require('../middlewares/validate');
const { verifyToken } = require('../middlewares/auth.middleware');
const { createNoteSchema, updateNoteSchema } = require('../schemas/note');

const {
  createNote,
  getNotes, 
  analyzeNote,
  updateNote,
  deleteNote,
} = require('../controllers/note.controller');

router.use(verifyToken);

router.post('/', validate(createNoteSchema), createNote);
router.get('/', getNotes);
router.get('/:id/analyze', analyzeNote);
router.put('/:id', validate(updateNoteSchema), updateNote);
router.delete('/:id', deleteNote);

module.exports = router;
