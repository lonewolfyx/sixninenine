<template>
    <time
        :class="cn(
            'text-muted-foreground mb-1 block text-xs font-medium',
            props.class,
        )"
        data-slot="timeline-date"
    >
        <slot />
    </time>
</template>

<script lang="ts" setup>
import { cn } from '~/lib/utils'
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
    class?: HTMLAttributes['class']
}>()
</script>
