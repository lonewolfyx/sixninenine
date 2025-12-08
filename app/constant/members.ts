type membersType = {
    username: string
    aliasName?: string
}
export const members: membersType[] = [
    { username: 'pkc918', aliasName: '肉丝哥' }, // 肉丝哥
    { username: 'kovsu' }, // antdv 团队成员
    { username: 'ilyaliao' }, // vueuse 团队成员
    { username: 'Bao0630' }, // ant-design-x-vue 团队成员
    { username: 'yuguaa', aliasName: '菠萝吹雪' }, // Element-Plus-X
    { username: 'lonewolfyx' },
    { username: 'ArthurDarkstone', aliasName: '高手哥' }, // 高手哥
    { username: 'broBinChen', aliasName: '木木哥' }, // 木木哥
    { username: 'NoiseFan', aliasName: '澎澎同学' },
    { username: 'ffgenius', aliasName: '付伟斌' }, // 粉红色的回忆
    { username: 'heyrian', aliasName: '日安' }, // 日安小姐姐
    { username: 'LarryZhu-dev', aliasName: '朱永博' },
    { username: 'doyuli', aliasName: '阿沥' },
    { username: 'keeplearning66' },
    { username: 'qianYuanJ' },
    { username: 'snowbitx', aliasName: '社会哥' },
    { username: 'TAYUN', aliasName: '云阁' },
    { username: 'jsy-0526', aliasName: '阳哥' }, // 阳哥
    { username: 'wan-kong' },
    { username: 'penghangtao' },
    { username: 'lbineau' },
    { username: 'Chang-Chen' },
    { username: 'ls1072502993', aliasName: '李盛' },
    { username: '984507092', aliasName: '鹤鸣' },
]

export type OpenSourceTypes = 'team' | 'contributors'
type OpenSourceMembersType = {
    [key: string]: {
        [K in OpenSourceTypes]?: string[];
    }
}
export const openSourceMembers: OpenSourceMembersType = {
    'Vue': {
        contributors: ['jsy-0526'],
    },
    'Vue Use': {
        team: ['ilyaliao'],
        contributors: [
            'pkc918',
            'ArthurDarkstone',
            'broBinChen',
            'doyuli',
            'snowbitx',
            'jsy-0526',
        ],
    },
    'MDN Docs Cn': {
        contributors: ['lonewolfyx', 'pkc918'],
    },
    'ViteDevTools': {
        contributors: ['lonewolfyx', 'pkc918'],
    },
    'Element Plus': {
        contributors: ['keeplearning66', 'snowbitx'],
    },
    'Element Plus X': {
        team: ['yuguaa'],
        contributors: ['Chang-Chen'],
    },
    'Ant Design Vue': {
        team: ['kovsu'],
    },
    'And Design X Vue': {
        contributors: ['Bao0630'],
    },
    'Vitest Docs Cn': {
        team: ['NoiseFan'],
        contributors: ['984507092'],
    },
    'Ant Design': {
        contributors: ['984507092'],
    },
    'Ant Design Mobile': {
        contributors: ['984507092'],
    },
    'DocFlow': {
        contributors: ['984507092'],
    },
}
