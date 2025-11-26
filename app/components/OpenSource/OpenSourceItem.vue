<template>
    <div
        v-for="(items, projectName) in openSourceMembers"
        :key="projectName"
        class="relative mb-10 pl-8"
    >
        <div
            class="bg-primary-content absolute left-0 top-2 flex size-5 items-center justify-center rounded-full"
        >
            <div class="bg-base-100 size-3 rounded-full" />
        </div>
        <Badge
            class="mb-4 rounded-xl px-3 py-2 text-sm bg-base-100"
        >
            {{ projectName }}
        </Badge>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <template
                v-for="(osMembers, type) in items"
                :key="`${projectName}-${type}`"
            >
                <OpenSourceProjectMemberList
                    v-if="osMembers"
                    :os-members="osMembers"
                    :type="type"
                />
            </template>
        </div>
    </div>
</template>

<script lang="ts" setup>
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import VirtualMembers from 'virtual-members'
import { Badge } from '~/components/ui/badge'
import { members, openSourceMembers } from '~/constant/members'

defineOptions({
    name: 'OpenSourceItem',
})
</script>
