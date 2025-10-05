<template>
  <Tabs
    v-model="tabValue"
    class="flex flex-col lg:flex-row grow pt-(--header-height)"
  >
    <div
      :class="
        cn(
          'fixed w-(--sidebar-width) lg:top-(--header-height) z-20',
          'hidden lg:flex flex-col items-stretch shrink-0 group',
          'py-3 lg:py-0'
        )
      "
    >
      <TabsList class="flex grow shrink-0 w-full">
        <div
          class="overflow-y-auto gap-2.5 w-full flex flex-col items-center max-h-[calc(100dvh-10px))] lg:max-h-[calc(100dvh-70px))]"
        >
          <TabsTrigger
            v-for="member in members"
            :key="member.username"
            :value="member.username"
            as-child
            class="size-10 overflow-visible cursor-pointer"
          >
            <Avatar class="flex flex-col justify-center items-center">
              <AvatarImage
                :alt="member"
                :src="`https://github.com/${member.username}.png`"
                class="rounded-full"
              />
              <AvatarFallback>SN</AvatarFallback>
            </Avatar>
          </TabsTrigger>
        </div>
      </TabsList>
    </div>
    <div
      class="flex grow rounded-lg border border-base-300 bg-white mx-5 lg:ms-(--sidebar-width) mb-5"
    >
      <div
        class="flex flex-col grow overflow-y-scroll lg:overflow-auto p-4 break-all"
      >
        <TabsContent
          v-for="member in members"
          :key="`tc-${member.username}`"
          :value="member.username"
        >
          <GithubDashboard
            :data="VirtualMembers?.[tabValue]"
            :aliasName="member.aliasName"
          />
        </TabsContent>
      </div>
    </div>
  </Tabs>
</template>

<script lang="ts" setup>
import { members } from "~/constant/members"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import VirtualMembers from "virtual-members"
import { cn } from "~/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import GithubDashboard from "~/components/Github/GithubDashboard.vue"

const tabValue = ref<string>(members?.[0]?.username as string)
</script>
