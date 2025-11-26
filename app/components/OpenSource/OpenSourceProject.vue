<template>
    <div class="relative">
        <div class="overflow-hidden py-16 bg-center bg-cover bg-no-repeat bg-[url('/hero.png')]">
            <div class="flex flex-col items-center space-y-6">
                <h1 class="font-mono text-2xl md:text-4xl leading-6">
                    Overview Of Project Participation
                </h1>
                <span class="text-primary-content/55 text-lg block">
                    some 699 members contributed to open source projects and successfully joined open source community teams
                </span>
            </div>
        </div>
        <div class="container">
            <div class="relative">
                <Separator
                    class="bg-base-100 absolute left-2 top-4"
                    orientation="vertical"
                />
                <OpenSourceItem />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import VirtualMembers from 'virtual-members'
import { Separator } from '~/components/ui/separator'
import { Badge } from '~/components/ui/badge'
import { openSourceMembers } from '~/constant/members'

defineOptions({
    name: 'OpenSourceProject',
})
</script>
