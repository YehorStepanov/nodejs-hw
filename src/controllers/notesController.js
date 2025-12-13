import {Note} from '../models/note.js';
import createHttpError from 'http-errors';

export const getAllNotes = async (req, res) => {
  const notes = await Note.find();

  res.status(200).json({
    status: 200,
    data: notes
  });
};
export const getNoteById = async (req, res) => {
  const id_param = req.params.noteId;
  const note = await Note.findById(id_param);
  if(!note){
    // eslint-disable-next-line no-undef
    next(createHttpError(404, 'Student not found'));
    return;
  }
  res.status(200).json({
    status: 200,
    data: note
  });
};

export const createNote = async (req, res) => {
  const note = await Note.create(req.body);
  res.status(201).json(note);
};


export const deleteNote = async (req, res) => {
  const id_param = req.params.noteId;
  const note = await Note.findOneAndDelete({_id: id_param});
  if(!note){
    // eslint-disable-next-line no-undef
    next(createHttpError(404, 'Student not found'));
    return;
  }
  res.status(200).json({
    status: 200,
    data: note
  });
};


export const updateNote  = async (req, res, next) => {
  const { noteId } = req.params;

  const note = await Note.findOneAndUpdate(
    { _id: noteId },
    req.body,
    { new: true },
  );

  if (!note) {
    next(createHttpError(404, 'Student not found'));
    return;
  }

  res.status(200).json(note);
};
