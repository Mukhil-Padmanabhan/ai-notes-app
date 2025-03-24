/* eslint-disable no-undef */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from '../pages/auth/Register';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import axios from 'axios';
import { toast } from 'react-hot-toast';

vi.mock('axios');
vi.mock('react-hot-toast', () => ({
  error: vi.fn(),
}));

const mockedNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

vi.mock('react-hot-toast', async () => {
  const actual = await vi.importActual('react-hot-toast');
  return {
    ...actual,
    toast: {
      ...actual.toast,
      error: vi.fn(),
    },
  };
});


const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Register Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  test('renders register form', () => {
    renderWithRouter(<Register />);
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  });

  test('submits form and redirects on success', async () => {
    axios.post.mockResolvedValueOnce({
      data: { token: 'mock-token' },
    });

    renderWithRouter(<Register />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'test@example.com' },
    });

    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('mock-token');
      expect(mockedNavigate).toHaveBeenCalledWith('/notes');
    });
  });

  test('shows toast on failed registration', async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { message: 'User already exists' } },
    });

    renderWithRouter(<Register />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'test@example.com' },
    });

    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('User already exists');
    });
  });
});
