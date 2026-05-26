import { NextRequest, NextResponse } from 'next/server'
import { getStore } from '@netlify/blobs'

// GET /api/blob/{store}/{path} - 从 Netlify Blobs 读取文件
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ store: string; path: string[] }> }
) {
  try {
    const { store: storeName, path } = await params
    const key = path.join('/')

    const store = getStore(storeName)
    const blob = await store.get(key, { type: 'blob' })

    if (!blob) {
      return NextResponse.json({ error: '文件不存在' }, { status: 404 })
    }

    // 获取元数据
    const metadata = await store.getMetadata(key)
    const contentType = (metadata?.metadata?.contentType as string) || 'application/octet-stream'

    // 返回文件内容
    return new NextResponse(blob, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch (error) {
    console.error('读取 blob 失败:', error)
    return NextResponse.json({ error: '读取文件失败' }, { status: 500 })
  }
}
