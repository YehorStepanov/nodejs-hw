import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

export const getAllNotes = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, tag, search } = req.query;

    const limit = Number(perPage);
    const skip = (Number(page) - 1) * limit;

    let notesQuery = Note.find({ userId: req.user._id });

    if (tag) {
      notesQuery = notesQuery.where('tag').equals(tag);
    }

    if (search) {
      notesQuery = notesQuery.where({ $text: { $search: search } });
    }

    const countQuery = Note.find({ userId: req.user._id });

    if (tag) countQuery.where('tag').equals(tag);
    if (search) countQuery.where({ $text: { $search: search } });

    const [notes, totalNotes] = await Promise.all([
      notesQuery.sort({ createdAt: -1 }).skip(skip).limit(limit),
      countQuery.countDocuments(),
    ]);

    res.status(200).json({
      page: Number(page),
      perPage: limit,
      totalNotes,
      totalPages: Math.ceil(totalNotes / limit),
      notes,
    });
  } catch (err) {
    next(err);
  }
};

export const getNoteById = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findOne({ _id: noteId, userId: req.user._id });
    if (!note) throw createHttpError(404, 'Note not found');

    res.status(200).json(note);
  } catch (err) {
    next(err);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const note = await Note.create({
      ...req.body,
      userId: req.user._id,
    });

    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findOneAndDelete({ _id: noteId, userId: req.user._id });
    if (!note) throw createHttpError(404, 'Note not found');

    res.status(200).json(note);
  } catch (err) {
    next(err);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findOneAndUpdate(
      { _id: noteId, userId: req.user._id },
      req.body,
      { new: true }
    );

    if (!note) throw createHttpError(404, 'Note not found');

    res.status(200).json(note);
  } catch (err) {
    next(err);
  }
};
