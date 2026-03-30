import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      toast.success('Registration successful! Check your email.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration Failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50 px-4">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-amber-900 mb-6 text-center">Join Yesekela</h2>
        <div className="space-y-4">
          <input type="text" placeholder="Full Name" className="w-full p-3 border rounded-xl" onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          <input type="email" placeholder="Email" className="w-full p-3 border rounded-xl" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          <input type="password" placeholder="Password" className="w-full p-3 border rounded-xl" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
          <button className="w-full bg-amber-600 text-white py-3 rounded-xl font-bold hover:bg-amber-700 transition">Create Account</button>
        </div>
      </form>
    </div>
  );
};

export default Register;