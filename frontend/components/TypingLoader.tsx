'use client';

interface TypingLoaderProps {
  className?: string;
  text?: string;
}

export default function TypingLoader({ className = '', text = 'Generating content...' }: TypingLoaderProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex gap-1.5">
        <span 
          className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" 
          style={{ animationDelay: '0ms', animationDuration: '1.4s' }}
        ></span>
        <span 
          className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" 
          style={{ animationDelay: '200ms', animationDuration: '1.4s' }}
        ></span>
        <span 
          className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" 
          style={{ animationDelay: '400ms', animationDuration: '1.4s' }}
        ></span>
      </div>
      <span className="text-sm font-medium text-gray-700 animate-pulse">{text}</span>
    </div>
  );
}
