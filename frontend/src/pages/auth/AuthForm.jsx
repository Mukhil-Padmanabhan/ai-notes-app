import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authSchema } from './auth.schema';
import { getPasswordStrength } from './auth.utils';

const AuthForm = ({ type = 'login', onSubmit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const passwordStrength = type === 'register' ? getPasswordStrength(password) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await authSchema.validate({ email, password }, { abortEarly: false });
      setErrors({});
      onSubmit({ email, password });
    } catch (err) {
      const newErrors = {};
      err.inner.forEach((error) => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 text-black dark:text-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-4"
      >
        <h2 className="text-3xl font-extrabold text-center mb-6">
          {type === 'login' ? 'Login' : 'Register'}
        </h2>

        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg text-black dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500' : 'focus:ring-blue-500'}`}
          />
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg text-black dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500' : 'focus:ring-blue-500'}`}
          />
          {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}

          {type === 'register' && password && (
            <p className={`text-sm mt-2 font-medium ${passwordStrength.color}`}>
              Password Strength: {passwordStrength.label}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full mt-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 font-medium"
        >
          {type === 'login' ? 'Login' : 'Register'}
        </button>

        <div className="text-center text-sm text-gray-600 dark:text-gray-300 mt-6">
          {type === 'login' ? (
            <p>
              Don&apos;t have an account?{' '}
              <Link to="/register" className="text-blue-600 hover:underline font-medium">
                Register
              </Link>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <Link to="/" className="text-blue-600 hover:underline font-medium">
                Login
              </Link>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default AuthForm;
