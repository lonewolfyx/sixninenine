import type { Plugin } from 'vite'
import { glob } from 'glob'
import { resolve } from 'node:path'

const ID = 'virtual-members'
const VIRTUAL_ID = `\0${ID}`

export const virtualMembers = (): Plugin => {
    return {
        name: 'vite-plugin-members',
        resolveId(id) {
            return id === ID ? VIRTUAL_ID : null
        },
        async load(id) {
            if (id === VIRTUAL_ID) {
                const data: any[] = []
                const memberFiles = await glob('*.json', {
                    cwd: resolve(process.cwd(), 'app/data'),
                    absolute: true,
                    windowsPathsNoEscape: true,
                })

                await Promise.all(memberFiles.map(async (file) => {
                    const user = await import(file).then(m => m.default)
                    data.push([user.userInfo.login, user] as const)
                }))

                return `export default ${JSON.stringify(Object.fromEntries(data))}`
            }
        },
    }
}
