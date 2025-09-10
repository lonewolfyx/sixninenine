<template>
    <div
        :class="cn(
            'border-primary/20',
            'group-data-completed/timeline-item:border-primary',
            'absolute size-4 rounded-full border-2',
            'group-data-[orientation=horizontal]/timeline:-top-6',
            'group-data-[orientation=horizontal]/timeline:left-0',
            'group-data-[orientation=horizontal]/timeline:-translate-y-1/2',
            'group-data-[orientation=vertical]/timeline:top-0',
            'group-data-[orientation=vertical]/timeline:-left-6',
            'group-data-[orientation=vertical]/timeline:-translate-x-1/2',
            props.class,
        )"
        aria-hidden="true"
        data-slot="timeline-indicator"
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
