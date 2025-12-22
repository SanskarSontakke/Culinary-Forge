import React, { useState } from 'react';
import { X, Sparkles, Wand2, Layers, CheckCircle2 } from 'lucide-react';
import { editDishImage } from '../services/geminiService';

interface EditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onImageUpdate: (newImage: string) => void;
}

export const EditDialog: React.FC<EditDialogProps> = ({ isOpen, onClose, imageSrc, onImageUpdate }) => {
  const [prompt, setPrompt] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isGeneratingVariations, setIsGeneratingVariations] = useState(false);
  const [currentImage, setCurrentImage] = useState(imageSrc);
  const [error, setError] = useState<string | null>(null);
  const [variations, setVariations] = useState<string[]>([]);

  // Update local image state when prop changes
  React.useEffect(() => {
    setCurrentImage(imageSrc);
    setVariations([]);
    setError(null);
    setPrompt('');
  }, [imageSrc, isOpen]);

  if (!isOpen) return null;

  const handleEdit = async () => {
    if (!prompt.trim()) return;
    setIsEditing(true);
    setError(null);
    try {
      const newImage = await editDishImage(currentImage, prompt);
      setCurrentImage(newImage);
      setVariations([]); // Clear variations as we have a new main image
      onImageUpdate(newImage);
      setPrompt(''); 
    } catch (err) {
      setError('Failed to edit image. Please try again.');
      console.error(err);
    } finally {
      setIsEditing(false);
    }
  };

  const handleGenerateVariations = async () => {
    if (!prompt.trim()) return;
    setIsGeneratingVariations(true);
    setError(null);
    setVariations([]); // Clear previous variations while loading
    
    try {
        // Generate 3 variations in parallel
        const promises = [1, 2, 3].map(() => editDishImage(currentImage, prompt));
        
        // Use allSettled to handle partial failures
        const results = await Promise.allSettled(promises);
        const successful = results
            .filter((r): r is PromiseFulfilledResult<string> => r.status === 'fulfilled')
            .map(r => r.value);

        if (successful.length === 0) {
            throw new Error("Failed to generate any variations");
        }

        setVariations(successful);
        setPrompt('');
    } catch (err) {
        setError('Failed to generate variations. Please try again.');
        console.error(err);
    } finally {
        setIsGeneratingVariations(false);
    }
  };

  const handleSelectVariation = (variant: string) => {
      setCurrentImage(variant);
      onImageUpdate(variant);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-950 rounded-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200 dark:border-zinc-800 shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-zinc-800 flex justify-between items-center bg-slate-50 dark:bg-zinc-900">
          <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            AI Editor
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-500 dark:text-zinc-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100 dark:bg-zinc-900">
          <div className="flex flex-col items-center gap-6">
            
            {/* Main Image */}
            <div className="relative shadow-xl rounded-lg overflow-hidden max-w-full group">
              <img src={currentImage} alt="Editing target" className="max-h-[45vh] object-contain bg-zinc-800" />
              {(isEditing || isGeneratingVariations) && (
                 <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center">
                   <div className="flex flex-col items-center">
                     <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 dark:border-white border-t-transparent mb-3"></div>
                     <span className="font-semibold text-indigo-900 dark:text-white bg-white/80 dark:bg-black/80 px-4 py-1.5 rounded-full shadow-lg">
                        {isGeneratingVariations ? 'Creating variations...' : 'Refining...'}
                     </span>
                   </div>
                 </div>
              )}
            </div>

            {/* Variations Grid */}
            {variations.length > 0 && (
              <div className="w-full max-w-4xl animate-fade-in-up">
                <div className="flex items-center gap-2 mb-3 text-slate-700 dark:text-slate-300 font-medium">
                    <Layers className="w-4 h-4" />
                    <span>Variations</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {variations.map((variant, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleSelectVariation(variant)}
                            className={`relative rounded-lg overflow-hidden aspect-square border-2 transition-all group ${
                                currentImage === variant 
                                ? 'border-indigo-500 ring-2 ring-indigo-500/20' 
                                : 'border-transparent hover:border-indigo-300 dark:hover:border-zinc-600'
                            }`}
                        >
                            <img src={variant} alt={`Variation ${idx + 1}`} className="w-full h-full object-cover" />
                            {currentImage === variant && (
                                <div className="absolute top-2 right-2 bg-indigo-500 text-white p-1 rounded-full shadow-lg">
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 bg-white dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-800">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            What would you like to change?
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'Make it look more spicy', 'Add dramatic lighting'"
              className="flex-1 px-4 py-3 border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-600"
              onKeyDown={(e) => e.key === 'Enter' && !isEditing && !isGeneratingVariations && handleEdit()}
            />
            <div className="flex gap-2 shrink-0">
                <button
                onClick={handleGenerateVariations}
                disabled={isEditing || isGeneratingVariations || !prompt.trim()}
                className="px-5 py-3 bg-zinc-100 dark:bg-zinc-800 text-slate-900 dark:text-white font-medium rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                title="Generate 3 options"
                >
                <Layers className="w-5 h-5" />
                <span className="hidden sm:inline">Variations</span>
                </button>

                <button
                onClick={handleEdit}
                disabled={isEditing || isGeneratingVariations || !prompt.trim()}
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20"
                >
                <Sparkles className="w-5 h-5" />
                <span>Apply Edit</span>
                </button>
            </div>
          </div>
          
          {error && (
              <div className="mt-3 text-red-500 text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  {error}
              </div>
          )}
          
          <p className="text-xs text-slate-400 dark:text-zinc-500 mt-3 flex items-center gap-1">
            <Wand2 className="w-3 h-3" />
            Powered by Gemini 2.5 Flash. Describes the change you want to see.
          </p>
        </div>
      </div>
    </div>
  );
};