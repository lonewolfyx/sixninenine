<template>
    <div class="grid items-stretch">
        <div class="flex items-center gap-4 mb-4">
            <h3 class="text-lg font-semibold">
                Recent Activity
            </h3>
        </div>
        <Timeline
            class="flex-1"
            orientation="vertical"
        >
            <TimelineItem
                v-for="item in pullRequests"
                :key="`${md5(item.number.toString())}${md5(item.title)}`"
                class="group-data-[orientation=vertical]/timeline:ms-10"
            >
                <TimelineHeader>
                    <TimelineSeparator
                        class="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-6.5"
                    />
                    <TimelineTitle class="mt-0.5 text-base-content/60">
                        {{ item.repository.nameWithOwner }}
                    </TimelineTitle>
                    <TimelineIndicator
                        class="bg-primary/10 group-data-completed/timeline-item:bg-primary group-data-completed/timeline-item:text-primary-foreground flex size-6 items-center justify-center border-none group-data-[orientation=vertical]/timeline:-left-7"
                    >
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
                    </TimelineIndicator>
                </TimelineHeader>
                <TimelineContent>
                    <NuxtLink
                        :to="item.url"
                        class="font-mono line-clamp-2 text-sm text-base-content"
                        target="_blank"
                    >
                        {{ item.title }}
                    </NuxtLink>
                    <TimelineDate class="mt-2 mb-0">
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
                    </TimelineDate>
                </TimelineContent>
            </TimelineItem>
        </Timeline>
    </div>
</template>

<script lang="ts" setup>
import type { IPullRequest } from '~/types'
import dayjs from 'dayjs'
import md5 from 'md5'

defineOptions({
    name: 'GithubPullRequest',
})

const props = defineProps<{
    pullRequests: IPullRequest[]
}>()
</script>
