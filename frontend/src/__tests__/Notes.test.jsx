/* eslint-disable no-undef */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Notes from '../pages/notes/Notes';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('../api/notes', () => ({
  fetchNotes: vi.fn(() => Promise.resolve([])),
}));

describe('Notes Page', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'mock-token');
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('renders notes page and empty state', async () => {
    renderWithRouter(<Notes />);
    expect(screen.getByText(/loading notes/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/No Notes Yet/i)).toBeInTheDocument();
    });
  });

  test('renders + Add Note button', async () => {
    renderWithRouter(<Notes />);
    await waitFor(() => {
      expect(screen.getByText('+ Add Note')).toBeInTheDocument();
    });
  });

  test('opens modal on + Add Note click', async () => {
    renderWithRouter(<Notes />);
    const addNoteBtn = await screen.findByText('+ Add Note');
    fireEvent.click(addNoteBtn);
    expect(await screen.findByPlaceholderText('Title')).toBeInTheDocument();
  });

  test('logout clears token and navigates', async () => {
    renderWithRouter(<Notes />);
    const logoutBtn = await screen.findByText('Logout');
    fireEvent.click(logoutBtn);
    expect(localStorage.getItem('token')).toBeNull();
  });
});
