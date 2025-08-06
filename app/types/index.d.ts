export interface IPullRequest {
    number: number
    title: string
    url: string
    state: string
    changedFiles: number
    additions: number
    deletions: number
    totalCommentsCount: number
    createdAt: string
    mergedAt: string | null
    closedAt: string | null
    repository: {
        name: string
        nameWithOwner: string
        homepageUrl: string
        description: string
        owner: {
            login: string
            avatarUrl: string
        }
        url: string
    }
}

export interface IGithubUser {
    user: {
        login: string
        name: string
        bio: string | null
        url: string
        avatarUrl: string
        pronouns: string | null
        followers: {
            totalCount: number
        }
        following: {
            totalCount: number
        }
        pullRequests: {
            nodes: IPullRequest[]
        }
    }
}

export interface IGithubData {
    data: IGithubUser
}
