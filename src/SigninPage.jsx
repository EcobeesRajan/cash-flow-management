
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import Cookies from 'js-cookie';

const SigninPage = () => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePinChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,5}$/.test(value)) {
      setPin(value);
      setError('');
    }
  };

  const handleLogin = async () => {
    if (pin.length < 5) {
      setError('Please enter a 5-digit PIN.');
      return;
    }

    setLoading(true);
    try {
      const userRef = doc(db, 'users', pin);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        setError('Invalid PIN. Try again.');
        setLoading(false);
        return;
      }

      const user = userSnap.data();
      const role = user.role?.toLowerCase();
      const name = user.name;

      localStorage.setItem('pin', pin);
      localStorage.setItem('name', name);
      localStorage.setItem('role', role);
      localStorage.setItem('uid', user.uid);
      localStorage.setItem('email', user.email);


      Cookies.set('pin', pin);
      Cookies.set('name', name);
      Cookies.set('role', role);
 

      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'staff') {
        navigate('/staff');
      } else {
        setError('Unknown role assigned.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <div className="w-full max-w-sm text-center mt-10">
        <h1 className="text-2xl font-semibold mb-4">Enter your PIN code</h1>

        <input
          type="password"
          value={pin}
          onChange={handlePinChange}
          maxLength={5}
          className="w-full mb-4 px-4 py-3 border-2 rounded-md text-2xl text-center font-mono"
          placeholder="Enter 5-digit PIN"
          autoFocus
        />

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <button
          onClick={handleLogin}
          disabled={pin.length < 5 || loading}
          className={`w-full py-3 rounded-full text-lg font-semibold ${
            pin.length === 5 && !loading
              ? 'bg-green-600 text-white'
              : 'bg-gray-400 text-gray-600 cursor-not-allowed'
          }`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </div>
    </div>
  );
};

export default SigninPage;



