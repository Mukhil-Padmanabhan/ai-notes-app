/* eslint-disable no-undef */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AuthForm from '../pages/auth/AuthForm';
import { BrowserRouter } from 'react-router-dom';

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('AuthForm Component', () => {
  test('renders login form by default', () => {
    renderWithRouter(<AuthForm onSubmit={vi.fn()} />);
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  test('renders register form and password strength indicator', () => {
    renderWithRouter(<AuthForm type="register" onSubmit={vi.fn()} />);
    expect(screen.getByRole('heading', { name: 'Register' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'pass' },
    });

    expect(screen.getByText(/Password Strength/i)).toBeInTheDocument();
  });

  test('shows validation errors if fields are empty', async () => {
    renderWithRouter(<AuthForm onSubmit={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });

  test('calls onSubmit with email and password on valid submit', async () => {
    const mockSubmit = vi.fn();
    renderWithRouter(<AuthForm onSubmit={mockSubmit} />);

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'Password@123' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password@123',
      });
    });

    expect(mockSubmit).toHaveBeenCalledTimes(1);
  });

  test('password strength should show correct label for strong passwords', () => {
    renderWithRouter(<AuthForm type="register" onSubmit={vi.fn()} />);

    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'Password@123' },
    });

    expect(screen.getByText(/Password Strength: (Strong|Very Strong)/)).toBeInTheDocument();
  });
});
