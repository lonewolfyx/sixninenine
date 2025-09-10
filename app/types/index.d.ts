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
        repositories: {
            nodes: IRepository[] | null
            totalCount: number
        }
        organizations: {
            nodes: IOrganization[] | null
            totalCount: number
        }
        pullRequests: {
            nodes: IPullRequest[] | null
        }
    }
}

export interface IRepository {
    name: string
    description: string
    nameWithOwner: string
    url: string
    stargazerCount?: number
    forkCount?: number
    forks?: {
        totalCount?: number
    }
    pullRequests?: {
        totalCount?: number
    }
    issues?: {
        totalCount?: number
    }
    createdAt: string
    primaryLanguage: IPrimaryLanguage
    licenseInfo: ILicenseInfo
    languages: ILanguages
}

export interface IPrimaryLanguage {
    name?: string
    color?: string
}

export interface ILicenseInfo {
    spdxId: string
    name: string
    key: string
}

export interface ILanguageEdge {
    size?: number
    node?: {
        color?: string
        name?: string
    }
}

export interface ILanguages {
    edges?: ILanguageEdge[]
    totalCount?: number
}

export interface IOrganization {
    name: string
    createdAt: string
    avatarUrl: string
    description: string | null
    email: string | null
    location: string | null
    login: string
    url: string
    websiteUrl: string | null
    twitterUsername: string | null
    repositories: {
        totalCount: number
    }
    membersWithRole: {
        nodes: IOrganizationMember[] | null
        totalCount: number
    }
}

export interface IOrganizationMember {
    id: string
    login: string
    name: string
    bio: string | null
    avatarUrl: string
    company: string | null
    createdAt: string
    email: string | null
    location: string | null
    twitterUsername: string | null
    url: string | null
    websiteUrl: string | null
    status: {
        emoji: string
        message: string
    } | null
}

export interface IGithubData {
    data: IGithubUser
}

export interface IGithubUserData {
    userInfo: IGithubUserInfo
    languages: IUserLanguages[] | null
    organizations: {
        nodes: IOrganization[] | null
        totalCount: number
    }
    pullRequest: IPullRequest[]
    contributions: {
        total: number
        contributions: ITransformedContributionData[]
    }
}

export interface IGithubUserInfo {
    login: string
    name: string
    bio: string | null
    url: string
    avatarUrl: string
    pronouns: string
    followers: number
    following: number
}

export interface IUserLanguages {
    name: string
    color: string
    size: number
    repoCount: number
    progress: string
}

export interface IContributionDays {
    date?: string
    contributionCount?: number
}

export interface ITransformedContributionData {
    date?: string | Date
    count?: number
}
