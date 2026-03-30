import React, { useState } from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown, Image } from 'lucide-react';
import { ONBOARDING_DATA } from '@/data/constants';

const emptySlide = () => ({
  title: 'Новый слайд',
  description: 'Описание слайда',
  image: '/onboarding/slide1.png',
});

/**
 * Admin editor for onboarding slides.
 * Allows inline edit of title/description/image URL, add/remove/reorder slides.
 */
export const OnboardingEditor = ({ slides, onChange }) => {
  const [expandedIdx, setExpandedIdx] = useState(null);

  const update = (index, field, value) => {
    const next = slides.map((s, i) => (i === index ? { ...s, [field]: value } : s));
    onChange(next);
  };

  const addSlide = () => {
    onChange([...slides, emptySlide()]);
    setExpandedIdx(slides.length);
  };

  const removeSlide = (index) => {
    if (slides.length <= 1) return;
    const next = slides.filter((_, i) => i !== index);
    onChange(next);
    setExpandedIdx(null);
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const next = [...slides];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next);
    setExpandedIdx(index - 1);
  };

  const moveDown = (index) => {
    if (index === slides.length - 1) return;
    const next = [...slides];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onChange(next);
    setExpandedIdx(index + 1);
  };

  const resetToDefaults = () => {
    onChange(ONBOARDING_DATA);
    setExpandedIdx(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-1">
        <p className="text-[10px] font-bold uppercase text-gray-400">
          {slides.length} слайда
        </p>
        <button
          onClick={resetToDefaults}
          className="text-[10px] font-bold uppercase text-gray-400 underline"
        >
          Сбросить
        </button>
      </div>

      {slides.map((slide, index) => (
        <div key={index} className="bg-gray-50 rounded-2xl overflow-hidden">
          {/* Slide header row */}
          <div
            className="flex items-center gap-3 p-3 cursor-pointer"
            onClick={() => setExpandedIdx(expandedIdx === index ? null : index)}
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
              {slide.image ? (
                <img src={slide.image} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Image size={16} className="text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black uppercase italic truncate">{slide.title}</p>
              <p className="text-[10px] text-gray-400 truncate">{slide.description}</p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={(e) => { e.stopPropagation(); moveUp(index); }}
                disabled={index === 0}
                className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-30 transition-colors"
              >
                <ChevronUp size={14} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); moveDown(index); }}
                disabled={index === slides.length - 1}
                className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-30 transition-colors"
              >
                <ChevronDown size={14} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); removeSlide(index); }}
                disabled={slides.length <= 1}
                className="p-1.5 rounded-lg hover:bg-red-100 text-gray-400 hover:text-error disabled:opacity-30 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {/* Expanded edit form */}
          {expandedIdx === index && (
            <div className="px-3 pb-3 space-y-2 border-t border-gray-200 pt-3">
              <div>
                <label className="text-[9px] font-bold uppercase text-gray-400 block mb-1">
                  Заголовок
                </label>
                <input
                  type="text"
                  value={slide.title}
                  onChange={(e) => update(index, 'title', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-acid/30"
                />
              </div>
              <div>
                <label className="text-[9px] font-bold uppercase text-gray-400 block mb-1">
                  Описание
                </label>
                <textarea
                  value={slide.description}
                  onChange={(e) => update(index, 'description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs resize-none focus:outline-none focus:ring-2 focus:ring-acid/30"
                />
              </div>
              <div>
                <label className="text-[9px] font-bold uppercase text-gray-400 block mb-1">
                  URL изображения
                </label>
                <input
                  type="text"
                  value={slide.image}
                  onChange={(e) => update(index, 'image', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-acid/30"
                />
              </div>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={addSlide}
        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 rounded-2xl text-[10px] font-bold uppercase text-gray-400 hover:border-black hover:text-black transition-colors"
      >
        <Plus size={14} />
        Добавить слайд
      </button>
    </div>
  );
};
