<template>
    <Tabs
        v-model="tabValue"
        :class="cn(
            '[--sidebar-width:3.75rem] md:[--sidebar-width:15.625rem]',
        )"
        class="flex flex-row grow pt-(--header-height)"
    >
        <div
            :class="cn(
                'fixed w-(--sidebar-width) lg:top-(--header-height) z-20',
                'flex flex-col items-stretch shrink-0 group',
                'px-0 md:px-3',
            )"
        >
            <TabsList class="flex grow shrink-0 w-full">
                <div
                    class="overflow-y-auto gap-2.5 w-full flex flex-col items-center md:items-start max-h-[calc(100dvh-70px))]"
                >
                    <TabsTrigger
                        :value="OpenSourceProjectMember"
                        as-child
                        class="size-10 md:w-full overflow-visible cursor-pointer"
                        @click="handleTabChange(OpenSourceProjectMember)"
                    >
                        <div class="flex justify-start items-center gap-4">
                            <Avatar class="flex flex-col justify-center items-center">
                                <AvatarImage
                                    alt=""
                                    class="rounded-full"
                                    src="/opensource.svg"
                                />
                                <AvatarFallback>SN</AvatarFallback>
                            </Avatar>
                            <span class="font-medium text-sm text-neutral hidden md:block">Open Source Project</span>
                        </div>
                    </TabsTrigger>
                    <TabsTrigger
                        v-for="member in members"
                        :key="member.username"
                        :value="member.username"
                        as-child
                        class="size-10 md:w-full overflow-visible cursor-pointer"
                        @click="handleTabChange(member.username)"
                    >
                        <div class="flex justify-start items-center gap-4">
                            <Avatar class="flex flex-col justify-center items-center">
                                <AvatarImage
                                    :alt="member"
                                    :src="`https://github.com/${member.username}.png`"
                                    class="rounded-full"
                                />
                                <AvatarFallback>SN</AvatarFallback>
                            </Avatar>
                            <span class="font-medium text-sm text-neutral hidden md:block">{{
                                member?.aliasName ?? member.username
                            }}</span>
                        </div>
                    </TabsTrigger>
                </div>
            </TabsList>
        </div>
        <div
            class="flex grow rounded-lg border border-base-300 bg-white mx-5 ms-(--sidebar-width) mb-5"
        >
            <div
                class="flex flex-col grow overflow-y-scroll p-4 break-all"
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
</script>
