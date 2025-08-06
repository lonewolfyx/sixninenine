<template>
    <div class="fixed px-4 w-full flex items-center py-2 z-20">
        <div class="w-full flex items-center gap-2">
            <img
                alt=""
                class="size-7"
                src="/logo.svg"
            >
            <span class="text-base-content text-sm leading-0.5">SixNineNine</span>
        </div>
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

    <div class="relative w-ful h-full">
        <div class="absolute top-14 bottom-0 left-0 right-0 overflow-x-auto overflow-y-hidden">
            <div class="flex flex-row w-full h-full">
                <GithubProfilePullRequest
                    v-for="(owner, index) in owners"
                    :key="owner"
                    ref="profileRef"
                    :auto-start="index === 0"
                    :owner="owner"
                    @loaded="nextData(index)"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const config = useRuntimeConfig()
const owners = ref([
    'pkc918',
    'yuguaa',
    'ArthurDarkstone',
    'lonewolfyx',
    'broBinChen',
    'ilyaliao',
    'keeplearning66',
    'ffgenius',
    'doyuli',
])

const profileRef = useTemplateRef('profileRef')

const nextData = async (index: number) => {
    const next = profileRef.value?.[index + 1]
    if (next) {
        await next.fetchGithubProfile()
    }
}
</script>
