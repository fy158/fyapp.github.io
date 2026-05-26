import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'
import { stories, categories, galleryPhotos, initialWishes } from '../src/data/content'

const prisma = new PrismaClient()

// 祝福数据（来自 blessing/page.tsx 中的 initialBlessings）
const blessingsData = [
  {
    id: '1', author: '灵宝', isVIP: true,
    content: '祝你钱包鼓得像刚吹饱的气球，快乐多到手机相册装不下，奶茶永远第二杯半价！',
    date: '2026-05-17',
    avatarColor: 'from-pink-400 to-rose-400',
    replies: [
      { id: 'r1', author: 'Elara', content: '哈哈哈哈同问！我已经把收红包的二维码贴手机壳背面三天了', date: '2026-05-17', to: '灵宝' },
      { id: 'r2', author: '灵宝', content: '要不咱组队去蹲官方？说不定能蹭到几个红包', date: '2026-05-17', to: 'Elara' },
    ],
  },
  {
    id: '2', author: 'fx159357', content: '美美哒，祝福你们永远幸福！', date: '2025-11-25',
    avatarColor: 'from-purple-400 to-pink-400', replies: [],
  },
  {
    id: '3', author: 'labixiaoxin', content: '幸福永远，百年好合！', date: '2025-10-25',
    avatarColor: 'from-blue-400 to-purple-400',
    replies: [{ id: 'r3', author: 'Sara', content: '谢谢祝福！', date: '2025-10-26' }],
  },
  {
    id: '4', author: '竟汐', isVIP: true, content: '竟汐的眼里只有望榆 全世界最好的望榆', date: '2025-10-01',
    avatarColor: 'from-green-400 to-teal-400', replies: [],
  },
  {
    id: '5', author: 'axmaple', content: '₍˄·͈༝·͈˄*₎◞ ̑̑ 太甜了！', date: '2025-09-15',
    avatarColor: 'from-orange-400 to-red-400', replies: [],
  },
  {
    id: '6', author: 'bob1', content: '长长久久，百年好合(๑˃́ꇴ˂̀๑)', date: '2025-08-20',
    avatarColor: 'from-indigo-400 to-blue-400',
    replies: [{ id: 'r4', author: '春风不解风情', content: '祝福你们！', date: '2025-08-21' }],
  },
  {
    id: '7', author: '春风不解风情', content: '愿你们的爱情像春天一样温暖，像夏天一样热烈！', date: '2025-05-09',
    avatarColor: 'from-yellow-400 to-orange-400', replies: [],
  },
  {
    id: '8', author: 'lumenglover', content: '百年好合，早生贵子！', date: '2025-04-22',
    avatarColor: 'from-cyan-400 to-blue-400', replies: [],
  },
  {
    id: '9', author: 'ssh123', content: '666，这波操作太秀了！', date: '2025-03-15',
    avatarColor: 'from-pink-400 to-purple-400', replies: [],
  },
  {
    id: '10', author: 'Sara', content: '写下你的祝福吧~ 期待看到更多美好的祝福！', date: '2025-12-28',
    avatarColor: 'from-rose-400 to-pink-400',
    replies: [{ id: 'r5', author: '小明', content: '来了来了！', date: '2025-12-29' }],
  },
  {
    id: '11', author: '小雨', content: '祝你们甜甜蜜蜜，每天都像在谈恋爱！', date: '2025-11-10',
    avatarColor: 'from-pink-400 to-rose-400', replies: [],
  },
  {
    id: '12', author: '阳光', isVIP: true, content: '看到你们这么幸福，我也相信爱情了！', date: '2025-10-05',
    avatarColor: 'from-purple-400 to-pink-400',
    replies: [{ id: 'r6', author: '星星', content: '是啊是啊！', date: '2025-10-06' }],
  },
  {
    id: '13', author: '月亮', content: '愿你们像月亮和星星一样，永远相伴！', date: '2025-09-20',
    avatarColor: 'from-blue-400 to-purple-400', replies: [],
  },
  {
    id: '14', author: '花花', content: '祝福祝福！要一直幸福下去哦！', date: '2025-08-15',
    avatarColor: 'from-green-400 to-teal-400', replies: [],
  },
  {
    id: '15', author: '小草', content: '愿你们的爱情像小草一样坚韧，生生不息！', date: '2025-07-30',
    avatarColor: 'from-orange-400 to-red-400',
    replies: [{ id: 'r7', author: '大树', content: '说得好！', date: '2025-07-31' }],
  },
]

async function main() {
  console.log('开始播种数据...')

  // 1. 创建管理员用户
  const hashedPassword = await hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@tianxinlianyu.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@tianxinlianyu.com',
      password: hashedPassword,
      role: 'admin',
    },
  })
  console.log(`管理员用户已创建: ${admin.username}`)

  // 2. 创建分类
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        count: cat.count,
      },
    })
  }
  console.log(`已创建 ${categories.length} 个分类`)

  // 3. 导入文章
  for (const story of stories) {
    await prisma.article.upsert({
      where: { id: story.id },
      update: {},
      create: {
        id: story.id,
        title: story.title,
        content: JSON.stringify(story.content || []),
        excerpt: story.excerpt || null,
        categoryName: story.category,
        coverImage: story.image,
        views: story.views,
        authorId: admin.id,
        createdAt: new Date(story.date),
      },
    })
  }
  console.log(`已导入 ${stories.length} 篇文章`)

  // 4. 导入许愿池数据
  for (const wish of initialWishes) {
    await prisma.wish.upsert({
      where: { id: wish.id },
      update: {},
      create: {
        id: wish.id,
        content: wish.content,
        author: wish.author,
        likes: wish.likes,
        createdAt: new Date(wish.date),
      },
    })
  }
  console.log(`已导入 ${initialWishes.length} 条许愿数据`)

  // 5. 导入相册照片
  for (const photo of galleryPhotos) {
    await prisma.photo.upsert({
      where: { id: photo.id },
      update: {},
      create: {
        id: photo.id,
        title: photo.title,
        src: photo.src,
        date: photo.date,
        authorId: admin.id,
      },
    })
  }
  console.log(`已导入 ${galleryPhotos.length} 张相册照片`)

  // 6. 创建站点统计
  await prisma.siteStats.upsert({
    where: { id: 'main' },
    update: {},
    create: {
      id: 'main',
      articles: 534,
      views: 1285678,
      wishes: initialWishes.length,
      blessings: blessingsData.length,
    },
  })
  console.log('站点统计已创建')

  // 7. 导入祝福数据
  for (const blessing of blessingsData) {
    const createdBlessing = await prisma.blessing.upsert({
      where: { id: blessing.id },
      update: {},
      create: {
        id: blessing.id,
        author: blessing.author,
        content: blessing.content,
        avatarColor: blessing.avatarColor,
        isVIP: blessing.isVIP || false,
        createdAt: new Date(blessing.date),
      },
    })

    // 创建祝福回复
    for (const reply of blessing.replies) {
      await prisma.blessingReply.upsert({
        where: { id: reply.id },
        update: {},
        create: {
          id: reply.id,
          author: reply.author,
          content: reply.content,
          toUser: (reply as any).to || null,
          blessingId: createdBlessing.id,
          createdAt: new Date(reply.date),
        },
      })
    }
  }
  console.log(`已导入 ${blessingsData.length} 条祝福数据`)

  console.log('播种完成！')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
