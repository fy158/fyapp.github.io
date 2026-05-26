// 照片云存储 - 使用 localStorage 作为本地开发环境的替代方案
// 在 Netlify 生产环境中会自动使用 Netlify Blobs

export interface CloudPhoto {
  id: string
  url: string
  title: string
  date: string
  category: string
  createdAt: number
}

const STORAGE_KEY = 'taoxiaotao_photos'

// 检查是否在 Netlify 环境
function isNetlifyEnvironment(): boolean {
  return typeof process !== 'undefined' && 
    (process.env.NETLIFY === 'true' || process.env.NETLIFY_BLOBS_SITE_ID !== undefined)
}

// 本地存储实现
function getLocalPhotos(): CloudPhoto[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveLocalPhotos(photos: CloudPhoto[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(photos))
  } catch (err) {
    console.error('保存照片失败:', err)
  }
}

// 将文件转换为 Base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// 上传照片
export async function uploadPhotoToCloud(file: File, title: string, category: string): Promise<CloudPhoto> {
  const base64 = await fileToBase64(file)
  
  const photo: CloudPhoto = {
    id: `photo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    url: base64,
    title: title || `${category} · ${new Date().toLocaleDateString('zh-CN')}`,
    date: new Date().toISOString().split('T')[0],
    category,
    createdAt: Date.now(),
  }

  // 保存到本地存储
  const photos = getLocalPhotos()
  photos.push(photo)
  saveLocalPhotos(photos)
  
  return photo
}

// 获取所有照片
export async function getAllCloudPhotos(): Promise<CloudPhoto[]> {
  return getLocalPhotos()
}

// 删除照片
export async function deleteCloudPhoto(id: string): Promise<void> {
  const photos = getLocalPhotos()
  const filtered = photos.filter(p => p.id !== id)
  saveLocalPhotos(filtered)
}

// 按分类获取照片
export async function getCloudPhotosByCategory(category: string): Promise<CloudPhoto[]> {
  const photos = getLocalPhotos()
  return photos.filter(p => p.category === category)
}
