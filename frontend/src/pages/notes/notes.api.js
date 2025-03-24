import axiosInstance from "../../utils/axiosInstance";

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';
const API = `${API_BASE}/notes`;

export const getNotes = async (token) => {
  const res = await axiosInstance.get(API, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const analyzeNote = async (id, token) => {
  const res = await axiosInstance.get(`${API}/${id}/analyze`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data.sentiment;
};

export const createNote = async (title, content, token) => {
  const res = await axiosInstance.post(API, { title, content }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateNote = async (id, title, content, token) => {
  const res = await axiosInstance.put(`${API}/${id}`, { title, content }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteNote = async (id, token) => {
  const res = await axiosInstance.delete(`${API}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const fetchNotesWithSentiment = async (token) => {
  try {
    const notes = await getNotes(token);
    const enrichedNotes = await Promise.all(
      notes.data?.map(async (note) => {
        try {
          const sentiment = await analyzeNote(note._id, token);
          return { ...note, sentiment };
        } catch {
          return { ...note, sentiment: 'unknown' };
        }
      })
    );
    return enrichedNotes;
  } catch (err) {
    console.error('Failed to fetch notes with sentiment', err);
    throw err;
  }
};
