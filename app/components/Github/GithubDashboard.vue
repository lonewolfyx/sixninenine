<template>
    <div class="relative space-y-6">
        <GithubUserInfo
            :user-info="data['userInfo']"
            :alias-name="aliasName"
        />

        <div class="grid lg:grid-cols-3 gap-5 lg:gap-7.5 items-stretch">
            <div class="lg:col-span-1 space-y-8">
                <GithubOrganizations
                    v-if="data.organizations.nodes"
                    :organizations="data.organizations.nodes"
                />

                <GitHubContributorsHeatmap
                    :contributions="data['contributions']['contributions']"
                    :end-date="`${dayjs().year()}-12-31`"
                    :total="data['contributions']['total']"
                />

                <GithubMostUsedLanguages
                    v-if="data['languages']"
                    :languages="data['languages']"
                />
            </div>
            <div class="lg:col-span-2">
                <GithubPullRequest :pull-requests="data.pullRequest" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { IGithubUserData } from '~/types'
import GithubUserInfo from '~/components/Github/GithubUserInfo.vue'
import GitHubContributorsHeatmap from '~/components/Github/GitHubContributorsHeatmap.vue'
import GithubOrganizations from '~/components/Github/GithubOrganizations.vue'
import GithubPullRequest from '~/components/Github/GithubPullRequest.vue'
import dayjs from 'dayjs'

defineOptions({
    name: 'GithubDashboard',
})

const props = defineProps<{
    data: IGithubUserData
    aliasName?: string
}>()

const contributors = [
    { date: '2025-07-01', count: 0 },
    { date: '2025-07-02', count: 2 },
    { date: '2025-07-03', count: 5 },
    { date: '2025-07-04', count: 8 },
    { date: '2025-07-05', count: 12 },
    { date: '2025-07-06', count: 0 },
    { date: '2025-07-07', count: 0 },
    { date: '2025-07-08', count: 0 },
    { date: '2025-07-09', count: 1 },
    { date: '2025-07-10', count: 4 },
    { date: '2025-07-11', count: 7 },
    { date: '2025-07-12', count: 10 },
    { date: '2025-07-13', count: 0 },
    { date: '2025-07-14', count: 0 },
    { date: '2025-07-15', count: 0 },
    { date: '2025-07-16', count: 1 },
    { date: '2025-07-17', count: 4 },
    { date: '2025-07-18', count: 7 },
    { date: '2025-07-19', count: 2222 },
    { date: '2025-07-20', count: 0 },
    { date: '2025-07-21', count: 0 },
    { date: '2025-09-09', count: 456789 },
]
</script>

<style scoped>

</style>
