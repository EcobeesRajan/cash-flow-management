
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '/home/rajan/Desktop/Cash FLow Management/cash-flow-management/src/firebase.js';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setError('');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;


      localStorage.setItem('authUser', JSON.stringify({ email: user.email, uid: user.uid }));

      
      navigate('/signin');
    } catch (err) {
      setError('Login failed: Invalid Email or Password. ');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Log In</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your Password"
          />
        </div>

        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

        <button
          onClick={handleLogin}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition duration-200"
        >
          Log In
        </button>
      </div>
    </div>
  );
};

export default Login;



