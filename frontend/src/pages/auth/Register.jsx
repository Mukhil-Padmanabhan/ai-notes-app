import AuthForm from './AuthForm';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { register } from './auth.api';

const Register = () => {
  const navigate = useNavigate();

  const handleRegister = async ({ email, password }) => {
    try {
      const res = await register(email, password);
      localStorage.setItem('token', res.data?.data?.token);
      navigate('/notes');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return <AuthForm type="register" onSubmit={handleRegister} />;
};

export default Register;
