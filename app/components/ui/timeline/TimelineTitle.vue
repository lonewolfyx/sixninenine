<template>
    <h3
        :class="cn(
            'text-sm font-medium',
            props.class,
        )"
        data-slot="timeline-title"
    >
        <slot />
    </h3>
</template>

<script lang="ts" setup>
import { cn } from '~/lib/utils'
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
    class?: HTMLAttributes['class']
}>()
</script>
