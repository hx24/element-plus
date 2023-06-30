import fs from 'fs'
import path from 'path'
import { docRoot } from '@element-plus/build-utils'
import route from '../config/route'

export const languages = fs.readdirSync(path.resolve(__dirname, '../crowdin'))

// export const ensureLang = (lang: string) => `/${lang}`
export const ensureLang = (lang: string) => route.base + lang

export const getLang = (id: string) =>
  path.relative(docRoot, id).split(path.sep)[0]
