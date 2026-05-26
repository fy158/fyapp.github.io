/**
 * 文章详情页 - 服务端包装器
 * 支持从 API 获取动态文章数据
 */

import { stories } from '@/data/content';
import StoryDetailClient from './StoryDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

// 从 API 获取文章详情
async function getArticleFromAPI(id: string) {
  try {
    const res = await fetch(`http://localhost:3000/api/articles/${id}`, {
      cache: 'no-store',
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.error('获取文章详情失败:', error);
  }
  return null;
}

export default async function StoryPage({ params }: PageProps) {
  const { id } = await params;
  
  // 优先从 API 获取文章
  const apiArticle = await getArticleFromAPI(id);
  
  return <StoryDetailClient article={apiArticle} />;
}
