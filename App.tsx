import React, { useState } from 'react';
import { ChefHat, Loader2, Image as ImageIcon, Sparkles, ArrowRight, Upload, AlertCircle } from 'lucide-react';
import { Dish, PhotoStyle } from './types';
import { INITIAL_MENU_PLACEHOLDER } from './constants';
import { parseMenuText, generateDishImage } from './services/geminiService';
import { StyleSelector } from './components/StyleSelector';
import { EditDialog } from './components/EditDialog';

const App: React.FC = () => {
  // State
  const [menuText, setMenuText] = useState(INITIAL_MENU_PLACEHOLDER);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [style, setStyle] = useState<PhotoStyle>('Rustic/Dark');
  const [customStylePrompt, setCustomStylePrompt] = useState('');
  const [errorMap, setErrorMap] = useState<Record<string, string>>({});
  
  const [isParsing, setIsParsing] = useState(false);
  
  // Edit State
  const [editingDishId, setEditingDishId] = useState<string | null>(null);

  // Parsing Handler
  const handleAnalyzeMenu = async () => {
    if (!menuText.trim()) return;
    
    setIsParsing(true);
    setDishes([]); // Clear previous
    setErrorMap({});
    
    try {
      const extractedDishes = await parseMenuText(menuText);
      setDishes(extractedDishes);
    } catch (error) {
      console.error("Error parsing menu:", error);
      alert("Failed to analyze menu. Please try again.");
    } finally {
      setIsParsing(false);
    }
  };

  // Generation Handler
  const handleGenerateImage = async (dishId: string) => {
    setDishes(prev => prev.map(d => d.id === dishId ? { ...d, isGenerating: true } : d));
    setErrorMap(prev => ({ ...prev, [dishId]: '' }));
    
    try {
      const dish = dishes.find(d => d.id === dishId);
      if (!dish) return;

      // Pass the custom style prompt along with the selected style
      const imageUrl = await generateDishImage(dish, style, customStylePrompt);
      
      setDishes(prev => prev.map(d => 
        d.id === dishId 
          ? { ...d, generatedImage: imageUrl, isGenerating: false } 
          : d
      ));
    } catch (error: any) {
      console.error("Error generating image:", error);
      
      let errorMessage = "Image generation failed. Please try again.";
      const msg = error.message ? error.message.toLowerCase() : "";
      const errorStr = error.toString().toLowerCase();

      if (msg.includes("xhr error") || msg.includes("fetch failed") || errorStr.includes("network")) {
         errorMessage = "Connection issue. Please check your network and try again.";
      } else if (msg.includes("safety") || msg.includes("blocked")) {
         errorMessage = "Content blocked by safety filters. Try rewording the description.";
      } else if (msg.includes("429") || msg.includes("quota")) {
         errorMessage = "Usage limit reached. Please try again in a moment.";
      } else if (msg.includes("no image generated")) {
         errorMessage = "The AI couldn't generate an image. Try adjusting the style or details.";
      } else {
         errorMessage = "Generation failed. Try adjusting the custom details or simply retry.";
      }

      setErrorMap(prev => ({ ...prev, [dishId]: errorMessage }));
      setDishes(prev => prev.map(d => d.id === dishId ? { ...d, isGenerating: false } : d));
    }
  };

  const handleUpdateDishImage = (dishId: string, newImageUrl: string) => {
    setDishes(prev => prev.map(d => 
      d.id === dishId ? { ...d, generatedImage: newImageUrl } : d
    ));
  };

  // Get current editing dish
  const currentEditingDish = dishes.find(d => d.id === editingDishId);

  return (
    <div className="min-h-screen bg-black font-sans text-white pb-20">
      {/* Header */}
      <header className="bg-black border-b border-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-white p-2 rounded-lg">
              <ChefHat className="w-6 h-6 text-black" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-200">
              CulinaryLens AI
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-white font-medium hidden sm:block">
              Virtual Food Photographer
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Input Section */}
        <section className="mb-12">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Transform Your Menu into Art</h2>
            <p className="text-lg text-white">
              Paste your text-based menu below. We'll extract the dishes and generate professional photography in your chosen style.
            </p>
          </div>

          <div className="bg-black rounded-2xl shadow-none overflow-hidden border border-white">
            <div className="p-6 md:p-8">
              <textarea
                value={menuText}
                onChange={(e) => setMenuText(e.target.value)}
                className="w-full h-48 p-4 text-white bg-black border border-white rounded-xl focus:ring-2 focus:ring-white focus:border-white outline-none resize-none font-mono text-sm"
                placeholder="Paste your menu here..."
              />
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleAnalyzeMenu}
                  disabled={isParsing || !menuText.trim()}
                  className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-all transform hover:scale-105 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isParsing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing Menu...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Analyze Menu
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Results Section */}
        {dishes.length > 0 && (
          <section className="animate-fade-in-up">
            <div className="flex items-center justify-between mb-8 border-b border-white pb-4">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="bg-white text-black w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                  {dishes.length}
                </span>
                Dishes Detected
              </h3>
            </div>

            <StyleSelector 
              currentStyle={style} 
              onStyleChange={setStyle}
              customPrompt={customStylePrompt}
              onCustomPromptChange={setCustomStylePrompt}
              disabled={dishes.some(d => d.isGenerating)}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {dishes.map((dish) => (
                <div 
                  key={dish.id} 
                  className="bg-black rounded-2xl overflow-hidden shadow-sm border border-white hover:shadow-md transition-all flex flex-col"
                >
                  {/* Image Area */}
                  <div className="aspect-square bg-zinc-900 relative group border-b border-white">
                    {dish.isGenerating ? (
                      <div className="absolute inset-0 w-full h-full skeleton-shimmer">
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10 backdrop-blur-[1px]">
                          <Loader2 className="w-8 h-8 animate-spin text-white/90 mb-3" />
                          <p className="text-white/90 font-medium text-sm tracking-wide shadow-black drop-shadow-md">Developing photo...</p>
                        </div>
                      </div>
                    ) : dish.generatedImage ? (
                      <>
                        <img 
                          src={dish.generatedImage} 
                          alt={dish.name} 
                          className="w-full h-full object-cover animate-fade-in-up"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                          <button
                            onClick={() => setEditingDishId(dish.id)}
                            className="px-6 py-2 bg-white text-black font-semibold rounded-full shadow-lg hover:bg-slate-200 transition-colors flex items-center gap-2"
                          >
                            <Sparkles className="w-4 h-4" />
                            Edit with AI
                          </button>
                          <a 
                            href={dish.generatedImage} 
                            download={`${dish.name.replace(/\s+/g, '-').toLowerCase()}.png`}
                            className="px-6 py-2 bg-black text-white border border-white font-semibold rounded-full shadow-lg hover:bg-zinc-900 transition-colors flex items-center gap-2"
                          >
                            <Upload className="w-4 h-4 rotate-180" />
                            Download
                          </a>
                        </div>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8 text-center">
                        {errorMap[dish.id] ? (
                          <div className="flex flex-col items-center text-red-400 p-4">
                             <AlertCircle className="w-10 h-10 mb-2" />
                             <p className="text-sm font-medium">{errorMap[dish.id]}</p>
                          </div>
                        ) : (
                          <>
                            <ImageIcon className="w-12 h-12 mb-4 opacity-50" />
                            <p>Ready to generate</p>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Content Area */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-white mb-2">{dish.name}</h4>
                      <p className="text-white text-sm leading-relaxed">{dish.description}</p>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-white">
                      <button
                        onClick={() => handleGenerateImage(dish.id)}
                        disabled={dish.isGenerating}
                        className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all border ${
                          dish.generatedImage 
                            ? 'bg-black text-white border-white hover:bg-zinc-900'
                            : 'bg-white text-black border-transparent hover:bg-slate-200'
                        }`}
                      >
                        {dish.isGenerating ? (
                          <span className="flex items-center gap-2">
                             Generating...
                          </span>
                        ) : dish.generatedImage ? (
                          <>
                            <Sparkles className="w-4 h-4" />
                            Regenerate Photo
                          </>
                        ) : (
                          <>
                            Generate Photo
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Edit Dialog */}
      {currentEditingDish && currentEditingDish.generatedImage && (
        <EditDialog 
          isOpen={!!currentEditingDish}
          imageSrc={currentEditingDish.generatedImage}
          onClose={() => setEditingDishId(null)}
          onImageUpdate={(newImage) => handleUpdateDishImage(currentEditingDish.id, newImage)}
        />
      )}
    </div>
  );
};

export default App;