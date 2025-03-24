import { describe, it, expect, beforeEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import axiosInstance from '../utils/axiosInstance'; // make sure this path is correct
import {
  getNotes,
  analyzeNote,
  createNote,
  updateNote,
  deleteNote,
  fetchNotesWithSentiment,
} from '../pages/notes/notes.api';

const mock = new MockAdapter(axiosInstance);
const token = 'mock-token';
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';
const NOTES_API = `${API_BASE}/notes`;

beforeEach(() => {
  mock.reset();
});

describe('Notes API', () => {
  const mockNote = {
    _id: 'note123',
    title: 'Test Note',
    content: 'This is a test note with more than 10 characters',
  };

  it('should get notes', async () => {
    mock.onGet(NOTES_API).reply(200, { data: [mockNote] });
    const res = await getNotes(token);
    expect(res.data).toEqual([mockNote]);
  });

  it('should analyze note sentiment', async () => {
    const sentiment = 'positive';
    mock.onGet(`${NOTES_API}/note123/analyze`).reply(200, { data: { sentiment } });
    const res = await analyzeNote('note123', token);
    expect(res).toBe(sentiment);
  });

  it('should create a new note', async () => {
    mock.onPost(NOTES_API).reply(201, { data: mockNote });
    const res = await createNote(mockNote.title, mockNote.content, token);
    expect(res.data).toEqual(mockNote);
  });

  it('should update a note', async () => {
    const updated = { ...mockNote, title: 'Updated Title' };
    mock.onPut(`${NOTES_API}/${mockNote._id}`).reply(200, { data: updated });
    const res = await updateNote(mockNote._id, updated.title, updated.content, token);
    expect(res.data).toEqual(updated);
  });

  it('should delete a note', async () => {
    mock.onDelete(`${NOTES_API}/${mockNote._id}`).reply(200, { message: 'Note deleted' });
    const res = await deleteNote(mockNote._id, token);
    expect(res.message).toBe('Note deleted');
  });

  it('should fetch notes with sentiment', async () => {
    const mockNotes = [mockNote];
    mock.onGet(NOTES_API).reply(200, { data: mockNotes });
    mock.onGet(`${NOTES_API}/${mockNote._id}/analyze`).reply(200, {
      data: { sentiment: 'neutral' },
    });

    const enriched = await fetchNotesWithSentiment(token);
    expect(enriched[0].sentiment).toBe('neutral');
  });

  it('should fallback to "unknown" sentiment on analysis failure', async () => {
    mock.onGet(NOTES_API).reply(200, { data: [mockNote] });
    mock.onGet(`${NOTES_API}/${mockNote._id}/analyze`).reply(500);

    const enriched = await fetchNotesWithSentiment(token);
    expect(enriched[0].sentiment).toBe('unknown');
  });

  it('should throw error when fetching notes fails', async () => {
    mock.onGet(NOTES_API).reply(500);

    await expect(fetchNotesWithSentiment(token)).rejects.toThrow();
  });
});
