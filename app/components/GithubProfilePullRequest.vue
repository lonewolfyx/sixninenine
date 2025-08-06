<template>
    <div class="block flex-shrink-0 px-4 self-start h-full">
        <div class="basis-lg w-lg flex flex-col h-full">
            <template v-if="loading">
                <ProfileSkeletonLoading />
            </template>
            <template v-else>
                <div class="bg-base-100 border border-base rounded-2xl p-3">
                    <NuxtLink
                        :to="profile.user.url"
                        class="flex items-center gap-3"
                        target="_blank"
                    >
                        <img
                            :alt="profile.user.name"
                            :src="profile.user.avatarUrl"
                            class="size-10 rounded-full"
                        >
                        <div class="flex flex-col space-y-1">
                            <span class="text-sm font-mono">{{ profile.user.name }}</span>
                            <span class="text-base-content/60 text-xs font-mono">
                                {{ profile.user.login }}
                                <template v-if="profile.user.pronouns">
                                    · {{ profile.user.pronouns }}
                                </template>
                            </span>
                        </div>
                        <div class="ml-auto flex flex-col">
                            <span class="text-base-content/60 text-xs font-mono">
                                <span
                                    class="font-semibold text-info"
                                >{{ profile.user.followers.totalCount }}</span> followers</span>
                            <span class="text-base-content/60 text-xs font-mono">
                                <span
                                    class="font-semibold text-success"
                                >{{ profile.user.following.totalCount }}</span> following</span>
                        </div>
                    </NuxtLink>
                </div>
                <BranchLine />
                <div
                    :class="cn(
                        'ml-5 space-y-5 relative [&>div:first-child>div.absolute]:hidden',
                        'overflow-x-hidden',
                        'overflow-y-auto',
                        'h-full',
                    )"
                >
                    <PullRequestItems
                        v-for="item in profile.user.pullRequests.nodes"
                        :key="item.number"
                        :item="item"
                    />
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { IGithubData, IGithubUser } from '~/types'
import { cn } from '~/lib/utils'

defineOptions({
    name: 'GithubProfilePullRequest',
})

const config = useRuntimeConfig()
const emit = defineEmits(['loaded'])

const props = withDefaults(defineProps<{
    owner: string
    autoStart?: boolean
}>(), {
    autoStart: false,
})

const loading = ref<boolean>(true)
const profile = ref<IGithubUser>({})

onMounted(async () => {
    if (props.autoStart) {
        await fetchGithubProfile()
    }
})

const fetchGithubProfile = async (retryCount: number = 1) => {
    if (!loading.value) return

    const token = config.public.githubToken || ''

    try {
        const { data } = await $fetch<IGithubData>('https://api.github.com/graphql', {
            method: 'post',
            body: JSON.stringify({
                query: `query ($login: String!) {
    user(login: $login) {
        login # 用户的登录名，即 @xxxx
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
        }
        pullRequests(
            first: 50
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
        }
    }
}`,
                variables: {
                    login: props.owner,
                },
            }),
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'SixNineNine',
                'Authorization': `Bearer ${token}`,
            },
            timeout: 5000,
        })
        profile.value = data
        loading.value = false
        emit('loaded')
    }
    catch (error) {
        console.error(`fetchGithubProfile failed on attempt #${retryCount + 1}:`, error)
        await new Promise(resolve => setTimeout(resolve, 2000))
        await fetchGithubProfile(retryCount + 1)
    }
}

defineExpose({ fetchGithubProfile })
</script>
