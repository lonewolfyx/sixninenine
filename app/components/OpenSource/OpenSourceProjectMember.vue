<template>
    <div class="flex items-center gap-2">
        <NuxtLink class="size-10 shrink relative">
            <img
                :alt="member"
                :src="`https://github.com/${member}.png`"
                class="size-10 rounded-full shadow"
            >
        </NuxtLink>
        <div class="flex flex-col gap-2">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <NuxtLink
                            :href="`https://github.com/${member}`"
                            class="flex text-base-content items-end font-medium gap-3"
                            target="_blank"
                        >
                            <div class="flex gap-1">
                                <Icon
                                    :class="cn(
                                        identity.isTeamer?'text-purple-600':'text-success',
                                    )"
                                    :name="identity.icon"
                                />

                                <span class="text-sm">{{ namePlaceholder }}</span>
                            </div>
                            <span class="text-base-content/65 text-xs">{{ user.userInfo.login }}</span>
                        </NuxtLink>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{{ identity.name }}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <div class="flex flex-wrap justify-start gap-1 lg:gap-4.5 text-xs">
                <div class="flex gap-1.25 items-center">
                    <Icon
                        class="text-base-content/60"
                        name="lucide:users"
                    />
                    <span class="text-base-content/60 font-medium">
                        <span
                            class="font-semibold text-info"
                        >{{ user.userInfo.followers }}</span> followers
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
                        >{{ user.userInfo.following }}</span> following
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import VirtualMembers from 'virtual-members'
import { members, type OpenSourceTypes } from '~/constant/members'
import { cn } from '~/lib/utils'

defineOptions({
    name: 'OpenSourceProjectMember',
})

const props = withDefaults(defineProps<{
    member: string
    type: OpenSourceTypes
}>(), {})

const user = computed(() => VirtualMembers?.[props.member])

const namePlaceholder = computed(() => {
    const name = members.find(item => item.username === props.member)
    return user.value.userInfo.name ?? name?.aliasName
})

const identity = computed(() => {
    const isTeamer = props.type === 'team'
    return {
        isTeamer,
        name: isTeamer ? '团队成员' : '贡献者',
        icon: isTeamer ? 'streamline:star-badge-solid' : 'tabler:git-pull-request',
    }
})
</script>
