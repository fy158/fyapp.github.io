import { NextRequest, NextResponse } from 'next/server'
import { getStore } from '@netlify/blobs'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'

// 检测是否在 Netlify 环境
const isNetlify = () => {
  return process.env.NETLIFY === 'true' || process.env.DEPLOY_URL?.includes('netlify')
}

// POST /api/upload - 上传图片（支持本地文件系统和 Netlify Blobs）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { image, filename } = body

    if (!image || typeof image !== 'string') {
      return NextResponse.json({ error: '缺少图片数据' }, { status: 400 })
    }

    // 解析 base64 图片
    const matches = image.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/)
    if (!matches) {
      return NextResponse.json({ error: '无效的图片格式' }, { status: 400 })
    }

    const ext = matches[1]
    const base64Data = matches[2]
    const buffer = Buffer.from(base64Data, 'base64')

    // 生成文件名
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    const finalFilename = filename || `upload-${timestamp}-${random}.${ext}`

    if (isNetlify()) {
      // Netlify 环境：使用 Blobs 存储
      const store = getStore('uploads')
      await store.set(finalFilename, buffer.buffer as ArrayBuffer, {
        metadata: {
          contentType: `image/${ext}`,
          uploadedAt: new Date().toISOString(),
        },
      })
      const imageUrl = `/api/blob/uploads/${finalFilename}`
      return NextResponse.json({ url: imageUrl }, { status: 201 })
    } else {
      // 本地开发：使用文件系统存储
      const uploadDir = join(process.cwd(), 'public', 'uploads')
      
      // 确保目录存在
      if (!existsSync(uploadDir)) {
        mkdirSync(uploadDir, { recursive: true })
      }

      const filePath = join(uploadDir, finalFilename)
      await writeFile(filePath, buffer)

      // 返回相对路径
      const imageUrl = `/uploads/${finalFilename}`
      return NextResponse.json({ url: imageUrl }, { status: 201 })
    }
  } catch (error) {
    console.error('上传图片失败:', error)
    return NextResponse.json({ error: '上传图片失败' }, { status: 500 })
  }
}
