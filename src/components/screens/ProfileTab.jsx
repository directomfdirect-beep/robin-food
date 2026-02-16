import React, { useState } from 'react';
import {
  Settings,
  Camera,
  Award,
  Leaf,
  History,
  Heart,
  HelpCircle,
  ChevronRight,
  MapPin,
  CreditCard,
  Bell,
  Moon,
  Shield,
  FileText,
  Lock,
  LogOut,
  Edit3,
  Mail,
  Phone,
  Tag,
} from 'lucide-react';
import { DEFAULT_USER } from '@/data/constants';

/**
 * Menu item component
 */
const MenuItem = ({ icon: Icon, label, badge, onClick, danger = false, toggle, toggleValue, onToggle }) => (
  <button
    onClick={toggle ? () => onToggle?.(!toggleValue) : onClick}
    className={`
      w-full flex items-center justify-between p-4 
      hover:bg-gray-50 active:bg-gray-100 transition-all
      ${danger ? 'text-error' : 'text-black'}
    `}
  >
    <div className="flex items-center gap-4">
      <div className={`p-2 rounded-xl ${danger ? 'bg-red-50' : 'bg-gray-100'}`}>
        <Icon size={20} className={danger ? 'text-error' : 'text-gray-600'} />
      </div>
      <span className="ga-body-medium text-sm">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      {badge !== undefined && (
        <span className="ga-label text-[10px] text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">
          {badge}
        </span>
      )}
      {toggle ? (
        <div
          className={`w-12 h-7 rounded-full p-1 transition-colors ${
            toggleValue ? 'bg-brand-green' : 'bg-gray-200'
          }`}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
              toggleValue ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </div>
      ) : (
        <ChevronRight size={18} className="text-gray-300" />
      )}
    </div>
  </button>
);

/**
 * Section header component
 */
const SectionHeader = ({ title }) => (
  <div className="px-4 py-3 bg-gray-50">
    <span className="ga-label text-[10px] text-gray-400">{title}</span>
  </div>
);

/**
 * Profile tab with user info, stats, and settings
 */
export const ProfileTab = ({
  user = DEFAULT_USER,
  favoritesCount = 0,
  onSettingsClick,
  onHistoryClick,
  onFavoritesClick,
  onPromotionsClick,
  onSupportClick,
  onAddressesClick,
  onPaymentClick,
  onEditProfileClick,
  onChangePhoto,
  onFaqClick,
  onTermsClick,
  onPrivacyPolicyClick,
  onPrivacySettingsClick,
  onSmartAlertsClick,
  onLogout,
}) => {
  const [notifications, setNotifications] = useState(user.preferences?.notificationsEnabled ?? true);
  const [darkMode, setDarkMode] = useState(user.preferences?.theme === 'dark');

  return (
    <div className="h-full bg-gray-50 animate-fade-in pb-24 overflow-y-auto">
      {/* Header section */}
      <div className="bg-white p-8 pb-12 rounded-b-[48px] flex flex-col items-center relative shadow-sm">
        {/* Settings button */}
        <button
          onClick={onSettingsClick}
          className="absolute top-8 right-6 p-3 bg-gray-50 rounded-2xl text-gray-400 hover:bg-gray-100 active:scale-90 transition-all"
        >
          <Settings size={22} />
        </button>

        {/* Avatar */}
        <div className="relative group">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-xl">
            <img
              src={user.avatar}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            onClick={onChangePhoto}
            className="absolute bottom-0 right-0 p-2.5 bg-black rounded-full border-3 border-white shadow-lg hover:bg-gray-800 transition-colors active:scale-90"
          >
            <Camera size={14} className="text-white" />
          </button>
        </div>

        {/* Name & Contact */}
        <h2 className="mt-5 ga-title text-2xl text-center">
          {user.firstName} {user.lastName}
        </h2>
        
        <div className="flex items-center gap-2 mt-2 text-gray-400">
          <Phone size={12} />
          <span className="ga-body text-xs">{user.phone}</span>
        </div>
        
        <div className="flex items-center gap-2 mt-1 text-gray-400">
          <Mail size={12} />
          <span className="ga-body text-xs">{user.email}</span>
        </div>

        {/* Edit profile button */}
        <button
          onClick={onEditProfileClick}
          className="mt-4 flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
        >
          <Edit3 size={14} className="text-gray-600" />
          <span className="ga-body-medium text-xs text-gray-600">Редактировать</span>
        </button>

        {/* Eco rank badge */}
        <div className="mt-4 bg-black text-acid px-4 py-1.5 rounded-full ga-label text-[9px] flex items-center gap-2">
          <Award size={12} /> {user.ecoRank}
        </div>
      </div>

      {/* Stats card */}
      <div className="px-4 -mt-6">
        <div className="bg-white p-5 rounded-3xl shadow-lg border border-gray-100 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="ga-price text-xl text-black">{user.ordersCount}</p>
            <p className="ga-label text-[9px] text-gray-400 mt-1">Заказов</p>
          </div>
          <div className="border-x border-gray-100">
            <p className="ga-price text-xl text-brand-green">₽{user.spent}</p>
            <p className="ga-label text-[9px] text-gray-400 mt-1">Эко-экономия</p>
          </div>
          <div>
            <p className="ga-price text-xl text-orange-500">{user.bonuses}</p>
            <p className="ga-label text-[9px] text-gray-400 mt-1">Баллов</p>
          </div>
        </div>
      </div>

      {/* Saved food card */}
      <div className="px-4 mt-4">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-3xl border border-green-100 flex items-center gap-4">
          <div className="p-3 bg-white rounded-2xl shadow-sm">
            <Leaf size={24} className="text-brand-green" />
          </div>
          <div>
            <p className="ga-price text-lg text-brand-green">{user.savedFoodKg} кг</p>
            <p className="ga-body text-xs text-gray-500">Спасено продуктов</p>
          </div>
        </div>
      </div>

      {/* Menu sections */}
      <div className="mt-6 bg-white rounded-t-3xl">
        {/* Management section */}
        <SectionHeader title="УПРАВЛЕНИЕ" />
        <div className="divide-y divide-gray-50">
          <MenuItem
            icon={MapPin}
            label="Мои адреса"
            badge={user.addressesCount}
            onClick={onAddressesClick}
          />
          <MenuItem
            icon={CreditCard}
            label="Способы оплаты"
            badge={user.paymentMethodsCount}
            onClick={onPaymentClick}
          />
          <MenuItem
            icon={History}
            label="Мои заказы"
            badge={user.ordersCount}
            onClick={onHistoryClick}
          />
          <MenuItem
            icon={Heart}
            label="Избранное"
            badge={favoritesCount}
            onClick={onFavoritesClick}
          />
          <MenuItem
            icon={Bell}
            label="Умные уведомления"
            onClick={onSmartAlertsClick}
          />
          <MenuItem
            icon={Tag}
            label="Промокоды"
            onClick={onPromotionsClick}
          />
        </div>

        {/* Settings section */}
        <SectionHeader title="НАСТРОЙКИ" />
        <div className="divide-y divide-gray-50">
          <MenuItem
            icon={Bell}
            label="Уведомления"
            toggle
            toggleValue={notifications}
            onToggle={setNotifications}
          />
          <MenuItem
            icon={Moon}
            label="Тёмная тема"
            toggle
            toggleValue={darkMode}
            onToggle={setDarkMode}
          />
          <MenuItem
            icon={Shield}
            label="Приватность"
            onClick={onPrivacySettingsClick}
          />
        </div>

        {/* Help section */}
        <SectionHeader title="ПОМОЩЬ" />
        <div className="divide-y divide-gray-50">
          <MenuItem
            icon={HelpCircle}
            label="Частые вопросы"
            onClick={onFaqClick}
          />
          <MenuItem
            icon={Mail}
            label="Связаться с нами"
            onClick={onSupportClick}
          />
          <MenuItem
            icon={FileText}
            label="Условия использования"
            onClick={onTermsClick}
          />
          <MenuItem
            icon={Lock}
            label="Политика конфиденциальности"
            onClick={onPrivacyPolicyClick}
          />
        </div>

        {/* Logout */}
        <div className="p-4 pt-2">
          <MenuItem
            icon={LogOut}
            label="Выйти"
            onClick={onLogout}
            danger
          />
        </div>

        {/* App version */}
        <div className="text-center pb-8 pt-4">
          <p className="ga-body text-[10px] text-gray-300">Версия 1.0.0</p>
        </div>
      </div>
    </div>
  );
};
