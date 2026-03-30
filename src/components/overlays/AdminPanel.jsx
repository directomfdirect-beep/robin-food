import React, { useState } from 'react';
import { X, Smartphone, LayoutGrid, RotateCcw } from 'lucide-react';
import { OnboardingEditor } from './OnboardingEditor';
import { TabsEditor } from './TabsEditor';

const SECTIONS = [
  { id: 'onboarding', label: 'Онбординг', icon: Smartphone },
  { id: 'tabs', label: 'Табы и фильтры', icon: LayoutGrid },
];

/**
 * Admin panel overlay — accessible only in #dev mode.
 * Provides editors for onboarding slides and tab/category config.
 */
export const AdminPanel = ({ config, onUpdateOnboarding, onUpdateTabs, onUpdateCategories, onResetAll, onClose }) => {
  const [activeSection, setActiveSection] = useState('onboarding');

  return (
    <div className="fixed inset-0 z-[999999] flex flex-col">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative mt-auto bg-white rounded-t-[36px] flex flex-col max-h-[90vh]">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center">
              <span className="text-acid text-[9px] font-black">DEV</span>
            </div>
            <h2 className="text-lg font-black uppercase italic">Admin Panel</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onResetAll}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-xl text-[10px] font-bold uppercase text-gray-500 hover:bg-gray-200 transition-colors"
            >
              <RotateCcw size={11} />
              Сбросить всё
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Section tabs */}
        <div className="flex gap-2 px-6 pb-3 flex-shrink-0">
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-[10px] font-bold uppercase transition-colors ${
                activeSection === id
                  ? 'bg-black text-acid'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              <Icon size={12} />
              {label}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-100 flex-shrink-0" />

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 pb-8">
          {activeSection === 'onboarding' && (
            <OnboardingEditor
              slides={config.onboarding}
              onChange={onUpdateOnboarding}
            />
          )}
          {activeSection === 'tabs' && (
            <TabsEditor
              tabs={config.tabs}
              categories={config.categories}
              onTabsChange={onUpdateTabs}
              onCategoriesChange={onUpdateCategories}
            />
          )}
        </div>
      </div>
    </div>
  );
};
