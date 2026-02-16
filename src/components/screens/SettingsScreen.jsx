import React, { useState } from 'react';
import { ArrowLeft, Bell, Moon, Trash2, LogOut, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

/**
 * SettingsScreen — notifications, theme, delete account, logout
 */
export const SettingsScreen = ({ onBack, onLogout }) => {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [theme, setTheme] = useState('light');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const themes = [
    { id: 'light', label: 'Светлая' },
    { id: 'dark', label: 'Тёмная' },
    { id: 'system', label: 'Системная' },
  ];

  return (
    <div className="min-h-full bg-white animate-fade-in pb-32">
      <div className="p-6 pb-3 flex items-center gap-4 border-b border-gray-100">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-black italic uppercase text-lg">Настройки</h1>
      </div>

      <div className="p-6 space-y-6">
        {/* Push notifications */}
        <div>
          <p className="text-[10px] font-bold uppercase text-gray-400 mb-3">Уведомления</p>
          <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell size={20} className="text-gray-500" />
              <span className="font-bold text-sm">Push-уведомления</span>
            </div>
            <button
              onClick={() => setPushEnabled(!pushEnabled)}
              className={`w-12 h-7 rounded-full transition-colors relative ${pushEnabled ? 'bg-brand-green' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${pushEnabled ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
        </div>

        {/* Theme */}
        <div>
          <p className="text-[10px] font-bold uppercase text-gray-400 mb-3">Тема</p>
          <div className="flex gap-2">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-colors ${
                  theme === t.id ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Delete account */}
        <div>
          <p className="text-[10px] font-bold uppercase text-gray-400 mb-3">Аккаунт</p>
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full bg-red-50 rounded-2xl p-4 flex items-center gap-3 text-left hover:bg-red-100 transition-colors"
            >
              <Trash2 size={20} className="text-error" />
              <div>
                <p className="font-bold text-sm text-error">Удалить аккаунт</p>
                <p className="text-[10px] text-gray-400">Аккаунт будет удалён через 30 дней</p>
              </div>
            </button>
          ) : (
            <div className="bg-red-50 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={18} className="text-error" />
                <p className="font-bold text-sm text-error">Подтвердите удаление</p>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                Аккаунт будет удалён через 30 дней. Вы можете отменить в любой момент.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-3 bg-white rounded-xl text-sm font-bold text-gray-500"
                >
                  Отмена
                </button>
                <button className="flex-1 py-3 bg-error rounded-xl text-sm font-bold text-white">
                  Удалить
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="w-full bg-gray-50 rounded-2xl p-4 flex items-center gap-3 hover:bg-gray-100 transition-colors"
        >
          <LogOut size={20} className="text-gray-500" />
          <span className="font-bold text-sm">Выйти</span>
        </button>
      </div>
    </div>
  );
};
