/* eslint-disable no-undef */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../pages/auth/Login';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { vi } from 'vitest';
import { toast } from 'react-hot-toast';

// Mock axios
vi.mock('axios');

// Mock toast
vi.mock('react-hot-toast', () => ({
  error: vi.fn(),
}));

// Setup useNavigate mock
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


const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('Login Page', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  test('renders login form and submits credentials', async () => {
    const mockToken = 'mocked_token';
    axios.post.mockResolvedValueOnce({ data: { token: mockToken } });

    renderWithRouter(<Login />);

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    });

    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/auth/login', {
        email: 'test@example.com',
        password: 'password123',
      });
      expect(localStorage.getItem('token')).toBe(mockToken);
      expect(mockedNavigate).toHaveBeenCalledWith('/notes');
    });
  });

  test('shows toast error on login failure', async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { message: 'Invalid credentials' } },
    });

    renderWithRouter(<Login />);

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'fail@example.com' },
    });

    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'wrongpass' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Invalid credentials');
    });
  });
});
