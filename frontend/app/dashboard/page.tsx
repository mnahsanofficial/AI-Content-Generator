'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuthStore } from '@/lib/store';
import { contentAPI } from '@/lib/api';
import ConfirmModal from '@/components/ConfirmModal';

interface Content {
  _id: string;
  title: string;
  prompt: string;
  contentType: string;
  generatedText: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  sentiment?: {
    score: number;
    label: 'positive' | 'negative' | 'neutral';
  };
  jobId?: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; contentId: string | null; contentTitle: string }>({
    isOpen: false,
    contentId: null,
    contentTitle: '',
  });
  const { user, logout } = useAuthStore();
  const router = useRouter();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchContent();
  }, []);

  useEffect(() => {
    fetchContent();
  }, [debouncedSearch]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await contentAPI.getAll(debouncedSearch);
      if (response.success) {
        // Handle both array response and object with content property
        const contentArray = Array.isArray(response.data) 
          ? response.data 
          : (response.data?.content || []);
        setContent(contentArray);
      } else {
        setError(response.error || 'Failed to fetch content');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: string, title: string) => {
    setDeleteModal({
      isOpen: true,
      contentId: id,
      contentTitle: title,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.contentId) return;

    try {
      const response = await contentAPI.delete(deleteModal.contentId);
      if (response.success) {
        fetchContent();
      } else {
        setError(response.error || 'Failed to delete content');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred');
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

  return (
    <ProtectedRoute>
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, contentId: null, contentTitle: '' })}
        onConfirm={handleDeleteConfirm}
        title="Delete Content"
        message={`Are you sure you want to delete "${deleteModal.contentTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
      <div className="bg-gray-50 flex flex-col">
        <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="flex justify-between h-16 items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">AI Content Generator</h1>
              <div className="flex items-center gap-2 sm:gap-4">
                <span className="hidden sm:inline text-sm text-gray-600">Welcome, {user?.name}</span>
                <Link
                  href="/generate"
                  className="bg-primary-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm sm:text-base"
                >
                  <span className="hidden sm:inline">Generate Content</span>
                  <span className="sm:hidden">Generate</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    router.push('/login');
                  }}
                  className="text-gray-600 hover:text-gray-900 px-2 sm:px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm sm:text-base"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Your Content</h2>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, prompt, or content..."
                className="block w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center hover:bg-gray-100 rounded-r-lg transition-colors"
                >
                  <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            {debouncedSearch && (
              <p className="mt-2 text-sm text-gray-600">
                Showing results for "<span className="font-medium">{debouncedSearch}</span>"
              </p>
            )}
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading content...</p>
            </div>
          ) : content.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-600 mb-4">
                {debouncedSearch ? `No content found matching "${debouncedSearch}"` : 'No content yet. Start generating!'}
              </p>
              {!debouncedSearch && (
                <Link
                  href="/generate"
                  className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Generate Your First Content
                </Link>
              )}
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {content.map((item) => (
                <div key={item._id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 sm:p-6 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4 gap-2">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
                      {item.title}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Type:</span> {item.contentType}
                    </p>
                    {item.sentiment && (
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          item.sentiment.label === 'positive'
                            ? 'bg-green-100 text-green-800'
                            : item.sentiment.label === 'negative'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {item.sentiment.label}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-700 mb-4 line-clamp-2 flex-shrink-0">
                    <span className="font-medium">Prompt:</span> {item.prompt}
                  </p>

                  <div className="flex-1 mb-4 min-h-[80px]">
                    {item.status === 'completed' && item.generatedText ? (
                      <div className="p-3 bg-gray-50 rounded text-sm text-gray-700 line-clamp-4 h-full">
                        {item.generatedText}
                      </div>
                    ) : (
                      <div className="p-3 bg-gray-50 rounded text-sm text-gray-500 italic h-full flex items-center">
                        {item.status === 'queued' && 'Content generation queued...'}
                        {item.status === 'processing' && 'Generating content...'}
                        {item.status === 'failed' && 'Content generation failed'}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-auto">
                    <Link
                      href={`/content/${item._id}`}
                      className="flex-1 text-center bg-primary-100 text-primary-700 px-3 py-2 rounded-lg hover:bg-primary-200 transition-all text-sm font-medium"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(item._id, item.title)}
                      className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 transition-all text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 mt-3">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}

