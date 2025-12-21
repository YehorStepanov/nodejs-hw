import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

export const getAllNotes = async (req, res) => {
  const { page = 1, perPage = 10, tag, search } = req.query;

  const skip = (Number(page) - 1) * Number(perPage);
  let notesQuery = Note.find();
  if (tag) {
    notesQuery = notesQuery.where('tag').equals(tag);
  }
  if (search) {
    notesQuery = notesQuery.where({ $text: { $search: search } });
  }

  const [notes, totalNotes] = await Promise.all([
    notesQuery
      .skip(skip)
      .limit(Number(perPage))
      .sort({ createdAt: -1 }),

    Note.find()
      .where(tag ? { tag } : {})
      .where(search ? { $text: { $search: search } } : {})
      .countDocuments(),
  ]);

  const totalPages = Math.ceil(totalNotes / Number(perPage));

  res.status(200).json({
    page: Number(page),
    perPage: Number(perPage),
    totalNotes,
    totalPages,
    notes,
  });
};

export const getNoteById = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);

  if (!note) {
    next(createHttpError(404, 'Note not found'));
    return;
  }

  res.status(200).json({
    status: 200,
    data: note,
  });
};

export const createNote = async (req, res) => {
  const note = await Note.create(req.body);

  res.status(201).json({
    status: 201,
    data: note,
  });
};

export const deleteNote = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndDelete({ _id: noteId });

  if (!note) {
    next(createHttpError(404, 'Note not found'));
    return;
  }

  res.status(200).json({
    status: 200,
    data: note,
  });
};

export const updateNote = async (req, res, next) => {
  const { noteId } = req.params;

  const note = await Note.findOneAndUpdate(
    { _id: noteId },
    req.body,
    { new: true },
  );

  if (!note) {
    next(createHttpError(404, 'Note not found'));
    return;
  }

  res.status(200).json({
    status: 200,
    data: note,
  });
};
