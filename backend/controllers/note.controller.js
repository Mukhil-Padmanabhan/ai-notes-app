const Note = require('../models/note.model');
const logger = require('../utils/logger');
const sentimentService = require('../ml/sentimentService');
const { sendSuccess, sendError, sendNotFound } = require('../utils/response');
const {
  NOTE_VALIDATION,
  NOTE_CREATION_FAILED,
  NOTE_FETCH_ERROR,
  NOTE_ANALYZE_ERROR,
  NOTE_UPDATE_ERROR,
  NOTE_DELETE,
  NOTE_DELETE_ERROR,
  NOTE_SAVE_SUCCESS,
  NOTE_UPDATE_SUCCESS,
  NOTE_FETCH_SUCCESS,
  NOTE_ANALYZE_SUCCESS
} = require('../constants/note');

exports.createNote = async (req, res) => {
  const { title, content } = req.body;

  if (!title || content.length < 10)
    return sendError(res, 400, NOTE_VALIDATION);

  try {
    const sentiment = sentimentService.analyze(content);
    const note = await Note.create({
      title,
      content,
      sentiment,
      user: req.user._id,
    });
    return sendSuccess(res, 201, note, NOTE_SAVE_SUCCESS);
  } catch (err) {
    logger.error(NOTE_CREATION_FAILED, err);
    return sendError(res, 500, NOTE_CREATION_FAILED);
  }
};

exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({ createdAt: -1 });
    return sendSuccess(res, 200, notes, NOTE_FETCH_SUCCESS);
  } catch (err) {
    logger.error(NOTE_FETCH_ERROR, err);
    return sendError(res, 500, NOTE_FETCH_ERROR);
  }
};

exports.analyzeNote = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
    if (!note) return sendNotFound(res);
    const sentiment = sentimentService.analyze(note.content);
    return sendSuccess(res, 200, { sentiment }, NOTE_ANALYZE_SUCCESS);
  } catch (err) {
    logger.error(NOTE_ANALYZE_ERROR, err);
    return sendError(res, 500, NOTE_ANALYZE_ERROR);
  }
};

exports.updateNote = async (req, res) => {
  const { title, content } = req.body;

  if (!title || content.length < 10)
    return sendError(res, 400, NOTE_VALIDATION);

  try {
    const sentiment = sentimentService.analyze(content);

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title, content, sentiment },
      { new: true }
    );

    if (!note) return sendNotFound(res);

    return sendSuccess(res, 200, note, NOTE_UPDATE_SUCCESS);
  } catch (err) {
    logger.error(NOTE_UPDATE_ERROR, err);
    return sendError(res, 500, NOTE_UPDATE_ERROR);
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!note) return sendNotFound(res);

    return sendSuccess(res, 200, {}, NOTE_DELETE);
  } catch (err) {
    logger.error(NOTE_DELETE_ERROR, err);
    return sendError(res, 500, NOTE_DELETE_ERROR);
  }
};
