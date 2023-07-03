import { computed } from 'vue'
import { useData } from 'vitepress'
import { useLocale } from '../composables/locale'
import { createGitHubUrl } from '../utils'
import editLinkLocale from '../../i18n/component/edit-link.json'

export function useEditLink() {
  const { page, theme, frontmatter } = useData()
  const editLink = useLocale(editLinkLocale)

  const url = computed(() => {
    const {
      repo,
      docsDir = '',
      docsBranch = 'dev',
      docsRepo = repo,
      editLinks,
    } = theme.value
    const showEditLink =
      frontmatter.value.editLink != null
        ? frontmatter.value.editLink
        : editLinks
    const { relativePath } = page.value
    if (!showEditLink || !relativePath || !repo) {
      return null
    }
    return createGitHubUrl(docsRepo, docsDir, docsBranch, relativePath, '', '')
  })
  const text = computed(() => {
    return editLink.value['edit-on-github']
  })

  return {
    url,
    text,
  }
}
