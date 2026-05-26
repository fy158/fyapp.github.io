import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { imageData, fileName } = await request.json();
    const uniqueFileName = `${Date.now()}-${fileName}`;

    const blob = await put(
      `ai-generated/images/${uniqueFileName}`,
      imageData,
      { access: 'public' }
    );

    return NextResponse.json({ success: true, imageUrl: blob.url });
  } catch (error) {
    console.error('上传失败:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}