import AuthForm from './AuthForm';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { login } from './auth.api';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async ({ email, password }) => {
    try {
      const res = await login(email, password);
      localStorage.setItem('token', res.data?.data?.token);
      navigate('/notes');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return <AuthForm type="login" onSubmit={handleLogin} />;
};

export default Login;
