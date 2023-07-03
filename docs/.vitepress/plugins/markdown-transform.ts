import fs from 'fs'
import path from 'path'
import glob from 'fast-glob'
import { docRoot, docsDirName, projRoot } from '@element-plus/build-utils'
import { REPO_BRANCH, REPO_URL } from '@element-plus/build-constants'
import { getLang, languages } from '../utils/lang'
import footerLocale from '../i18n/component/footer.json'

import type { Plugin } from 'vite'

type Append = Record<'headers' | 'footers' | 'scriptSetups', string[]>

let compPaths: string[]

export function MarkdownTransform(): Plugin {
  return {
    name: 'element-plus-md-transform',

    enforce: 'pre',

    async buildStart() {
      const pattern = `{${[...languages, languages[0]].join(',')}}/component`

      compPaths = await glob(pattern, {
        cwd: docRoot,
        absolute: true,
        onlyDirectories: true,
      })
    },

    async transform(code, id) {
      if (!id.endsWith('.md')) return

      const componentId = path.basename(id, '.md')
      const append: Append = {
        headers: [],
        footers: [],
        scriptSetups: [
          `const demos = import.meta.globEager('../../examples/${componentId}/*.vue')`,
        ],
      }

      code = transformVpScriptSetup(code, append)

      if (compPaths.some((compPath) => id.startsWith(compPath))) {
        code = transformComponentMarkdown(id, componentId, code, append)
      }

      return combineMarkdown(
        code,
        [combineScriptSetup(append.scriptSetups), ...append.headers],
        append.footers
      )
    },
  }
}

const combineScriptSetup = (codes: string[]) =>
  `\n<script setup>
${codes.join('\n')}
</script>
`

const combineMarkdown = (
  code: string,
  headers: string[],
  footers: string[]
) => {
  const frontmatterEnds = code.indexOf('---\n\n')
  const firstHeader = code.search(/\n#{1,6}\s.+/)
  const sliceIndex =
    firstHeader < 0
      ? frontmatterEnds < 0
        ? 0
        : frontmatterEnds + 4
      : firstHeader

  if (headers.length > 0)
    code =
      code.slice(0, sliceIndex) + headers.join('\n') + code.slice(sliceIndex)
  code += footers.join('\n')

  return `${code}\n`
}

const vpScriptSetupRE = /<vp-script\s(.*\s)?setup(\s.*)?>([\s\S]*)<\/vp-script>/

const transformVpScriptSetup = (code: string, append: Append) => {
  const matches = code.match(vpScriptSetupRE)
  if (matches) code = code.replace(matches[0], '')
  const scriptSetup = matches?.[3] ?? ''
  if (scriptSetup) append.scriptSetups.push(scriptSetup)
  return code
}

const _REPO_URL = REPO_URL.replace(/\/$/, '')
const GITHUB_BLOB_URL = `${_REPO_URL}/-/blob/${REPO_BRANCH}`
const GITHUB_TREE_URL = `${_REPO_URL}/-/tree/${REPO_BRANCH}`
const transformComponentMarkdown = (
  id: string, // 文件名
  componentId: string,
  code: string,
  append: Append
) => {
  const lang = getLang(id) // en-US | zh-CN
  const docUrl = `${GITHUB_BLOB_URL}/${docsDirName}/${lang}/component/${componentId}.md`
  const componentUrl = `${GITHUB_TREE_URL}/packages/components/${componentId}`
  const componentPath = path.resolve(
    projRoot,
    `packages/components/${componentId}`
  )
  const isComponent = fs.existsSync(componentPath)

  const links = [[footerLocale[lang].docs, docUrl]]
  if (isComponent) links.unshift([footerLocale[lang].component, componentUrl])
  const linksText = links
    .filter((i) => i)
    .map(([text, link]) => `[${text}](${link})`)
    .join(' • ')

  const sourceSection = `
## ${footerLocale[lang].source}

${linksText}`

  append.footers.push(sourceSection)

  return code
}
