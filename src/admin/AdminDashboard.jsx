import React, { useState, useCallback, useRef } from 'react';
import {
  LogOut, Smartphone, LayoutGrid, Save, RotateCcw, CheckCircle2,
  Plus, Trash2, ChevronUp, ChevronDown, Upload, Eye, EyeOff, X,
  Radar, ShoppingBag, Heart, User, Star, Bell, Map, Tag, Home, Search, Gift, Settings,
} from 'lucide-react';
import { ONBOARDING_DATA, CATEGORIES } from '@/data/constants';

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'rf_admin_config';

const ICON_MAP = {
  Radar, LayoutGrid, ShoppingBag, Heart, User, Star, Bell, Map, Tag, Home, Search, Gift, Settings,
};

const ICON_OPTIONS = Object.keys(ICON_MAP);

const DEFAULT_TABS = [
  { id: 'home', label: 'Каталог', icon: 'Radar' },
  { id: 'categories', label: 'Разделы', icon: 'LayoutGrid' },
  { id: 'cart', label: 'Корзина', icon: 'ShoppingBag' },
  { id: 'favorites', label: 'Избранное', icon: 'Heart' },
  { id: 'profile', label: 'Профиль', icon: 'User' },
];

const getDefaults = () => ({
  onboarding: ONBOARDING_DATA,
  tabs: DEFAULT_TABS,
  categories: CATEGORIES,
});

const loadConfig = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaults();
    const saved = JSON.parse(raw);
    // Migrate tabs without icon field
    if (saved.tabs) {
      saved.tabs = saved.tabs.map((t, i) => ({
        icon: DEFAULT_TABS[i]?.icon || 'User',
        ...t,
      }));
    }
    return { ...getDefaults(), ...saved };
  } catch {
    return getDefaults();
  }
};

const saveConfig = (config) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
};

// ─── Phone Preview Frame ───────────────────────────────────────────────────────

const PhoneFrame = ({ children }) => (
  <div className="flex-shrink-0 mx-auto" style={{ width: 280 }}>
    <div
      className="relative bg-black rounded-[40px] overflow-hidden shadow-2xl border-[8px] border-black"
      style={{ height: 560 }}
    >
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-b-2xl z-10" />
      <div className="w-full h-full overflow-hidden rounded-[32px] bg-white relative">
        {children}
      </div>
    </div>
  </div>
);

// ─── Onboarding Phone Preview ─────────────────────────────────────────────────

const OnboardingPreview = ({ slides, activeIdx, onDotClick }) => {
  const slide = slides[activeIdx] || slides[0];
  if (!slide) return null;

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Image 65% */}
      <div className="relative flex-shrink-0" style={{ height: '65%' }}>
        {slide.image ? (
          <img src={slide.image} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-xs">Нет фото</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-white" />
        <div className="absolute top-7 right-3 bg-black/40 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[7px] font-black uppercase">
          Пропустить
        </div>
      </div>

      {/* Content card */}
      <div className="flex-1 bg-white px-5 py-4 flex flex-col justify-between -mt-6 rounded-t-[28px] relative z-10 shadow-2xl">
        <div className="space-y-1.5">
          <h2 className="text-[13px] font-black uppercase italic leading-tight line-clamp-2">
            {slide.title || 'Заголовок'}
          </h2>
          <p className="text-gray-400 text-[9px] leading-snug line-clamp-3">
            {slide.description || 'Описание слайда'}
          </p>
        </div>

        <div className="flex flex-col gap-2 items-center pb-1">
          {/* Dots */}
          <div className="flex gap-1">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => onDotClick(i)}
                className={`h-1 rounded-full transition-all duration-300 ${i === activeIdx ? 'w-5 bg-[#BDFF00]' : 'w-1.5 bg-gray-200'}`}
              />
            ))}
          </div>
          {/* Button */}
          <div className="w-full bg-black text-[#BDFF00] rounded-xl py-2 text-center text-[9px] font-black uppercase">
            {activeIdx === slides.length - 1 ? 'Начать покупки' : 'Далее →'}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Nav Bar Preview ──────────────────────────────────────────────────────────

const NavBarPreview = ({ tabs, activeId, onTabClick }) => (
  <div className="bg-white border-t border-gray-100 px-2 py-2 flex justify-between items-center shadow-lg rounded-b-[32px]">
    {tabs.map((tab) => {
      const IconComp = ICON_MAP[tab.icon] || User;
      const isActive = tab.id === activeId;
      return (
        <button
          key={tab.id}
          onClick={() => onTabClick(tab.id)}
          className={`flex flex-col items-center gap-0.5 transition-all min-w-[36px] py-0.5 ${isActive ? 'text-black scale-110' : 'text-gray-300'}`}
        >
          <IconComp size={16} strokeWidth={isActive ? 2.5 : 2} />
          <span className={`text-[6px] font-bold uppercase ${isActive ? 'opacity-100' : 'opacity-50'}`}>
            {tab.label}
          </span>
        </button>
      );
    })}
  </div>
);

// ─── Image Upload Button ──────────────────────────────────────────────────────

const ImageUpload = ({ onUpload }) => {
  const inputRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Файл слишком большой. Максимум 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => onUpload(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleFile}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-1.5 px-3 py-2 bg-black/10 border border-black/30 text-black rounded-xl text-xs font-bold hover:bg-black/20 transition-colors"
      >
        <Upload size={13} />
        Загрузить фото
      </button>
    </>
  );
};

// ─── Onboarding Editor ────────────────────────────────────────────────────────

const OnboardingEditor = ({ slides, activeIdx, onActiveChange, onChange }) => {
  const update = (index, field, value) => {
    onChange(slides.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  };

  const addSlide = () => {
    onChange([...slides, { title: 'Новый слайд', description: 'Описание', image: '' }]);
    onActiveChange(slides.length);
  };

  const removeSlide = (index) => {
    if (slides.length <= 1) return;
    const next = slides.filter((_, i) => i !== index);
    onChange(next);
    onActiveChange(Math.min(activeIdx, next.length - 1));
  };

  const move = (index, dir) => {
    const next = [...slides];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
    onActiveChange(target);
  };

  return (
    <div className="space-y-2">
      {slides.map((slide, index) => {
        const isOpen = activeIdx === index;
        return (
          <div
            key={index}
            className={`rounded-2xl overflow-hidden border transition-colors ${isOpen ? 'border-black/40 bg-white' : 'border-gray-100 bg-gray-50'}`}
          >
            {/* Row */}
            <div
              className="flex items-center gap-3 p-3 cursor-pointer"
              onClick={() => onActiveChange(isOpen ? -1 : index)}
            >
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                {slide.image ? (
                  <img src={slide.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <Upload size={16} />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black uppercase italic truncate">{slide.title || '—'}</p>
                <p className="text-xs text-gray-400 truncate mt-0.5">{slide.description || '—'}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => move(index, -1)} disabled={index === 0} className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-20">
                  <ChevronUp size={13} />
                </button>
                <button onClick={() => move(index, 1)} disabled={index === slides.length - 1} className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-20">
                  <ChevronDown size={13} />
                </button>
                <button onClick={() => removeSlide(index)} disabled={slides.length <= 1} className="p-1.5 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-500 disabled:opacity-20">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            {/* Expanded form */}
            {isOpen && (
              <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1.5">Заголовок</label>
                  <input
                    type="text"
                    value={slide.title}
                    onChange={(e) => update(index, 'title', e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-acid/30"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1.5">Описание</label>
                  <textarea
                    value={slide.description}
                    onChange={(e) => update(index, 'description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-acid/30"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1.5">Изображение</label>
                  <div className="flex items-center gap-2 flex-wrap">
                    <ImageUpload onUpload={(data) => update(index, 'image', data)} />
                    {slide.image && (
                      <button
                        onClick={() => update(index, 'image', '')}
                        className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600"
                      >
                        <X size={12} /> Удалить фото
                      </button>
                    )}
                  </div>
                  {slide.image && (
                    <img
                      src={slide.image}
                      alt="preview"
                      className="mt-2 w-full h-28 object-cover rounded-xl bg-gray-100"
                    />
                  )}
                  <p className="text-[10px] text-gray-400 mt-1.5">PNG, JPEG, WebP · макс. 2 МБ</p>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <button
        onClick={addSlide}
        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 rounded-2xl text-xs font-bold uppercase text-gray-400 hover:border-black hover:text-black transition-colors"
      >
        <Plus size={13} /> Добавить слайд
      </button>
    </div>
  );
};

// ─── Tabs Editor ──────────────────────────────────────────────────────────────

const NEW_TAB_DEFAULTS = { id: '', label: '', icon: 'Star' };

const TabsEditor = ({ tabs, activeTabId, onActiveTabChange, onTabsChange }) => {
  const [adding, setAdding] = useState(false);
  const [newTab, setNewTab] = useState(NEW_TAB_DEFAULTS);
  const [newTabError, setNewTabError] = useState('');

  const updateTab = (index, field, value) => {
    onTabsChange(tabs.map((t, i) => (i === index ? { ...t, [field]: value } : t)));
  };

  const removeTab = (index) => {
    if (tabs.length <= 2) return;
    const next = tabs.filter((_, i) => i !== index);
    onTabsChange(next);
    if (activeTabId === tabs[index].id) onActiveTabChange(next[0]?.id);
  };

  const move = (index, dir) => {
    const next = [...tabs];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onTabsChange(next);
  };

  const addTab = () => {
    const id = newTab.id.trim().toLowerCase().replace(/\s+/g, '_');
    const label = newTab.label.trim();
    if (!id) { setNewTabError('Укажите ID'); return; }
    if (!label) { setNewTabError('Укажите название'); return; }
    if (tabs.find((t) => t.id === id)) { setNewTabError('Такой ID уже существует'); return; }
    onTabsChange([...tabs, { id, label, icon: newTab.icon }]);
    setNewTab(NEW_TAB_DEFAULTS);
    setAdding(false);
    setNewTabError('');
  };

  return (
    <div className="space-y-2">
      {tabs.map((tab, index) => {
        const IconComp = ICON_MAP[tab.icon] || User;
        return (
          <div key={tab.id} className={`rounded-2xl border transition-colors ${activeTabId === tab.id ? 'border-black/40 bg-white' : 'border-gray-100 bg-gray-50'}`}>
            <div className="flex items-center gap-3 p-3">
              {/* Icon picker */}
              <div className="relative flex-shrink-0">
                <div
                  className="w-10 h-10 rounded-xl bg-black flex items-center justify-center cursor-pointer"
                  onClick={() => onActiveTabChange(tab.id)}
                  title="Нажмите для превью"
                >
                  <IconComp size={18} className="text-[#BDFF00]" />
                </div>
              </div>

              <div className="flex-1 min-w-0 space-y-1.5">
                {/* Label */}
                <input
                  type="text"
                  value={tab.label}
                  onChange={(e) => updateTab(index, 'label', e.target.value)}
                  placeholder="Название"
                  className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-acid/30"
                />
                {/* Icon selector */}
                <div className="flex gap-1 flex-wrap">
                  {ICON_OPTIONS.map((key) => {
                    const IC = ICON_MAP[key];
                    return (
                      <button
                        key={key}
                        onClick={() => updateTab(index, 'icon', key)}
                        title={key}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${tab.icon === key ? 'bg-black text-[#BDFF00]' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                      >
                        <IC size={13} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-1 flex-shrink-0">
                <button onClick={() => move(index, -1)} disabled={index === 0} className="p-1 rounded-lg hover:bg-gray-200 disabled:opacity-20">
                  <ChevronUp size={13} />
                </button>
                <button onClick={() => move(index, 1)} disabled={index === tabs.length - 1} className="p-1 rounded-lg hover:bg-gray-200 disabled:opacity-20">
                  <ChevronDown size={13} />
                </button>
                <button onClick={() => removeTab(index)} disabled={tabs.length <= 2} className="p-1 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-500 disabled:opacity-20">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Add new tab form */}
      {adding ? (
        <div className="rounded-2xl border-2 border-dashed border-black/40 bg-black/5 p-4 space-y-3">
          <p className="text-xs font-black uppercase text-black">Новый таб</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">ID (лат.)</label>
              <input
                type="text"
                value={newTab.id}
                onChange={(e) => { setNewTab((p) => ({ ...p, id: e.target.value })); setNewTabError(''); }}
                placeholder="my_tab"
                className="w-full px-2.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-acid/30"
              />
            </div>
            <div>
              <label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Название</label>
              <input
                type="text"
                value={newTab.label}
                onChange={(e) => { setNewTab((p) => ({ ...p, label: e.target.value })); setNewTabError(''); }}
                placeholder="Мой таб"
                className="w-full px-2.5 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-acid/30"
              />
            </div>
          </div>
          <div>
            <label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Иконка</label>
            <div className="flex gap-1.5 flex-wrap">
              {ICON_OPTIONS.map((key) => {
                const IC = ICON_MAP[key];
                return (
                  <button key={key} onClick={() => setNewTab((p) => ({ ...p, icon: key }))} title={key}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${newTab.icon === key ? 'bg-black text-[#BDFF00]' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                  >
                    <IC size={14} />
                  </button>
                );
              })}
            </div>
          </div>
          {newTabError && <p className="text-[10px] text-red-500 font-bold">{newTabError}</p>}
          <div className="flex gap-2">
            <button onClick={addTab} className="flex-1 py-2 bg-black text-[#BDFF00] rounded-xl text-xs font-black uppercase">
              Добавить
            </button>
            <button onClick={() => { setAdding(false); setNewTabError(''); setNewTab(NEW_TAB_DEFAULTS); }} className="px-4 py-2 bg-gray-100 rounded-xl text-xs font-bold text-gray-500">
              Отмена
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 rounded-2xl text-xs font-bold uppercase text-gray-400 hover:border-black hover:text-black transition-colors"
        >
          <Plus size={13} /> Добавить таб
        </button>
      )}
    </div>
  );
};

// ─── Categories Editor ────────────────────────────────────────────────────────

const CategoriesEditor = ({ categories, onChange }) => {
  const [newCat, setNewCat] = useState('');

  const addCat = () => {
    const v = newCat.trim();
    if (!v || categories.includes(v)) return;
    onChange([...categories, v]);
    setNewCat('');
  };

  const removeCat = (cat) => {
    if (categories.length <= 2) return;
    onChange(categories.filter((c) => c !== cat));
  };

  const updateCat = (index, value) => onChange(categories.map((c, i) => (i === index ? value : c)));

  const moveCat = (index, dir) => {
    const next = [...categories];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-2">
      {categories.map((cat, index) => (
        <div key={index} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
          <div className="flex flex-col gap-0.5 flex-shrink-0">
            <button onClick={() => moveCat(index, -1)} disabled={index === 0} className="text-gray-300 hover:text-gray-600 disabled:opacity-20"><ChevronUp size={11} /></button>
            <button onClick={() => moveCat(index, 1)} disabled={index === categories.length - 1} className="text-gray-300 hover:text-gray-600 disabled:opacity-20"><ChevronDown size={11} /></button>
          </div>
          <input
            type="text"
            value={cat}
            onChange={(e) => updateCat(index, e.target.value)}
            disabled={index === 0}
            className="flex-1 px-2.5 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-acid/30 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          />
          {index === 0 ? (
            <span className="text-[8px] text-gray-300 font-bold w-6">фикс</span>
          ) : (
            <button onClick={() => removeCat(cat)} disabled={categories.length <= 2} className="w-7 h-7 flex items-center justify-center rounded-xl hover:bg-red-100 text-gray-400 hover:text-red-500 disabled:opacity-20 flex-shrink-0">
              <Trash2 size={12} />
            </button>
          )}
        </div>
      ))}
      <div className="flex gap-2">
        <input
          type="text" value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addCat()}
          placeholder="Новая категория..."
          className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-acid/30"
        />
        <button onClick={addCat} disabled={!newCat.trim()} className="px-3 py-2 bg-black text-[#BDFF00] rounded-xl text-xs font-bold disabled:opacity-30">
          <Plus size={13} />
        </button>
      </div>
    </div>
  );
};

// ─── Dashboard ────────────────────────────────────────────────────────────────

const SECTIONS = [
  { id: 'onboarding', label: 'Онбординг', icon: Smartphone },
  { id: 'tabs', label: 'Табы и фильтры', icon: LayoutGrid },
];

export const AdminDashboard = ({ onLogout }) => {
  const [activeSection, setActiveSection] = useState('onboarding');
  const [config, setConfig] = useState(loadConfig);
  const [saved, setSaved] = useState(false);

  // Onboarding: which slide is active/open in editor + preview
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);

  // Tabs: which tab is highlighted in preview
  const [previewTabId, setPreviewTabId] = useState(() => loadConfig().tabs[0]?.id || 'home');

  const updateOnboarding = useCallback((slides) => setConfig((p) => ({ ...p, onboarding: slides })), []);
  const updateTabs = useCallback((tabs) => setConfig((p) => ({ ...p, tabs })), []);
  const updateCategories = useCallback((categories) => setConfig((p) => ({ ...p, categories })), []);

  const handleSave = () => {
    saveConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    const defaults = getDefaults();
    setConfig(defaults);
    saveConfig(defaults);
    setActiveSlideIdx(0);
    setPreviewTabId(defaults.tabs[0]?.id);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-[#BDFF00] text-[8px] font-black">RF</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-[9px] font-bold uppercase text-gray-400 leading-none">Robin Food</p>
              <p className="text-sm font-black uppercase italic leading-tight">Admin Panel</p>
            </div>
          </div>

          {/* Section nav — in header on mobile */}
          <div className="flex gap-1.5">
            {SECTIONS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-[10px] sm:text-xs font-bold uppercase transition-colors ${
                  activeSection === id ? 'bg-black text-[#BDFF00]' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                <Icon size={12} />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{label.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleReset}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-500 rounded-xl text-[10px] font-bold uppercase hover:bg-gray-200 transition-colors"
            >
              <RotateCcw size={11} /> Сбросить
            </button>
            <a
              href="https://robin-food.ru"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-500 rounded-xl text-[10px] font-bold uppercase hover:bg-gray-200 transition-colors"
            >
              <Eye size={11} /> Сайт ↗
            </a>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-500 rounded-xl text-[10px] font-bold uppercase hover:bg-red-100 hover:text-red-500 transition-colors"
            >
              <LogOut size={11} />
              <span className="hidden sm:inline">Выйти</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {/* ── Onboarding Section ── */}
        {activeSection === 'onboarding' && (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Editor */}
            <div className="flex-1 min-w-0">
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-sm font-black uppercase italic">Слайды онбординга</h2>
                    <p className="text-[10px] text-gray-400 mt-0.5">{config.onboarding.length} слайда · показываются новым пользователям</p>
                  </div>
                  <button onClick={handleReset} className="sm:hidden flex items-center gap-1 text-[9px] font-bold uppercase text-gray-400">
                    <RotateCcw size={10} /> Сброс
                  </button>
                </div>
                <OnboardingEditor
                  slides={config.onboarding}
                  activeIdx={activeSlideIdx}
                  onActiveChange={setActiveSlideIdx}
                  onChange={updateOnboarding}
                />
              </div>
            </div>

            {/* Preview */}
            <div className="lg:w-72 xl:w-80 flex flex-col items-center gap-4">
              <div className="w-full bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
                <p className="text-[10px] font-bold uppercase text-gray-400 mb-4 text-center">Превью на телефоне</p>
                <PhoneFrame>
                  <OnboardingPreview
                    slides={config.onboarding}
                    activeIdx={Math.min(activeSlideIdx, config.onboarding.length - 1)}
                    onDotClick={setActiveSlideIdx}
                  />
                </PhoneFrame>
                <p className="text-[9px] text-gray-400 text-center mt-3">
                  Нажмите на точки для переключения слайдов
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Tabs Section ── */}
        {activeSection === 'tabs' && (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Editor */}
            <div className="flex-1 min-w-0 space-y-5">
              {/* Tabs editor */}
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-sm font-black uppercase italic">Табы навигации</h2>
                    <p className="text-[10px] text-gray-400 mt-0.5">{config.tabs.length} табов · нижняя панель приложения</p>
                  </div>
                </div>
                <TabsEditor
                  tabs={config.tabs}
                  activeTabId={previewTabId}
                  onActiveTabChange={setPreviewTabId}
                  onTabsChange={updateTabs}
                />
              </div>

              {/* Categories editor */}
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-sm font-black uppercase italic">Фильтры каталога</h2>
                    <p className="text-[10px] text-gray-400 mt-0.5">{config.categories.length} категорий · пилюли в каталоге</p>
                  </div>
                </div>
                <CategoriesEditor categories={config.categories} onChange={updateCategories} />
              </div>
            </div>

            {/* Preview */}
            <div className="lg:w-72 xl:w-80 flex flex-col gap-4">
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
                <p className="text-[10px] font-bold uppercase text-gray-400 mb-4 text-center">Превью навбара</p>
                <PhoneFrame>
                  <div className="flex flex-col h-full">
                    {/* Fake screen */}
                    <div className="flex-1 bg-gray-50 flex flex-col items-center justify-center gap-2 p-6">
                      <div className="w-14 h-14 bg-gray-200 rounded-2xl" />
                      <div className="w-24 h-2.5 bg-gray-200 rounded-full" />
                      <div className="w-16 h-2 bg-gray-100 rounded-full" />
                    </div>
                    {/* Navbar */}
                    <NavBarPreview
                      tabs={config.tabs}
                      activeId={previewTabId}
                      onTabClick={setPreviewTabId}
                    />
                  </div>
                </PhoneFrame>
                <p className="text-[9px] text-gray-400 text-center mt-3">
                  Нажмите на иконку для активного состояния
                </p>
              </div>

              {/* Categories preview pills */}
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
                <p className="text-[10px] font-bold uppercase text-gray-400 mb-3">Превью фильтров</p>
                <div className="flex gap-1.5 flex-wrap">
                  {config.categories.map((cat, i) => (
                    <span
                      key={i}
                      className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase ${i === 0 ? 'bg-black text-[#BDFF00]' : 'bg-gray-100 text-gray-400'}`}
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Save ── */}
        <div className="mt-6">
          <button
            onClick={handleSave}
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-black uppercase transition-all shadow-sm ${
              saved ? 'bg-black text-white' : 'bg-black text-[#BDFF00] hover:bg-gray-900'
            }`}
          >
            {saved ? <><CheckCircle2 size={16} /> Сохранено</> : <><Save size={16} /> Сохранить изменения</>}
          </button>
          <p className="text-center text-[10px] text-gray-300 mt-3">
            Изменения применяются на robin-food.ru автоматически после сохранения
          </p>
        </div>
      </div>
    </div>
  );
};
