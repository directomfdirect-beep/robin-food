import React, { useState } from 'react';
import { Eye, EyeOff, LogIn } from 'lucide-react';

const ADMIN_LOGIN = 'foodrobin';
const ADMIN_PASSWORD = 'QW7859qw';

/**
 * Admin login screen — credentials checked client-side.
 */
export const AdminLogin = ({ onLogin }) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login === ADMIN_LOGIN && password === ADMIN_PASSWORD) {
      setError('');
      onLogin();
    } else {
      setError('Неверный логин или пароль');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center">
            <span className="text-[#BDFF00] text-[10px] font-black tracking-tight">RF</span>
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-gray-400 leading-none">Robin Food</p>
            <p className="text-lg font-black uppercase italic leading-tight">Admin Panel</p>
          </div>
        </div>

        {/* Card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1.5">
              Логин
            </label>
            <input
              type="text"
              value={login}
              onChange={(e) => { setLogin(e.target.value); setError(''); }}
              autoComplete="username"
              placeholder="foodrobin"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-acid/30 focus:border-black"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1.5">
              Пароль
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-acid/30 focus:border-black"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-[11px] font-bold text-red-500 bg-red-50 px-3 py-2 rounded-xl">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-black text-[#BDFF00] rounded-2xl text-sm font-black uppercase tracking-wide hover:bg-gray-900 transition-colors"
          >
            <LogIn size={16} />
            Войти
          </button>
        </form>

        <p className="text-center text-[10px] text-gray-300 mt-6 font-medium">
          robin-food.ru · Admin
        </p>
      </div>
    </div>
  );
};
