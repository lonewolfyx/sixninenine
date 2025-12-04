export const useConfig = createGlobalState(() => {
    const config = reactive({
        height: 0,
    })

    const setHeight = (val: number) => {
        config.height = val
    }

    return {
        config,
        setHeight,
    }
})
