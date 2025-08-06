import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import { SITE_URL } from '@/config/site'
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
   
  const baseUrl = SITE_URL

  const staticPaths: { path: string; priority: number; changefreq: string }[] = [
    { path: '', priority: 1.0, changefreq: 'weekly' },
    { path: 'cena', priority: 0.8, changefreq: 'monthly' },
    { path: 'kontakt', priority: 0.6, changefreq: 'monthly' },
    { path: 'motivacni-dopis', priority: 0.7, changefreq: 'monthly' },
    { path: 'blog', priority: 0.7, changefreq: 'weekly' },
    { path: 'preview', priority: 0.5, changefreq: 'never' },
    { path: 'navod', priority: 0.6, changefreq: 'monthly' },
  ]

  const blogDir = path.join(process.cwd(), 'src', 'content', 'blog')
  let blogEntries: { slug: string; lastmod: string }[] = []

  if (fs.existsSync(blogDir)) {
    const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'))
    blogEntries = files.map((file) => {
      const filePath = path.join(blogDir, file)
      const stats = fs.statSync(filePath)
      const lastmod = stats.mtime.toISOString().split('T')[0]
      const slug = file.replace(/\.mdx?$/, '').replace(/\.md$/, '')
      return { slug, lastmod }
    })
  }

  const urls: string[] = []

  staticPaths.forEach(({ path, changefreq, priority }) => {
    urls.push(
      `<url><loc>${baseUrl}/${path}</loc><changefreq>${changefreq}</changefreq><priority>${priority.toFixed(1)}</priority></url>`
    )
  })

  blogEntries.forEach(({ slug, lastmod }) => {
  urls.push(
    `<url><loc>${baseUrl}/blog/${slug}</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`
  )
})

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    urls.join('') +
    `</urlset>`

  res.setHeader('Content-Type', 'application/xml')
  res.status(200).end(sitemap)
}
