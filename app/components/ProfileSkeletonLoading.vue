<template>
    <div class="bg-base/60 border border-base rounded-2xl p-3 h-14" />
    <BranchLine />
    <div
        :class="cn(
            'ml-5 space-y-5 relative [&>div:first-child>div.absolute]:hidden',
            'overflow-x-hidden',
            'overflow-y-auto',
            'h-full',
        )"
    >
        <div class="relative">
            <div class="absolute bg-base w-[1px] h-5 -top-5 left-[27px] z-9" />
            <div class="bg-base/60 border border-base rounded-2xl p-3 z-10 h-11" />
        </div>
        <div class="relative">
            <div class="absolute bg-base w-[1px] h-5 -top-5 left-[27px] z-9" />
            <div class="bg-base/60 border border-base rounded-2xl p-3 z-10 h-11" />
        </div>
        <div class="relative">
            <div class="absolute bg-base w-[1px] h-5 -top-5 left-[27px] z-9" />
            <div class="bg-base/60 border border-base rounded-2xl p-3 z-10 h-11" />
        </div>
        <div class="relative">
            <div class="absolute bg-base w-[1px] h-5 -top-5 left-[27px] z-9" />
            <div class="bg-base/60 border border-base rounded-2xl p-3 z-10 h-11" />
        </div>
        <div class="relative">
            <div class="absolute bg-base w-[1px] h-5 -top-5 left-[27px] z-9" />
            <div class="bg-base/60 border border-base rounded-2xl p-3 z-10 h-11" />
        </div>
        <div class="relative">
            <div class="absolute bg-base w-[1px] h-5 -top-5 left-[27px] z-9" />
            <div class="bg-base/60 border border-base rounded-2xl p-3 z-10 h-11" />
        </div>
        <div class="relative">
            <div class="absolute bg-base w-[1px] h-5 -top-5 left-[27px] z-9" />
            <div class="bg-base/60 border border-base rounded-2xl p-3 z-10 h-11" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { cn } from '~/lib/utils'

defineOptions({
    name: 'ProfileSkeletonLoading',
})
</script>
