<template>
    <div class="flex flex-col lg:flex-row grow lg:pt-(--header-height) overflow-x-hidden">
        <div
            :class="cn(
                'flex grow rounded-lg border border-base-300',
                'bg-white mx-5 mb-5',
                'mt-12 md:lg:mt-0',
            )"
        >
            <div class="flex flex-col grow overflow-y-scroll p-4 break-all">
                <div class="overflow-hidden py-16 bg-center bg-cover bg-no-repeat bg-[url('/hero.png')]">
                    <div class="flex flex-col items-center space-y-6">
                        <h1 class="font-mono text-2xl md:text-4xl leading-6">
                            Contributions
                        </h1>
                        <span class="text-primary-content/55 text-lg block">
                            Let's take a look at the contribution of these old dens
                        </span>
                    </div>
                </div>
                <div class="relative flex flex-1 justify-center items-center">
                    <BubblePack
                        :data="contributions"
                        :size="700"
                        :min-radius="20"
                        :max-radius="80"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import VirtualMembers from 'virtual-members'
import { cn } from '~/lib/utils'
import type { IGithubUserData } from '~/types'

const contributions = computed(() => {
    return (Object.values(VirtualMembers) as IGithubUserData[]).map(m => ({
        ...m.userInfo,
        contributions: m.contributions.total,
    }))
})
</script>
