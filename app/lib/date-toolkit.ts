import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.extend(updateLocale)
dayjs.locale('zh-cn')

// 自定义中文配置
dayjs.updateLocale('zh-cn', {
    relativeTime: {
        future: '%s内',
        past: '%s前',
        s: '几秒',
        m: '1分钟',
        mm: '%d分钟',
        h: '1小时',
        hh: '%d小时',
        d: '1天',
        dd: '%d天',
        M: '1个月',
        MM: '%d个月',
        y: '1年',
        yy: '%d年',
    },
})

export function formatGitHubStyle(time: string): string {
    const now = dayjs()
    const target = dayjs(time)
    const diffInMinutes = now.diff(time, 'minute')
    const diffInHours = now.diff(time, 'hour')
    const diffInDays = now.diff(time, 'day')
    const diffInWeeks = now.diff(time, 'week')
    const diffInMonths = now.diff(time, 'month')
    const diffInYears = now.diff(time, 'year')

    const strategies: {
        condition: () => boolean
        implement: () => string
    }[] = [
        {
            condition: () => diffInMinutes < 1,
            implement: () => '刚刚',
        },
        {
            condition: () => diffInMinutes < 60,
            implement: () => `${diffInMinutes}分钟前`,
        },
        {
            condition: () => diffInHours < 24,
            implement: () => `${diffInHours}小时前`,
        },
        {
            condition: () => diffInDays === 1,
            implement: () => '昨天',
        },
        {
            condition: () => diffInDays === 2,
            implement: () => '前天',
        },
        {
            condition: () => diffInDays < 7,
            implement: () => `${diffInDays}天前`,
        },
        {
            condition: () => diffInWeeks === 1,
            implement: () => '上周',
        },
        {
            condition: () => diffInWeeks < 4,
            implement: () => `${diffInWeeks}周前`,
        },
        {
            condition: () => diffInMonths === 1 || (diffInMonths === 0 && diffInWeeks >= 4),
            implement: () => '上个月',
        },
        {
            condition: () => diffInMonths < 12,
            implement: () => `${diffInMonths}个月前`,
        },
        {
            condition: () => diffInYears === 1,
            implement: () => '去年',
        },
        {
            condition: () => true,
            implement: () => `${diffInYears}年前`,
        },
    ]

    for (const strategy of strategies) {
        if (strategy.condition()) {
            return strategy.implement()
        }
    }
    return target.fromNow()
}
