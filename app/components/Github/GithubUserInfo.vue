<template>
    <div
        class="bg-center bg-cover bg-no-repeat bg-[url('/hero.png')] mb-5"
    >
        <div class="px-4">
            <div class="flex flex-col items-center gap-2 lg:gap-3.5 py-4 lg:pt-5 lg:pb-10">
                <NuxtLink
                    :title="namePlaceholder"
                    :to="userInfo.url"
                    target="_blank"
                >
                    <img
                        :alt="namePlaceholder"
                        :src="userInfo.avatarUrl"
                        class="rounded-full size-28 shadow-[0_0_5px_1px_theme(color.green.500)] shrink-0"
                    >
                </NuxtLink>
                <div class="flex flex-col">
                    <p class="flex items-center gap-2">
                        <NuxtLink
                            :title="namePlaceholder"
                            :to="userInfo.url"
                            class="text-lg leading-5 font-semibold text-mono"
                            target="_blank"
                        >
                            {{ username }}
                        </NuxtLink>
                        <span class="text-xs">@{{ userInfo.login }}</span>
                    </p>
                </div>

                <div class="flex flex-wrap justify-center gap-1 lg:gap-4.5 text-sm">
                    <div class="flex gap-1.25 items-center">
                        <Icon
                            class="text-base-content/60"
                            name="lucide:users"
                        />
                        <span class="text-base-content/60 font-medium">
                            <span
                                class="font-semibold text-info"
                            >{{ userInfo.followers }}</span> followers
                        </span>
                    </div>
                    <div class="flex gap-1.25 items-center">
                        <Icon
                            class="text-base-content/60"
                            name="lucide:user-star"
                        />
                        <span class="text-base-content/60 font-medium">
                            <span
                                class="font-semibold text-success"
                            >{{ userInfo.following }}</span> following
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { IGithubUserInfo } from '~/types'

defineOptions({
    name: 'GithubUserInfo',
})

const props = defineProps<{
    userInfo: IGithubUserInfo
    aliasName?: string
}>()

const namePlaceholder = computed(() => {
    const base = `${props.userInfo.login} · ${props.userInfo.name}`
    return props.aliasName ? `${base} · ${props.aliasName}` : base
})

const username = computed(() => {
    return [
        props.userInfo.name,
        props.userInfo.name === props.aliasName ? '' : props.aliasName,
    ].filter(Boolean).join(' · ')
})
</script>
