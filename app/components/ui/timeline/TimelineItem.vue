<template>
    <div
        :class="cn(
            'group/timeline-item',
            'has-[+[data-completed]]:[&_[data-slot=timeline-separator]]:bg-primary',
            'relative flex flex-1 flex-col gap-0.5',
            'group-data-[orientation=horizontal]/timeline:mt-8',
            'group-data-[orientation=horizontal]/timeline:not-last:pe-8',
            'group-data-[orientation=vertical]/timeline:ms-8',
            'group-data-[orientation=vertical]/timeline:not-last:pb-12',
            props.class,
        )"
        data-slot="timeline-item"
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
