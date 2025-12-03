<template>
    <div class="flex items-center gap-2 min-w-0">
        <NuxtLink class="size-10 shrink-0 relative">
            <img
                :alt="member"
                :src="`https://github.com/${member}.png`"
                class="size-10 rounded-full shadow shrink-0"
            >
        </NuxtLink>
        <div class="flex flex-col gap-2 min-w-0 flex-1">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <NuxtLink
                            :href="`https://github.com/${member}`"
                            class="flex text-base-content items-center font-medium gap-2 min-w-0"
                            target="_blank"
                        >
                            <div class="flex gap-1 items-center min-w-0">
                                <Icon
                                    :class="cn(
                                        identity.isTeamer?'text-purple-600':'text-success',
                                    )"
                                    :name="identity.icon"
                                    class="shrink-0"
                                />

                                <span class="text-sm whitespace-nowrap overflow-hidden text-ellipsis">{{ namePlaceholder }}</span>
                            </div>
                            <span class="text-base-content/65 text-xs whitespace-nowrap overflow-hidden text-ellipsis shrink-0">{{ user.userInfo.login }}</span>
                        </NuxtLink>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{{ identity.name }}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <div class="flex flex-wrap justify-start gap-1 lg:gap-4.5 text-xs min-w-0">
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
