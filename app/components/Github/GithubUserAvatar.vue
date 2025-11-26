<template>
    <Avatar>
        <AvatarImage
            :src="`https://github.com/${username}.png`"
            class="size-14 rounded-full"
        />
        <AvatarFallback>SN</AvatarFallback>
    </Avatar>
</template>

<script lang="ts" setup>
defineOptions({
    name: 'GithubUserAvatar',
})

withDefaults(defineProps<{
    username?: string
}>(), {
    username: '',
})
</script>
