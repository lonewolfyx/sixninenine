<template>
    <div
        :class="cn(props.class)"
        data-slot="timeline-header"
    >
        <slot />
    </div>
</template>

<script lang="ts" setup>
import { cn } from '~/lib/utils'
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
    class?: HTMLAttributes['class']
}>()
</script>
