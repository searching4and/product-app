import React, { useState } from 'react';
import { register } from '../api';

export default function Register({ onRegisterSuccess, onSwitchToLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, password);
      alert('Registrasi berhasil. Silakan login.');
      onRegisterSuccess(); // Kembali ke halaman login
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Daftar</button>
        <button type="button" onClick={onSwitchToLogin} style={{ marginLeft: 10 }}>
          Kembali ke Login
        </button>
      </form>
    </div>
  );
}
