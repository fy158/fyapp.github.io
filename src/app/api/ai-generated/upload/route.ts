import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

// POST - 上传文件（HTML或图片）
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string

    if (!file) {
      return NextResponse.json(
        { error: '没有上传文件' },
        { status: 400 }
      )
    }

    // 验证文件类型
    if (type === 'html') {
      if (!file.name.endsWith('.html') && !file.name.endsWith('.htm')) {
        return NextResponse.json(
          { error: '只支持 HTML 文件' },
          { status: 400 }
        )
      }
    } else if (type === 'image') {
      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { error: '只支持图片文件' },
          { status: 400 }
        )
      }
    }

    // 生成唯一文件名
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const ext = path.extname(file.name) || (type === 'html' ? '.html' : '.webp')
    const filename = `${timestamp}-${randomStr}${ext}`

    // 确定上传目录
    const uploadDir = type === 'html' 
      ? path.join(process.cwd(), 'public', 'ai-generated', 'html')
      : path.join(process.cwd(), 'public', 'ai-generated', 'images')

    // 确保目录存在
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // 读取文件内容
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // 保存文件
    const filePath = path.join(uploadDir, filename)
    await writeFile(filePath, buffer)

    // 返回文件URL
    const url = type === 'html'
      ? `/ai-generated/html/${filename}`
      : `/ai-generated/images/${filename}`

    return NextResponse.json({ 
      success: true,
      url,
      filename
    })

  } catch (error) {
    console.error('文件上传失败:', error)
    return NextResponse.json(
      { error: '文件上传失败' },
      { status: 500 }
    )
  }
}
