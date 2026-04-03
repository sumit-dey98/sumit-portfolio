// run this script from the root of the project
// bash: node cloudinaryUrlsGenerator.js
// generates the cloudinary urls from local IMAGES_DIR to cloudinary FOLDER and saves the urls to URLS_FILE
// MUST HAVE NODE.JS INSTALLED. also, npm install cloudinary & npm install dotenv
// Script adds new URLs to existing JSON file or creates the json file, if it doesn't exist

import { v2 as cloudinary } from 'cloudinary'
import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'

config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const FOLDER = 'amit-portfolio/screens'
const IMAGES_DIR = './cloudinary/screens'
const URLS_FILE = './public/data/cloudinary-urls.json'

const SUPPORTED = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.svg', '.mp4', '.mov', '.avi', '.webm', '.mkv']
const VIDEO_EXTS = ['.mp4', '.mov', '.avi', '.webm', '.mkv']

const getOptimizedUrl = (url, isVideo) => {
  const params = isVideo ? 'f_auto,q_auto,vc_auto' : 'f_auto,q_auto'
  return url.replace('/upload/', `/upload/${params}/`)
}

// Load existing URLs if file exists
let urls = {}
if (fs.existsSync(URLS_FILE)) {
  urls = JSON.parse(fs.readFileSync(URLS_FILE, 'utf-8'))
  console.log(`Loaded ${Object.keys(urls).length} existing URLs from ${URLS_FILE}`)
}

let uploaded = 0
let skipped = 0

const files = fs.readdirSync(IMAGES_DIR).filter(f => {
  const ext = path.extname(f).toLowerCase()
  return SUPPORTED.includes(ext)
})

for (const filename of files) {
  const name = path.parse(filename).name
  const ext = path.extname(filename).toLowerCase()
  const isVideo = VIDEO_EXTS.includes(ext)

  if (urls[name]) {
    console.log(`  — skipping ${filename} (already uploaded)`)
    skipped++
    continue
  }

  const filepath = path.join(IMAGES_DIR, filename)
  console.log(`Uploading ${filename}...`)

  try {
    const result = await cloudinary.uploader.upload(filepath, {
      folder: FOLDER,
      public_id: name,
      overwrite: false,
      resource_type: isVideo ? 'video' : 'image',
    })

    urls[name] = getOptimizedUrl(result.secure_url, isVideo)
    console.log(`  ✓ ${urls[name]}`)
    uploaded++
  } catch (e) {
    console.log(`  ✗ ${filename} — ${e.message}`)
  }
}

fs.writeFileSync(URLS_FILE, JSON.stringify(urls, null, 4))

console.log(`\nDone! ${uploaded} uploaded, ${skipped} skipped.`)
console.log(`URLs saved to ${URLS_FILE}`)