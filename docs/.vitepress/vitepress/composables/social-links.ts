import { useData } from 'vitepress'
import GitLabIcon from '~icons/ri/gitlab-fill'

export const useSocialLinks = () => {
  const { theme } = useData()
  const { repo } = theme.value
  return [
    {
      link: repo,
      icon: GitLabIcon,
      text: 'GitLab',
    },
  ]
}
