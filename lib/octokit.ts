import { Octokit } from '@octokit/rest'

export default new Octokit({ auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN })
