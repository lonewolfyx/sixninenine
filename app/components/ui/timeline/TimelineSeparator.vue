<template>
    <div
        :class="cn(
            'bg-primary/10 absolute self-start',
            'group-last/timeline-item:hidden',
            'group-data-[orientation=horizontal]/timeline:-top-6',
            'group-data-[orientation=horizontal]/timeline:h-0.5',
            'group-data-[orientation=horizontal]/timeline:w-[calc(100%-1rem-0.25rem)]',
            'group-data-[orientation=horizontal]/timeline:translate-x-4.5',
            'group-data-[orientation=horizontal]/timeline:-translate-y-1/2',
            'group-data-[orientation=vertical]/timeline:-left-6 group-data-[orientation=vertical]/timeline:h-[calc(100%-1rem-0.25rem)]',
            'group-data-[orientation=vertical]/timeline:w-0.5',
            'group-data-[orientation=vertical]/timeline:-translate-x-1/2',
            'group-data-[orientation=vertical]/timeline:translate-y-4.5',
            props.class,
        )"
        data-slot="timeline-separator"
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
