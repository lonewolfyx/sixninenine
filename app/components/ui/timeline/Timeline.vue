<template>
    <div
        :class="cn(
            'group/timeline flex',
            'data-[orientation=horizontal]:w-full',
            'data-[orientation=horizontal]:flex-row',
            'data-[orientation=vertical]:flex-col',
            props.class,
        ) "
        :data-orientation="props.orientation"
        data-slot="timeline"
    >
        <slot />
    </div>
</template>

<script lang="ts" setup>
import { cn } from '~/lib/utils'
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
    class?: HTMLAttributes['class']
    orientation: 'horizontal' | 'vertical'
}>()
</script>
