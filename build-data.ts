import dotenv from 'dotenv'
import { resolve } from 'node:path'
import { ofetch } from 'ofetch'
import { writeFileSync } from 'node:fs'
import type { IContributionDays, IGithubUserData, IRepository } from './app/types'
import dayjs from 'dayjs'
import { members } from './app/constant/members'

dotenv.config({ path: resolve(process.cwd(), './.env') })

const userInfoQuery = `login # 用户的登录名，即 @xxxx
        name # 用户的别名
        bio # 用户的介绍
        url # 用户的url
        avatarUrl # 公共头像的 URL
        pronouns # 用户的个人资料代词
        followers {
            # 用户的粉丝
            totalCount # 总数
        }
        following {
            # 用户正在关注
            totalCount # 总数
        }`

const repositoryQuery = `# 个人仓库
        repositories(
            first: 30
            ownerAffiliations: OWNER
            isFork: false
            orderBy: { field: STARGAZERS, direction: DESC }
        ) {
            nodes {
                name # 仓库名称
                description # 仓库描述
                nameWithOwner # 仓库归属人
                url # 仓库地址
                stargazerCount # star 数量
                forkCount # fork 数量
                forks {
                    totalCount
                }
                pullRequests {
                    # PR 数量，包含关闭、合并、开放
                    totalCount
                }
                issues {
                    # issues 数量
                    totalCount
                }
                createdAt # 仓库创建时间
                primaryLanguage {
                    # 开发语言
                    name # 语言名称
                    color # 语言的颜色
                }
                licenseInfo {
                    # 许可证
                    spdxId # https://spdx.org/licenses指定的短标识符
                    name # https://spdx.org/licenses指定的许可证全名
                    key # 小写的 xpdxId
                }
                languages(
                    first: 10
                    orderBy: { field: SIZE, direction: DESC }
                ) {
                    edges {
                        size # 使用当前语言编写的字节数
                        node {
                            color # 语言颜色
                            name # 编程语言
                        }
                    }
                    totalCount # 语言总数
                }
            }
            totalCount # 仓库总数
        }`

const organizationQuery = `# 所在组织者数据
        organizations(first: 56) {
            nodes {
                name # 组织名称
                createdAt # 组织创建的时间
                avatarUrl # 组织头像
                description #组织描述
                email # 组织邮箱
                location # 组织公开资料位置
                login #组织的登录名
                url # 组织地址
                websiteUrl # 组织的公开资料 URL
                twitterUsername # 组织公开的 twitter 账户
                repositories {
                    # 组织的仓库总数
                    totalCount
                }
                membersWithRole(first: 5) {
                    # 组织成员
                    nodes {
                        id # 用户所在 Github Id
                        login # 用户的登录名，即 @xxxx
                        name # 用户的别名
                        bio # 用户的介绍
                        avatarUrl # 公共头像的 URL
                        company # 用户所在的公司
                        createdAt # 用户创建 Github 的时间
                        email # 用户的邮箱
                        location # 用户所在城市
                        twitterUsername # 用户的 twitter 账户
                        url # 用户的url
                        websiteUrl # 用户公开的个人网站
                        status {
                            emoji # 用户状态的表情符号
                            message # 用户状态的简单描述
                        }
                    }
                    totalCount # 组织的成员总数
                }
            }

            totalCount # 组织总数
        }`

const pullRequestQuery = `# 提交的 PR 数量
        pullRequests(
            first: 10
            orderBy: { field: CREATED_AT, direction: DESC }
        ) {
            nodes {
                number # PR 编号。
                title # PR 标题
                url # PR 链接
                state # PR 状态 https://docs.github.com/zh/graphql/reference/enums#pullrequeststate
                changedFiles # PR 中修改的文件数
                additions # PR 中新增的内容行数
                deletions # PR 中删除的文件行数
                totalCommentsCount # PR 的总评论数
                createdAt # PR 创建时间
                mergedAt # PR 合并时间
                closedAt # PR 关闭时间
                repository {
                    name # 仓库名称
                    nameWithOwner # 仓库+归属者
                    homepageUrl # 仓库链接
                    description # 仓库描述
                    owner {
                        login
                        avatarUrl
                    }
                    url # 仓库 url
                }
            }
        }`

const year = dayjs().year()
const contributionQuery = `# 贡献数据
contributionsCollection(
            from: "${year}-01-01T00:00:00Z"
            to: "${year}-12-31T23:59:59Z"
        ) {
            contributionCalendar { # 贡献日历
                weeks { # 按照周分组
                    contributionDays {
                        date # 日期
                        contributionCount # 当天贡献总数
                    }
                }
                
                totalContributions # 👈 一行就拿到总数
            }
        }`
const createQuery = (query: string) => `query ($login: String!) {
    user(login: $login) {
        ${query}
    }
}`

const fetchGithubData = async (user: string, query: string) => {
    try {
        const { data } = await ofetch('https://api.github.com/graphql', {
            method: 'post',
            body: JSON.stringify({
                query: `${query}`,
                variables: {
                    login: user,
                },
            }),
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'SixNineNine',
                'Authorization': `Bearer ${process.env.GITHUB_API_TOKEN}`,
            },
            timeout: 10000,
        })

        return data.user
    }
    catch (error) {
        console.error(error)
    }
}

/**
 * 汇总所有仓库的语言用量，并按大小降序返回。
 * @param repos           仓库列表
 */
export const summarizeRepoLanguages = (repos: IRepository[]) => {
    if (!repos)
        return []

    const langMap = new Map<
        string,
        { name: string, color?: string, size: number, repoCount: number }
    >()

    for (const repo of repos) {
        if (!repo.languages?.edges?.length) continue

        // 本仓库中出现过的语言，用来避免同一仓库多次累计 repoCount
        const seenInThisRepo = new Set<string>()

        for (const edge of repo.languages.edges) {
            if (!edge?.node?.name || typeof edge.size !== 'number') continue

            const key = edge.node.name
            const entry = langMap.get(key) ?? {
                name: key,
                color: edge.node.color,
                size: 0,
                repoCount: 0,
            }

            entry.size += edge.size

            if (!seenInThisRepo.has(key)) {
                entry.repoCount += 1
                seenInThisRepo.add(key)
            }

            langMap.set(key, entry)
        }
    }

    const totalSize = [...langMap.values()].reduce((s, l) => s + l.size, 0)

    return [...langMap.values()]
        .sort((a, b) => b.size - a.size)
        .map(l => ({
            ...l,
            progress: ((l.size / totalSize) * 100).toFixed(2),
        }))
}

const buildGithubMemberData = async (user: string) => {
    const [userInfo, repository, organization, pullRequest, contributions] = await Promise.all([
        await fetchGithubData(user, createQuery(userInfoQuery)),
        await fetchGithubData(user, createQuery(repositoryQuery)),
        await fetchGithubData(user, createQuery(organizationQuery)),
        await fetchGithubData(user, createQuery(pullRequestQuery)),
        await fetchGithubData(user, createQuery(contributionQuery)),
    ])

    const data = {
        userInfo: {
            login: userInfo.login,
            name: userInfo.name,
            bio: userInfo.bio,
            url: userInfo.url,
            avatarUrl: userInfo.avatarUrl,
            pronouns: userInfo.pronouns,
            followers: userInfo.followers.totalCount,
            following: userInfo.following.totalCount,
        },
        languages: summarizeRepoLanguages(repository?.repositories?.nodes ?? []),
        ...organization,
        pullRequest: pullRequest.pullRequests?.nodes,
        contributions: {
            total: contributions.contributionsCollection.contributionCalendar?.totalContributions,
            contributions: contributions.contributionsCollection.contributionCalendar?.weeks
                ?.filter((w): w is {
                    contributionDays: IContributionDays[]
                } => !!w.contributionDays)
                .flatMap(w => w.contributionDays)
                .map((i: IContributionDays) => ({
                    date: i.date,
                    count: i.contributionCount,
                })) ?? [],
        },
    } as IGithubUserData

    writeFileSync(resolve(process.cwd(), `./app/data/${user}.json`), JSON.stringify(data, null, 4))
}

(async () => {
    for (const { username } of members) {
        console.log('\n开始获取用户数据...')
        console.log(username)
        await buildGithubMemberData(username)
        await new Promise(resolve => setTimeout(resolve, 2000))
        console.log('数据获取结束')
    }
})()
