/* eslint-disable no-undef */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Notes from '../pages/notes/Notes';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import * as notesApi from '../pages/notes/notes.api';

const mockNotes = [
  {
    _id: '1',
    title: 'Note 1',
    content: 'This is a test note with positive sentiment.',
    sentiment: 'positive',
  },
  {
    _id: '2',
    title: 'Note 2',
    content: 'This is a second test note with negative sentiment.',
    sentiment: 'negative',
  },
];

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('Notes Page', () => {
  beforeEach(() => {
    vi.spyOn(notesApi, 'fetchNotesWithSentiment').mockResolvedValue(mockNotes);
    vi.spyOn(notesApi, 'createNote').mockResolvedValue({});
    vi.spyOn(notesApi, 'updateNote').mockResolvedValue({});
    vi.spyOn(notesApi, 'deleteNote').mockResolvedValue({});
    localStorage.setItem('token', 'mock-token');
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  test('renders loading spinner initially and then notes', async () => {
    renderWithRouter(<Notes />);
    // Expect the spinner to show
    const spinner = screen.getByTestId('spinner');
    console.log("spinner", spinner)
    expect(spinner).toBeInTheDocument();
  
    // Wait for notes to appear
    await waitFor(() => {
      expect(screen.getByText(/Note 1/)).toBeInTheDocument();
      expect(screen.getByText(/Note 2/)).toBeInTheDocument();
    });
  });
  test('opens and closes add note modal', async () => {
    renderWithRouter(<Notes />);
    const addButton = await screen.findByText('+ Add Note');
    fireEvent.click(addButton);
    expect(await screen.findByPlaceholderText('Title')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Cancel'));
    await waitFor(() => {
      expect(screen.queryByPlaceholderText('Title')).not.toBeInTheDocument();
    });
  });

  test('filters notes by sentiment', async () => {
    renderWithRouter(<Notes />);
    await waitFor(() => screen.getByText(/Note 1/));
    fireEvent.click(screen.getByText('Filter'));
    fireEvent.click(screen.getByLabelText('Positive'));
    await waitFor(() => {
      expect(screen.getByText('Note 1')).toBeInTheDocument();
      expect(screen.queryByText('Note 2')).not.toBeInTheDocument();
    });
  });

  test('can edit a note', async () => {
    renderWithRouter(<Notes />);
    await waitFor(() => screen.getByText(/Note 1/));
    const editButtons = screen.getAllByTitle('Edit');
    fireEvent.click(editButtons[0]);
    fireEvent.change(screen.getByPlaceholderText('Title'), {
      target: { value: 'Updated Title' },
    });
    fireEvent.submit(screen.getByText('Save'));
    await waitFor(() => {
      expect(notesApi.updateNote).toHaveBeenCalled();
    });
  });

  test('can delete a note', async () => {
    renderWithRouter(<Notes />);
    await waitFor(() => screen.getByText(/Note 1/));
    const deleteButtons = screen.getAllByTitle('Delete');
    fireEvent.click(deleteButtons[0]);
    await waitFor(() => {
      expect(notesApi.deleteNote).toHaveBeenCalled();
    });
  });

  test('logout clears token and navigates', async () => {
    renderWithRouter(<Notes />);
    const logoutBtn = await screen.findByText('Logout');
    fireEvent.click(logoutBtn);
    expect(localStorage.getItem('token')).toBeNull();
  });
});
