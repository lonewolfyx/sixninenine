<template>
    <Tabs
        v-model="tabValue"
        :class="cn(
            '[--sidebar-width:3.75rem] lg:[--sidebar-width:15.625rem]',
        )"
        class="flex flex-col lg:flex-row grow lg:pt-(--header-height) w-full overflow-x-hidden"
    >
        <div
            :class="cn(
                'w-full lg:w-(--sidebar-width) sticky lg:fixed top-(--header-height) z-20',
                'flex flex-col items-stretch shrink-0 group',
                'px-0 lg:px-3',
                'order-1',
                'bg-white lg:shadow-none',
                'max-w-full',
            )"
        >
            <TabsList class="flex grow shrink-0 w-full overflow-hidden">
                <div
                    ref="scrollContainer"
                    class="overflow-x-auto lg:overflow-y-auto gap-2.5 w-full flex flex-row lg:flex-col items-center lg:items-start lg:max-h-[calc(100dvh-70px)] py-2 lg:py-4 px-4 lg:px-0 scrollbar-hide"
                >
                    <TabsTrigger
                        :value="OpenSourceProjectMember"
                        class="w-20 lg:w-full overflow-visible cursor-pointer shrink-0 flex flex-col lg:flex-row justify-center lg:justify-start items-center gap-1 lg:gap-4"
                        @click="handleTabChange(OpenSourceProjectMember)"
                    >
                        <Avatar class="flex flex-col justify-center items-center size-10">
                            <AvatarImage
                                alt=""
                                class="rounded-full"
                                src="/opensource.svg"
                            />
                            <AvatarFallback>SN</AvatarFallback>
                        </Avatar>
                        <span class="font-medium text-xs lg:text-sm text-neutral whitespace-nowrap text-center lg:text-left overflow-hidden text-ellipsis max-w-full">Open Source Project</span>
                    </TabsTrigger>
                    <TabsTrigger
                        v-for="member in members"
                        :key="member.username"
                        :value="member.username"
                        class="w-20 lg:w-full overflow-visible cursor-pointer shrink-0 flex flex-col lg:flex-row justify-center lg:justify-start items-center gap-1 lg:gap-4"
                        @click="handleTabChange(member.username)"
                    >
                        <Avatar class="flex flex-col justify-center items-center size-10">
                            <AvatarImage
                                :alt="member"
                                :src="`https://github.com/${member.username}.png`"
                                class="rounded-full"
                            />
                            <AvatarFallback>SN</AvatarFallback>
                        </Avatar>
                        <span class="font-medium text-xs lg:text-sm text-neutral whitespace-nowrap text-center lg:text-left overflow-hidden text-ellipsis max-w-full">{{
                            member?.aliasName ?? member.username
                        }}</span>
                    </TabsTrigger>
                </div>
            </TabsList>
        </div>
        <div
            class="flex grow rounded-lg border border-base-300 bg-white mx-[10px] lg:mx-5 lg:ms-[calc(var(--sidebar-width)_+_theme(spacing.5))] mb-5 mt-[50px] lg:mt-0 order-2 min-w-0"
        >
            <div
                class="flex flex-col grow overflow-y-scroll p-2 lg:p-4 break-all w-full"
            >
                <TabsContent value="OpenSourceProjectMember">
                    <OpenSourceProject />
                </TabsContent>
                <TabsContent
                    v-for="member in members"
                    :key="`tc-${member.username}`"
                    :value="member.username"
                >
                    <GithubDashboard
                        v-if="VirtualMembers?.[tabValue]"
                        :alias-name="member.aliasName"
                        :data="VirtualMembers?.[tabValue]"
                    />
                </TabsContent>
            </div>
        </div>
    </Tabs>
</template>

<script lang="ts" setup>
import { members } from '~/constant/members'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import VirtualMembers from 'virtual-members'
import { cn } from '~/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import GithubDashboard from '~/components/Github/GithubDashboard.vue'

const route = useRoute()
const router = useRouter()
const scrollContainer = ref<HTMLDivElement | null>(null)

const OpenSourceProjectMember = 'OpenSourceProjectMember'
const resolveUser = (val: string) => {
    const member = members.find(m => m.username === val)
    return member?.username ?? OpenSourceProjectMember
}

// 从路由参数获取当前选中的用户，如果没有则使用第一个成员
const tabValue = computed({
    get: () => {
        return resolveUser(route.query.user as string)
    },
    set: (value) => {
        const resolved = resolveUser(value)

        // 当tab值改变时更新路由
        if (route.query.user !== resolved) {
            router.push({
                path: route.path,
                query: { ...route.query, user: value },
            })
        }
    },
})

// 处理tab切换
const handleTabChange = (username: string) => {
    tabValue.value = username
}

// 监听路由变化，确保tab高亮与路由同步
watch(() => route.query.user, (newUser) => {
    if (newUser && (members.some(m => m.username === newUser) || newUser === OpenSourceProjectMember)) {
        // 路由参数变化时，确保tabValue同步
        tabValue.value = newUser as string
    }
})

// 鼠标滚轮横向滚动
onMounted(() => {
    const container = scrollContainer.value
    if (!container)
        return

    const handleWheel = (e: WheelEvent) => {
        // 只在小屏和中屏且横向布局时启用 (< 1024px)
        if (window.innerWidth >= 1024)
            return

        // 阻止默认垂直滚动
        if (e.deltaY !== 0) {
            e.preventDefault()
            container.scrollLeft += e.deltaY
        }
    }

    container.addEventListener('wheel', handleWheel, { passive: false })

    // 清理
    onUnmounted(() => {
        container.removeEventListener('wheel', handleWheel)
    })
})
</script>
