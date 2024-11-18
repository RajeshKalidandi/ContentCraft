import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Copy, Check, Settings, Type, Sparkles } from 'lucide-react';
import { generateContent, ChatMessage } from '../services/mistral';
import { Helmet } from 'react-helmet-async';

const contentTypes = [
  { id: 'blog', name: 'Blog Post', icon: Type },
  { id: 'social', name: 'Social Media', icon: Sparkles },
];

export default function ContentEditor() {
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [streamedContent, setStreamedContent] = useState('');
  const [selectedType, setSelectedType] = useState(contentTypes[0].id);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content || streamedContent);
      setCopied(true);
    } catch (err) {
      console.error('Failed to copy content:', err);
    }
  };

  const handleStream = async (messages: ChatMessage[]) => {
    try {
      const stream = await generateContent(messages, true);
      let accumulated = '';
      
      if (stream) {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || '';
          accumulated += content;
          setStreamedContent(accumulated);
        }
      }
    } catch (err) {
      console.error('Streaming error:', err);
      throw err;
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setContent('');
    setStreamedContent('');
    setGenerating(true);
    setError('');

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `You are a professional content writer helping to create engaging and SEO-optimized ${
          selectedType === 'blog' ? 'blog posts' : 'social media posts'
        }.`
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    try {
      await handleStream(messages);
    } catch (error) {
      setError('Failed to generate content. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Content Editor - ContentCraft.ai</title>
        <meta name="description" content="Create AI-powered content with ContentCraft.ai" />
      </Helmet>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Content Editor</h1>
            <div className="flex items-center space-x-2">
              {contentTypes.map(({ id, name, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setSelectedType(id)}
                  className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                    selectedType === id
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
                What would you like to write about?
              </label>
              <div className="mt-1">
                <textarea
                  id="prompt"
                  rows={3}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder={`Enter your ${selectedType === 'blog' ? 'blog post' : 'social media post'} brief...`}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleGenerate}
                disabled={generating || !prompt.trim()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {generating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Generate
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {(content || streamedContent) && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Generated Content</h2>
              <button
                onClick={handleCopy}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                {copied ? (
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 mr-2" />
                )}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div 
              ref={contentRef}
              className="prose max-w-none mt-4 whitespace-pre-wrap"
            >
              {streamedContent || content}
            </div>
          </div>
        )}
      </div>
    </>
  );
}