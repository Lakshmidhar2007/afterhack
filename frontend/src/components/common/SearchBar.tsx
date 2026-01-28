'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { cn, debounce } from '@/lib/utils/helpers';

interface SearchBarProps {
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    onSearch?: (value: string) => void;
    suggestions?: string[];
    onSuggestionClick?: (suggestion: string) => void;
    className?: string;
    showClearButton?: boolean;
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
}: SearchBarProps) {
    const [value, setValue] = useState(controlledValue || '');
    const [isFocused, setIsFocused] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
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

    const debouncedSearch = debounce((searchValue: string) => {
        onSearch?.(searchValue);
    }, 300);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setValue(newValue);
        onChange?.(newValue);
        debouncedSearch(newValue);
        setShowSuggestions(newValue.length > 0 && suggestions.length > 0);
    };

    const handleClear = () => {
        setValue('');
        onChange?.('');
        onSearch?.('');
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

    return (
        <div ref={containerRef} className={cn('relative', className)}>
            <div
                className={cn(
                    `
          flex items-center gap-3 px-4 py-3
          bg-white/5 backdrop-blur-sm
          border rounded-xl
          transition-all duration-200
        `,
                    isFocused
                        ? 'border-indigo-500 ring-2 ring-indigo-500/20'
                        : 'border-white/10 hover:border-white/20'
                )}
            >
                <Search className="w-5 h-5 text-white/40" />
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={handleChange}
                    onFocus={() => {
                        setIsFocused(true);
                        if (value.length > 0 && filteredSuggestions.length > 0) {
                            setShowSuggestions(true);
                        }
                    }}
                    onBlur={() => setIsFocused(false)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent text-white placeholder-white/40 outline-none"
                />
                {showClearButton && value && (
                    <button
                        onClick={handleClear}
                        className="p-1 text-white/40 hover:text-white rounded-md hover:bg-white/10 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Suggestions dropdown */}
            {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute w-full mt-2 py-2 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto">
                    {filteredSuggestions.map((suggestion, index) => (
                        <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="w-full px-4 py-2 text-left text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
