/**
 * AI 地图助手页面
 * 嵌入 AI 地图助手应用
 * 使用 Next.js API 路由作为后端
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import MusicPlayer from '@/components/MusicPlayer';
import MouseFollower from '@/components/MouseFollower';

export default function AIMapPage() {
  const [isDark, setIsDark] = useState(false);
  const [apiStatus, setApiStatus] = useState<'loading' | 'ok' | 'error'>('loading');

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    setIsDark(document.documentElement.classList.contains('dark'));
    return () => observer.disconnect();
  }, []);

  // 检查 API 状态
  useEffect(() => {
    fetch('/api/ai-map/health')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'ok') {
          setApiStatus('ok');
        } else {
          setApiStatus('error');
        }
      })
      .catch(() => setApiStatus('error'));
  }, []);

  return (
    <main className={`min-h-screen ${isDark ? 'bg-[#0a0e27]' : 'bg-gray-50'}`}>
      <MouseFollower />
      <ThemeToggle />
      <MusicPlayer />

      {/* 顶部导航 */}
      <header className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-500 ${
        isDark ? 'bg-[#0a0e27]/80 border-white/10' : 'bg-white/80 border-purple-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/ai-generated" className={`flex items-center gap-2 transition-colors ${
            isDark ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-500'
          }`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>返回 AI 创意工坊</span>
          </Link>
          <h1 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            🤖 AI 地图助手
          </h1>
          <div className="w-24" />
        </div>
      </header>

      {apiStatus === 'loading' ? (
        /* 加载中 */
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className={`text-center ${isDark ? 'text-white' : 'text-gray-800'}`}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p>正在检查服务状态...</p>
          </div>
        </div>
      ) : apiStatus === 'error' ? (
        /* API 未配置 */
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className={`text-center max-w-md mx-auto p-8 rounded-3xl ${
            isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-100 shadow-lg'
          }`}>
            <div className="text-6xl mb-6">⚙️</div>
            <h2 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              AI 地图助手
            </h2>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-4 ${
              isDark ? 'bg-yellow-500/10 text-yellow-400' : 'bg-yellow-50 text-yellow-600'
            }`}>
              <span>需要配置 API Key</span>
            </div>
            <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              请在 Vercel 环境变量中添加：<br/>
              <code className={`px-2 py-1 rounded text-sm ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}>DEEPSEEK_API_KEY</code><br/>
              <code className={`px-2 py-1 rounded text-sm ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}>BAIDU_MAP_AK</code>
            </p>
            <Link
              href="/ai-generated"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:scale-105 transition-transform"
            >
              <span>返回 AI 创意工坊</span>
            </Link>
          </div>
        </div>
      ) : (
        /* 正常显示 iframe */
        <div className="h-[calc(100vh-64px)]">
          <iframe
            src="/ai-map/index.html"
            className="w-full h-full border-0"
            title="AI 地图助手"
            allow="geolocation"
          />
        </div>
      )}
    </main>
  );
}
