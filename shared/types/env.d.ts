declare module 'virtual-members' {
    import type { IGithubUserData } from '~/types'

    const data = Record<string, IGithubUserData>
    export default data
}
