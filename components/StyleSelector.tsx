import React from 'react';
import { PhotoStyle } from '../types';
import { Camera, Monitor, Smartphone } from 'lucide-react';

interface StyleSelectorProps {
  currentStyle: PhotoStyle;
  onStyleChange: (style: PhotoStyle) => void;
  customPrompt: string;
  onCustomPromptChange: (prompt: string) => void;
  disabled?: boolean;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  currentStyle,
  onStyleChange,
  customPrompt,
  onCustomPromptChange,
  disabled
}) => {
  return (
    <div className="bg-white dark:bg-black p-6 rounded-xl shadow-sm border border-slate-200 dark:border-white mb-8 transition-colors duration-200">
      <h3 className="text-sm font-semibold text-slate-500 dark:text-white uppercase tracking-wider mb-4">Photography Settings</h3>
      
      <div className="mb-6">
        <label className="block text-slate-700 dark:text-white font-medium mb-3">Aesthetic Style</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => onStyleChange('Rustic/Dark')}
            disabled={disabled}
            className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
              currentStyle === 'Rustic/Dark'
                ? 'border-indigo-600 bg-indigo-50 dark:bg-white dark:text-black dark:border-white text-indigo-700'
                : 'border-slate-200 dark:border-white hover:border-slate-300 dark:hover:border-slate-200 text-slate-600 dark:text-white dark:bg-black'
            }`}
          >
            <Camera className="w-6 h-6 mb-2" />
            <span className="text-sm font-medium">Rustic / Dark</span>
          </button>
          <button
            onClick={() => onStyleChange('Bright/Modern')}
            disabled={disabled}
            className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
              currentStyle === 'Bright/Modern'
                ? 'border-indigo-600 bg-indigo-50 dark:bg-white dark:text-black dark:border-white text-indigo-700'
                : 'border-slate-200 dark:border-white hover:border-slate-300 dark:hover:border-slate-200 text-slate-600 dark:text-white dark:bg-black'
            }`}
          >
            <Monitor className="w-6 h-6 mb-2" />
            <span className="text-sm font-medium">Bright / Modern</span>
          </button>
          <button
            onClick={() => onStyleChange('Social Media')}
            disabled={disabled}
            className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
              currentStyle === 'Social Media'
                ? 'border-indigo-600 bg-indigo-50 dark:bg-white dark:text-black dark:border-white text-indigo-700'
                : 'border-slate-200 dark:border-white hover:border-slate-300 dark:hover:border-slate-200 text-slate-600 dark:text-white dark:bg-black'
            }`}
          >
            <Smartphone className="w-6 h-6 mb-2" />
            <span className="text-sm font-medium">Social Media</span>
          </button>
        </div>
      </div>

      <div>
        <label className="block text-slate-700 dark:text-white font-medium mb-3">
          Custom Details <span className="text-slate-400 dark:text-slate-400 font-normal text-sm ml-1">(Optional)</span>
        </label>
        <textarea
          value={customPrompt}
          onChange={(e) => onCustomPromptChange(e.target.value)}
          disabled={disabled}
          placeholder="Add extra details (e.g., 'golden hour lighting', 'vintage silverware', 'close-up macro shot')"
          className="w-full h-20 p-3 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-white focus:border-indigo-500 dark:focus:border-white outline-none resize-none transition-all text-sm"
        />
      </div>
    </div>
  );
};