<template>
    <div class="flex grow w-full h-full">
        <header class="flex items-center fixed z-30 top-0 left-0 right-0 shrink-0 h-(--header-height) bg-white shadow-sm">
            <div class="px-4 w-full py-2 z-20">
                <div class="grid grid-cols-12 gap-2">
                    <div class="col-span-1">
                        <div class="w-full flex items-center gap-2">
                            <img
                                alt=""
                                class="size-7"
                                src="/logo.svg"
                            >
                            <span class="text-base-content text-sm leading-0.5">SixNineNine</span>
                        </div>
                    </div>
                    <div class="col-span-10 flex justify-center items-center overflow-x-auto">
                        <NavigationMenu>
                            <NavigationMenuList class="flex-nowrap">
                                <NavigationMenuItem>
                                    <NavigationMenuLink
                                        :class="navigationMenuTriggerStyle()"
                                        class="text-xs lg:text-sm whitespace-nowrap"
                                        href="https://awesome-alfred-skyblue.vercel.app"
                                        target="_blank"
                                    >
                                        远方os Code Collection
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuLink
                                        :class="navigationMenuTriggerStyle()"
                                        class="text-xs lg:text-sm whitespace-nowrap"
                                        href="https://github-profile-visualized.vercel.app"
                                        target="_blank"
                                    >
                                        Github Profile Visualized
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuLink
                                        :class="navigationMenuTriggerStyle()"
                                        class="text-xs lg:text-sm whitespace-nowrap"
                                        href="https://vue-blocks.dev"
                                        target="_blank"
                                    >
                                        VueBlocks
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>
                    <div class="col-span-1 flex justify-end items-center">
                        <NuxtLink
                            :to="config.public.githubRepo"
                            target="_blank"
                        >
                            <Icon
                                name="line-md:github-loop"
                                size="16"
                            />
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </header>
        <slot />
    </div>
</template>

<script lang="ts" setup>
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from '~/components/ui/navigation-menu'

const config = useRuntimeConfig()
</script>
