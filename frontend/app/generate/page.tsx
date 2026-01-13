'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuthStore } from '@/lib/store';
import { generateAPI } from '@/lib/api';
import { useSocket } from '@/hooks/useSocket';
import TypingLoader from '@/components/TypingLoader';

type ContentType = 'blog' | 'product' | 'caption';

export default function GeneratePage() {
  const [prompt, setPrompt] = useState('');
  const [contentType, setContentType] = useState<ContentType>('blog');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<'queued' | 'processing' | 'completed' | 'failed' | null>(null);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [polling, setPolling] = useState(false);
  const router = useRouter();
  const { subscribeToContent } = useSocket();

  // Socket.IO subscription for real-time updates
  useEffect(() => {
    if (!jobId) return;

    const unsubscribe = subscribeToContent((data) => {
      if (data.jobId === jobId) {
        setStatus('completed');
        setGeneratedContent(data.content);
        setPolling(false);
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [jobId, subscribeToContent]);

  // Polling fallback (runs alongside Socket.IO)
  useEffect(() => {
    if (jobId && status !== 'completed' && status !== 'failed') {
      const interval = setInterval(async () => {
        try {
          const response = await generateAPI.getStatus(jobId);
          if (response.success) {
            setStatus(response.data.status);
            if (response.data.status === 'completed' && response.data.content) {
              setGeneratedContent(response.data.content);
              setPolling(false);
              clearInterval(interval);
            } else if (response.data.status === 'failed') {
              setPolling(false);
              clearInterval(interval);
            }
          }
        } catch (err) {
          console.error('Error polling status:', err);
        }
      }, 5000); // Poll every 5 seconds

      setPolling(true);

      return () => {
        clearInterval(interval);
        setPolling(false);
      };
    }
  }, [jobId, status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setJobId(null);
    setStatus(null);
    setGeneratedContent(null);

    try {
      const response = await generateAPI.generateContent(prompt, contentType);
      if (response.success) {
        setJobId(response.data.jobId);
        setStatus('queued');
        setPrompt(''); // Clear form
      } else {
        setError(response.error || 'Failed to generate content');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'queued':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ProtectedRoute>
      <div className="bg-gray-50 flex flex-col">
        <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="flex justify-between h-16 items-center">
              <Link href="/dashboard" className="text-xl sm:text-2xl font-bold text-gray-900">
                AI Content Generator
              </Link>
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900 px-2 sm:px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm sm:text-base"
              >
                <span className="hidden sm:inline">Back to Dashboard</span>
                <span className="sm:hidden">Dashboard</span>
              </Link>
            </div>
          </div>
        </nav>

        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-8">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Generate Content</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label htmlFor="contentType" className="block text-sm font-medium text-gray-700 mb-2">
                  Content Type
                </label>
                <select
                  id="contentType"
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value as ContentType)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
                >
                  <option value="blog">Blog Post</option>
                  <option value="product">Product Description</option>
                  <option value="caption">Social Media Caption</option>
                </select>
              </div>

              <div>
                <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                  Prompt
                </label>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  required
                  minLength={5}
                  maxLength={2000}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
                  placeholder="Enter your prompt here... (e.g., 'Write a blog post about artificial intelligence')"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {prompt.length}/2000 characters
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || polling}
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                {loading ? 'Submitting...' : polling ? 'Generating...' : 'Generate Content'}
              </button>
            </form>
          </div>

          {jobId && (
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Generation Status</h2>
                <span
                  className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                    status
                  )}`}
                >
                  {status?.toUpperCase() || 'QUEUED'}
                </span>
              </div>

              <div className="space-y-4">
                {status === 'queued' && (
                  <div className="p-6 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                        <p className="text-sm font-medium text-yellow-900">
                          Job queued successfully
                        </p>
                      </div>
                      <p className="text-sm text-yellow-800">
                        Your content generation job has been queued. It will start processing in approximately 1 minute.
                      </p>
                      {polling && (
                        <div className="pt-2">
                          <TypingLoader className="text-yellow-700" />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {status === 'processing' && (
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <div className="space-y-4">
                      <TypingLoader text="AI is generating your content..." />
                      <div className="mt-4 p-4 bg-white rounded-lg border border-blue-100 shadow-sm">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-700 mb-1">AI is working on your request...</p>
                            <p className="text-xs text-gray-500">This may take a few moments. Please wait.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {status === 'completed' && generatedContent && (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-800 font-semibold mb-2">
                        ✓ Content generated successfully!
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                        {generatedContent.title}
                      </h3>
                      <div className="p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm">
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                          {generatedContent.generatedText}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link
                        href="/dashboard"
                        className="flex-1 text-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                      >
                        View in Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          setJobId(null);
                          setStatus(null);
                          setGeneratedContent(null);
                        }}
                        className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                      >
                        Generate Another
                      </button>
                    </div>
                  </div>
                )}

                {status === 'failed' && (
                  <div className="p-4 bg-red-50 rounded-lg">
                    <p className="text-sm text-red-800">
                      Content generation failed. Please try again.
                    </p>
                    <button
                      onClick={() => {
                        setJobId(null);
                        setStatus(null);
                        setGeneratedContent(null);
                      }}
                      className="mt-3 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm"
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

