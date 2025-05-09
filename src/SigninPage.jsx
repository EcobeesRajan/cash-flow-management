import React, { useState, useEffect } from 'react';

const SigninPage = () => {
  const [pin, setPin] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);


  const handleFocus = () => {
    setIsKeyboardVisible(true);
  };

  
  const handlePinChange = (e) => {
    const value = e.target.value;
    if (value.length <= 5 && /^[0-9]*$/.test(value)) {
      setPin(value); 
    }
  };

  useEffect(() => {
    
    const handleResize = () => {
      if (window.innerHeight < 600) {
        setIsKeyboardVisible(true); 
      } else {
        setIsKeyboardVisible(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen bg-white p-4 transition-all duration-300 ${
        isKeyboardVisible ? 'mt-10' : ''
      }`}
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0',
      }}
    >
      
      <div className="w-full max-w-sm text-center mt-10">
        <h1 className="text-2xl font-semibold mb-8">Enter your pin code</h1>

       
        <input
          type="password" 
          value={pin}
          onChange={handlePinChange}
          onFocus={handleFocus}
          maxLength={5}
          className="w-full mb-8 px-4 py-3 border-2 rounded-md text-2xl text-center font-mono shadow-sm"
          placeholder="Enter 5-digit PIN"
          autoFocus
        />

        
        <button
          disabled={pin.length !== 5}
          className="w-full bg-green-600 text-white py-3 rounded-full disabled:bg-gray-300 text-lg font-semibold"
        >
          Log in
        </button>
      </div>
    </div>
  );
};

export default SigninPage;
