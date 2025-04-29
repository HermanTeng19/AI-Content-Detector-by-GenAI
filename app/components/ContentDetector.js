'use client';
import { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

export default function ContentDetector() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [animatedPercent, setAnimatedPercent] = useState(0);

  useEffect(() => {
    if (result) {
      const targetPercent = result.aiProbability * 100;
      let start = 0;
      const duration = 1000; // 1 second animation
      const startTime = performance.now();
      
      const animate = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const currentValue = progress * targetPercent;
        
        setAnimatedPercent(currentValue);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [result]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    setAnimatedPercent(0);

    try {
      const response = await fetch('/api/detect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to detect AI content');
      }
      
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getResultColor = (aiProb) => {
    if (aiProb > 0.7) {
      return {
        bg: '#fee2e2',
        text: '#b91c1c',
        gradient: 'from-red-400 to-red-600',
        ring: 'ring-red-400',
        light: '#fecaca'
      };
    } else if (aiProb > 0.4) {
      return {
        bg: '#fef3c7',
        text: '#92400e',
        gradient: 'from-amber-400 to-amber-600',
        ring: 'ring-amber-400',
        light: '#fde68a'
      };
    } else {
      return {
        bg: '#dcfce7',
        text: '#166534',
        gradient: 'from-green-400 to-green-600',
        ring: 'ring-green-400',
        light: '#bbf7d0'
      };
    }
  };

  const getResultLabel = (aiProb) => {
    if (aiProb > 0.7) {
      return 'Likely AI-generated';
    } else if (aiProb > 0.4) {
      return 'Possibly AI-generated';
    } else {
      return 'Likely human-written';
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="text" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
            Enter text to analyze
          </label>
          <div className="relative">
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={8}
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm transition-all duration-200 ease-in-out"
              placeholder="Paste text here to check if it was AI-generated..."
              required
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-400 dark:text-gray-500">
              {text.length > 0 ? text.split(/\s+/).length : 0} words
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all duration-200 ease-in-out transform hover:translate-y-[-2px]"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <LoadingSpinner size="small" />
              <span className="ml-2">Analyzing...</span>
            </span>
          ) : (
            'Detect AI Content'
          )}
        </button>
      </form>

      {loading && (
        <div className="mt-12 text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-gray-600 dark:text-gray-300 animate-pulse">Analyzing your text...</p>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-xl border border-red-100 dark:border-red-800">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}

      {result && !loading && (
        <div className="mt-8 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-500 ease-in-out">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white">Analysis Results</h2>
          </div>
          
          <div className="p-6">
            {/* Pie Chart */}
            <div className="mb-8 relative">
              <div className="mx-auto w-56 h-56 relative">
                <svg viewBox="0 0 100 100" className="w-full">
                  {/* Background circle */}
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="42" 
                    fill="transparent" 
                    stroke="#f3f4f6" 
                    strokeWidth="16" 
                    className="dark:stroke-gray-700" 
                  />
                  
                  {/* Progress circle with gradient */}
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="transparent"
                    stroke="url(#pieGradient)"
                    strokeWidth="16"
                    strokeDasharray={`${animatedPercent * 2.64} ${(100 - animatedPercent) * 2.64}`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                    style={{ filter: 'url(#dropShadow)' }}
                  />
                  
                  {/* Inner circle for cleaner look */}
                  <circle
                    cx="50"
                    cy="50"
                    r="32"
                    fill="white"
                    className="dark:fill-gray-800"
                  />
                  
                  {/* Definitions */}
                  <defs>
                    {/* Gradient for the progress circle */}
                    <linearGradient id="pieGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#4f46e5" />
                    </linearGradient>
                    
                    {/* Drop shadow for the progress circle */}
                    <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#4f46e5" floodOpacity="0.3" />
                    </filter>
                  </defs>
                </svg>
                
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <div className="text-4xl font-bold text-gray-900 dark:text-white">
                    {Math.round(animatedPercent)}%
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">AI Probability</div>
                </div>
              </div>
              
              <div className="flex justify-center gap-8 text-sm mt-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-indigo-600 mr-2"></div>
                  <span className="text-gray-700 dark:text-gray-300">AI: {(result.aiProbability * 100).toFixed(0)}%</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600 mr-2"></div>
                  <span className="text-gray-700 dark:text-gray-300">Human: {(result.humanProbability * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
            
            {/* Verdict */}
            <div className={`mb-6 p-4 rounded-lg font-semibold text-center bg-${getResultColor(result.aiProbability).light} text-${getResultColor(result.aiProbability).text} ring-1 ${getResultColor(result.aiProbability).ring}`}>
              <div className="flex items-center justify-center">
                {result.aiProbability > 0.7 ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : result.aiProbability > 0.4 ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                {getResultLabel(result.aiProbability)}
              </div>
            </div>
            
            {/* Probability Details */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                <div className="font-bold text-xl text-gray-900 dark:text-white mb-1">
                  {(result.aiProbability * 100).toFixed(2)}%
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">AI Probability</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                <div className="font-bold text-xl text-gray-900 dark:text-white mb-1">
                  {(result.humanProbability * 100).toFixed(2)}%
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Human Probability</div>
              </div>
            </div>
            
            {/* Stats Section */}
            {result.textStats && (
              <div className="rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Text Statistics</h3>
                </div>
                <div className="grid grid-cols-3 divide-x divide-gray-200 dark:divide-gray-600">
                  <div className="p-4 text-center">
                    <p className="font-bold text-xl text-gray-900 dark:text-white">{result.textStats.wordCount}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Words</p>
                  </div>
                  <div className="p-4 text-center">
                    <p className="font-bold text-xl text-gray-900 dark:text-white">{result.textStats.sentenceCount}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Sentences</p>
                  </div>
                  <div className="p-4 text-center">
                    <p className="font-bold text-xl text-gray-900 dark:text-white">{result.textStats.avgWordsPerSentence}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Words/Sentence</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Tip */}
            <div className="mt-6 text-sm text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800/30">
              <p className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Our detector provides an estimate. Results may vary for heavily edited or technical content.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 