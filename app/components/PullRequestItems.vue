<template>
    <div class="relative">
        <div class="absolute bg-base w-[1px] h-5 -top-5 left-[27px] z-9" />
        <div class="bg-base-100 border border-base rounded-2xl p-3 z-10">
            <div class="flex justify-start items-center text-sm text-base-content/60 gap-2 mb-2">
                <Icon
                    name="lucide:warehouse"
                    size="14"
                    class="text-base-content/60"
                />
                <span>{{ item.repository.nameWithOwner }}</span>
            </div>
            <div class="flex justify-start content-start gap-2 w-full mb-3">
                <div>
                    <Icon
                        v-if="item.state === 'OPEN'"
                        class="text-green-600 size-4"
                        name="lucide:git-pull-request"
                        size="16"
                    />
                    <Icon
                        v-if="item.state === 'MERGED'"
                        class="text-violet-600 size-4"
                        name="lucide:git-merge"
                        size="16"
                    />
                    <Icon
                        v-if="item.state === 'CLOSED'"
                        class="text-red-600 size-4"
                        name="lucide:git-pull-request-closed"
                        size="16"
                    />
                </div>
                <NuxtLink
                    :to="item.url"
                    class="font-mono line-clamp-2 text-sm"
                    target="_blank"
                >{{ item.title }}
                </NuxtLink>
            </div>
            <div class="flex items-center text-base-content/60 text-xs gap-1.5">
                <span class="">#{{ item.number }}</span>
                <span class="mx-0.5 size-0.5 bg-base-content/60 rounded-full" />
                <span
                    v-if="item.additions"
                    class="font-semibold text-green-500"
                >+{{ item.additions }}</span>
                <span
                    v-if="item.deletions"
                    class="font-semibold text-red-500"
                >-{{ item.deletions }}</span>
                <span>lines changed</span>
                <span class="mx-0.5 size-0.5 bg-base-content/60 rounded-full" />
                <span class="">{{ item.totalCommentsCount }} comments</span>
                <span class="mx-0.5 size-0.5 bg-base-content/60 rounded-full" />
                <span class="">{{ dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss') }}</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { IPullRequest } from '~/types'
import dayjs from 'dayjs'

defineOptions({
    name: 'PullRequestItems',
})

const props = defineProps<{
    item: IPullRequest
}>()
</script>
