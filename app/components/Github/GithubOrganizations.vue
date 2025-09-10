<template>
    <div class="grid items-stretch">
        <div class="flex items-center gap-4 mb-4">
            <h3 class="text-lg font-semibold">
                Organizations
            </h3>
        </div>
        <div
            v-if="organizations.length"
            class="flex flex-wrap justify-start items-center gap-2"
        >
            <TooltipProvider
                v-for="org in organizations"
                :key="org.login"
            >
                <Tooltip>
                    <TooltipTrigger>
                        <NuxtLink
                            class="cursor-pointer"
                            target="_blank"
                            :title="org.name"
                            :to="org.url"
                        >
                            <img
                                :alt="`@${org.name}`"
                                :src="org.avatarUrl"
                                class="border rounded-xl border-base-300 size-12 align-middle"
                            >
                        </NuxtLink>
                    </TooltipTrigger>
                    <TooltipContent>
                        {{ org.name }}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
        <div v-else>
            <div class="relative bg-base-100 p-3 space-y-3 rounded-2xl">
                <span class="text-sm text-gitColor-default">Has not joined any relevant organization</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { IOrganization } from '~/types'

defineOptions({
    name: 'GithubOrganizations',
})

const props = defineProps<{
    organizations: IOrganization[]
}>()
</script>
