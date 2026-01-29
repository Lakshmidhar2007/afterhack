'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Search, X, Sparkles, Terminal } from 'lucide-react';
import { cn, debounce } from '@/lib/utils/helpers';
import { searchWithAI } from '@/services/openRouter';
import '@/styles/ai-search.css';

interface SearchBarProps {
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    onSearch?: (value: string) => void;
    suggestions?: string[];
    onSuggestionClick?: (suggestion: string) => void;
    className?: string;
    showClearButton?: boolean;
    autoFocus?: boolean;
}

export default function SearchBar({
    placeholder = 'Search...',
    value: controlledValue,
    onChange,
    onSearch,
    suggestions = [],
    onSuggestionClick,
    className,
    showClearButton = true,
    autoFocus = false,
}: SearchBarProps) {
    const [value, setValue] = useState(controlledValue || '');
    const [isFocused, setIsFocused] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // AI Search State
    const [aiResult, setAiResult] = useState<{ answer: string; error?: string } | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (controlledValue !== undefined) {
            setValue(controlledValue);
        }
    }, [controlledValue]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (autoFocus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [autoFocus]);

    const performAiSearch = async (query: string) => {
        if (!query || query.length < 3) {
            setAiResult(null);
            return;
        }

        setIsAiLoading(true);
        setAiResult(null); // Clear previous result while loading

        try {
            const result = await searchWithAI(query);
            setAiResult(result);
        } catch (error) {
            console.error(error);
            setAiResult({ answer: '', error: 'Failed to fuzzy search' });
        } finally {
            setIsAiLoading(false);
        }
    };

    const debouncedSearch = useMemo(
        () =>
            debounce((searchValue: any) => {
                onSearch?.(searchValue as string);
                performAiSearch(searchValue as string);
            }, 500),
        [onSearch]
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setValue(newValue);
        onChange?.(newValue);
        debouncedSearch(newValue);
        setShowSuggestions(true); // Always show dropdown when typing if we have AI/local results logic
    };

    const handleClear = () => {
        setValue('');
        onChange?.('');
        onSearch?.('');
        setAiResult(null);
        inputRef.current?.focus();
    };

    const handleSuggestionClick = (suggestion: string) => {
        setValue(suggestion);
        onChange?.(suggestion);
        onSearch?.(suggestion);
        onSuggestionClick?.(suggestion);
        setShowSuggestions(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onSearch?.(value);
            performAiSearch(value); // Ensure AI search runs on Enter too
            setShowSuggestions(false);
        }
        if (e.key === 'Escape') {
            setShowSuggestions(false);
            inputRef.current?.blur();
        }
    };

    const filteredSuggestions = suggestions.filter((s) =>
        s.toLowerCase().includes(value.toLowerCase())
    );

    // Determine if we should show the dropdown
    const shouldShowDropdown = showSuggestions && (filteredSuggestions.length > 0 || isAiLoading || aiResult || value.length > 2);

    return (
        <div ref={containerRef} className={cn('relative', className)}>
            <div
                className={cn(
                    `
          flex items-center gap-3 px-4 py-3
          bg-slate-900/80 backdrop-blur-md
          border rounded-xl
          transition-all duration-300
        `,
                    isFocused
                        ? 'border-[#00fff2] ring-2 ring-[#00fff2]/20 shadow-[0_0_15px_rgba(0,255,242,0.15)]'
                        : 'border-white/10 hover:border-white/20'
                )}
            >
                <Search className={cn("w-5 h-5 transition-colors", isFocused ? "text-[#00fff2]" : "text-white/40")} />
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={handleChange}
                    onFocus={() => {
                        setIsFocused(true);
                        if (value.length > 0) setShowSuggestions(true);
                    }}
                    onBlur={() => setIsFocused(false)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent text-white placeholder-white/40 outline-none font-mono"
                />
                {showClearButton && value && (
                    <button
                        onClick={handleClear}
                        className="p-1 text-white/40 hover:text-[#00fff2] rounded-md hover:bg-white/10 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* AI Components & Suggestions Dropdown */}
            {shouldShowDropdown && (
                <div className="absolute w-full mt-2 py-2 bg-[#0a0e27]/95 backdrop-blur-xl border border-[#00fff2]/30 rounded-xl shadow-[0_0_30px_rgba(0,255,242,0.1)] z-50 max-h-[80vh] overflow-y-auto cyber-scrollbar animate-in fade-in slide-in-from-top-2 duration-200">

                    {/* AI Answer Section */}
                    {(isAiLoading || aiResult) && (
                        <div className="mx-2 mb-2 rounded-lg bg-[#00fff2]/5 border border-[#00fff2]/20 overflow-hidden ai-border-glow">
                            <div className="px-4 py-2 bg-[#00fff2]/10 flex items-center gap-2 border-b border-[#00fff2]/10">
                                <span className="ai-badge-pulse flex items-center justify-center w-6 h-6 rounded-full bg-[#00fff2]/20 text-[#00fff2]">
                                    <Sparkles className="w-3 h-3" />
                                </span>
                                <span className="text-xs font-bold text-[#00fff2] tracking-wider uppercase">AI Assistant</span>
                                {aiResult?.error && <span className="text-xs text-red-400 ml-auto">Error</span>}
                            </div>

                            <div className="p-4">
                                {isAiLoading ? (
                                    <div className="matrix-loader text-xs">
                                        <span>Analyzing...</span>
                                        <span>Decrypting...</span>
                                        <span>Fetching...</span>
                                    </div>
                                ) : convertLinks(aiResult?.answer || '')}
                            </div>

                            {!isAiLoading && aiResult && !aiResult.error && (
                                <div className="px-4 py-2 bg-black/20 flex justify-between items-center text-[10px] text-white/40 border-t border-[#00fff2]/10">
                                    <span className="flex items-center gap-1">
                                        <Terminal className="w-3 h-3" />
                                        Claude 3.5 Sonnet
                                    </span>
                                    {/* Action buttons could go here */}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Traditional Suggestions */}
                    {filteredSuggestions.length > 0 && (
                        <div className="border-t border-white/5 pt-2">
                            <h4 className="px-4 py-1 text-xs text-white/30 uppercase tracking-widest font-mono">Related</h4>
                            {filteredSuggestions.map((suggestion, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="w-full px-4 py-2 text-left text-white/80 hover:bg-[#00fff2]/10 hover:text-[#00fff2] transition-colors result-item-cyber font-mono text-sm"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Empty State / Hints */}
                    {!isAiLoading && !aiResult && filteredSuggestions.length === 0 && (
                        <div className="px-4 py-6 text-center text-white/30">
                            <p className="text-sm">Try asking about cybersecurity courses...</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// Simple helper to render basic markdown-style links if API returns them
function convertLinks(text: string) {
    if (!text) return null;

    // Split by newlines for basic formatting
    return (
        <div className="text-sm text-white/90 leading-relaxed space-y-2 font-light">
            {text.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
            ))}
        </div>
    );
}

