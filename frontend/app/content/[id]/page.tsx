'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import { contentAPI } from '@/lib/api';

export default function ContentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchContent(params.id as string);
    }
  }, [params.id]);

  const fetchContent = async (id: string) => {
    try {
      setLoading(true);
      const response = await contentAPI.getById(id);
      if (response.success) {
        // Handle both response formats
        const contentData = response.data?.content || response.data;
        setContent(contentData);
      } else {
        setError(response.error || 'Content not found');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
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

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !content) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || 'Content not found'}</p>
            <Link
              href="/dashboard"
              className="text-primary-600 hover:text-primary-700"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

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
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">{content.title}</h1>
              <span
                className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                  content.status
                )}`}
              >
                {content.status.toUpperCase()}
              </span>
            </div>

            <div className="space-y-6">
              {content.sentiment && (
                <div>
                  <h2 className="text-sm font-medium text-gray-500 mb-1">Sentiment</h2>
                  <span
                    className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                      content.sentiment.label === 'positive'
                        ? 'bg-green-100 text-green-800'
                        : content.sentiment.label === 'negative'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {content.sentiment.label} ({content.sentiment.score > 0 ? '+' : ''}{content.sentiment.score.toFixed(2)})
                  </span>
                </div>
              )}

              <div>
                <h2 className="text-sm font-medium text-gray-500 mb-1">Content Type</h2>
                <p className="text-gray-900 capitalize">{content.contentType}</p>
              </div>

              <div>
                <h2 className="text-sm font-medium text-gray-500 mb-1">Prompt</h2>
                <p className="text-gray-900">{content.prompt}</p>
              </div>

              {content.status === 'completed' && content.generatedText && (
                <div>
                  <h2 className="text-sm font-medium text-gray-500 mb-2">Generated Content</h2>
                  <div className="p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                      {content.generatedText}
                    </p>
                  </div>
                </div>
              )}

              {content.status === 'queued' && (
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    This content is queued for generation. It will be processed shortly.
                  </p>
                </div>
              )}

              {content.status === 'processing' && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <p className="text-sm text-blue-800">
                      This content is currently being generated.
                    </p>
                  </div>
                </div>
              )}

              {content.status === 'failed' && (
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-800">
                    Content generation failed. Please try generating again.
                  </p>
                </div>
              )}

              <div>
                <h2 className="text-sm font-medium text-gray-500 mb-1">Created At</h2>
                <p className="text-gray-900">
                  {new Date(content.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

