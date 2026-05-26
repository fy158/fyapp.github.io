// API 基础配置
// 线上环境使用 Railway 后端，本地开发使用相对路径

const isProduction = process.env.NODE_ENV === 'production';

// Railway 后端地址
export const API_BASE_URL = isProduction 
  ? 'https://fylove-loggithubio-production.up.railway.app/api'
  : '/api';

// 封装 fetch，自动添加基础 URL
export async function apiFetch(url: string, options?: RequestInit) {
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  return fetch(fullUrl, options);
}
