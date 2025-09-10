<template>
    <div class="max-w-full">
        <div class="flex items-center gap-4 mb-4">
            <h3 class="text-lg font-semibold">
                {{ Number(total).toLocaleString('en-US') }} Contributions in {{ dayjs().year() }}
            </h3>
        </div>

        <div class="w-full overflow-hidden">
            <div class="grid grid-rows-7 grid-flow-col gap-0.5 w-full">
                <TooltipProvider
                    v-for="day in flattenWeekGrid"
                    :key="day.iso"
                >
                    <Tooltip>
                        <TooltipTrigger>
                            <div
                                :class="cellClass(day.iso, day.inRange)"
                                :title="`${lookup(day.iso)} on ${day.iso}`"
                                class="aspect-square rounded-sm"
                            />
                        </TooltipTrigger>
                        <TooltipContent>
                            {{ lookup(day.iso) == 0 ? 'No' : lookup(day.iso) }} contributions on
                            {{ dayjs(day.iso).format('MMMM DD') }}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>

        <div class="mt-4 flex items-center gap-4 text-sm">
            <div class="flex items-center gap-2">
                <div class="w-4 h-4 rounded-sm bg-slate-100 border border-slate-200" />
                <span class="text-slate-600">0</span>
            </div>
            <div class="flex items-center gap-2">
                <div class="w-4 h-4 rounded-sm bg-emerald-200" />
                <span class="text-slate-600">Low</span>
            </div>
            <div class="flex items-center gap-2">
                <div class="w-4 h-4 rounded-sm bg-emerald-400 text-white" />
                <span class="text-slate-600">Medium</span>
            </div>
            <div class="flex items-center gap-2">
                <div class="w-4 h-4 rounded-sm bg-emerald-600 text-white" />
                <span class="text-slate-600">High</span>
            </div>
            <div class="flex items-center gap-2">
                <div class="w-4 h-4 rounded-sm bg-emerald-800 text-white" />
                <span class="text-slate-600">Very high</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { ITransformedContributionData } from '~/types'
import dayjs from 'dayjs'

const props = defineProps<{
    total: number
    contributions: ITransformedContributionData[]
    endDate: string
}>()

// 日期工具
function parseISO(s?: string | null): Date | null {
    if (!s) return null
    const parts = s.split('-')
    if (parts.length !== 3) return null
    const [y, m, d] = parts.map(Number)
    return new Date(y, m - 1, d)
}

function formatDate(d: Date | { valueOf: () => number } | null): string {
    if (!d) return ''
    const dateObj = d instanceof Date ? d : new Date((d as any).valueOf())
    return dateObj.toISOString().slice(0, 10)
}

function addDays(d: Date, n: number) {
    const t = new Date(d)
    t.setDate(t.getDate() + n)
    return t
}

function startOfWeek(d: Date) {
    const dd = new Date(d)
    const day = dd.getDay()
    dd.setDate(dd.getDate() - day)
    dd.setHours(0, 0, 0, 0)
    return dd
}

function daysBetween(a: Date, b: Date) {
    return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24))
}

const contributions = computed(() => props.contributions ?? [])

const displayEnd = computed(() => {
    if (props.endDate) {
        const d = parseISO(props.endDate)
        if (d) return d
    }
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return today
})
const nominalStart = computed(() => addDays(displayEnd.value, -364))
const displayStart = computed(() => startOfWeek(nominalStart.value))

const totalDays = computed(() => daysBetween(displayStart.value, displayEnd.value) + 1)
const weekCount = computed(() => Math.ceil(totalDays.value / 7))

// weekGrid: 数组[week][day]
const weekGrid = computed(() => {
    const weeks: { date: Date, iso: string, inRange: boolean }[][] = []
    for (let w = 0; w < weekCount.value; w++) {
        const week: { date: Date, iso: string, inRange: boolean }[] = []
        for (let dow = 0; dow < 7; dow++) {
            const day = addDays(displayStart.value, w * 7 + dow)
            const iso = formatDate(day)
            const inRange = daysBetween(nominalStart.value, day) >= 0 && daysBetween(day, displayEnd.value) >= 0
            week.push({ date: day, iso, inRange })
        }
        weeks.push(week)
    }
    return weeks
})

// 扁平化 weekGrid
const flattenWeekGrid = computed(() => weekGrid.value.flat())

// lookupMap
const lookupMap = computed(() => {
    const m = new Map<string, number>()
    for (const it of contributions.value) {
        if (it?.date) m.set(it.date, Number(it.count) || 0)
    }
    return m
})

function lookup(iso: string) {
    return lookupMap.value.get(iso) ?? 0
}

// 最大值（用于颜色映射）
const globalMax = computed(() => {
    let m = 0
    for (const v of lookupMap.value.values()) if (v > m) m = v
    return m
})

function thresholdsFor(max: number) {
    const m = Math.max(max, 4)
    return [Math.ceil(m * 0.25), Math.ceil(m * 0.5), Math.ceil(m * 0.8)]
}

function mapToClass(count: number, levels: number[]) {
    if (count <= 0) return 'bg-slate-100 border border-slate-200'
    if (count <= levels[0]) return 'bg-emerald-200'
    if (count <= levels[1]) return 'bg-emerald-400 text-white'
    if (count <= levels[2]) return 'bg-emerald-600 text-white'
    return 'bg-emerald-800 text-white'
}

function cellClass(iso: string, inRange = true) {
    const count = lookup(iso)
    const cls = mapToClass(count, thresholdsFor(globalMax.value))
    return inRange ? cls : `${cls} opacity-30`
}
</script>
