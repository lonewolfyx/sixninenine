<template>
    <div
        v-for="member in osMembers"
        :key="`open-source-${member}`"
        class="border rounded-xl border-base-200 bg-base-100 p-3"
    >
        <OpenSourceProjectMember
            :member="member"
            :type="type"
        />
    </div>
</template>

<script lang="ts" setup>
import type { OpenSourceTypes } from '~/constant/members'

defineOptions({
    name: 'OpenSourceProjectMemberList',
})

defineProps<{
    osMembers: string[]
    type: OpenSourceTypes
}>()
</script>
