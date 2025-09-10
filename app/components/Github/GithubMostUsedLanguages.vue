<template>
    <div class="relative">
        <div class="flex items-center gap-4 mb-4">
            <h3 class="text-lg font-semibold">
                Most Used Languages
            </h3>
        </div>
        <div
            v-if="languages.length"
            class="relative bg-base-100 p-3 space-y-3 rounded-2xl"
        >
            <div class="relative w-full max-w-full h-2 rounded-full overflow-hidden flex">
                <div
                    v-for="language in languages.slice(0, 12)"
                    :key="`lgc${language.name}`"
                    :style="{
                        backgroundColor: language.color,
                        flexBasis: `${language.progress}%`,
                    }"
                    class="flex-none"
                />
            </div>
            <div class="grid grid-cols-2 gap-2 gap-x-6">
                <div
                    v-for="language in languages.slice(0, 12)"
                    :key="`lag${language.name}`"
                    class="flex justify-start items-center gap-2"
                >
                    <span
                        :style="{
                            backgroundColor: `${language.color}`,
                        }"
                        class="relative w-3 h-3 rounded-full"
                    />
                    <span
                        class="text-sm mr-auto text-gitColor-default font-mono"
                    >{{ language.name }}</span>
                    <span class="text-xs text-gitColor-default font-mono">{{ language.progress }}%</span>
                </div>
            </div>
        </div>
        <div v-else>
            <div class="relative bg-base-100 p-3 space-y-3 rounded-2xl">
                <span class="text-sm text-gitColor-default">No open source projects</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { IUserLanguages } from '~/types'

defineOptions({
    name: 'GithubMostUsedLanguages',
})

const props = defineProps<{
    languages: IUserLanguages[]
}>()
</script>

<style scoped>

</style>
