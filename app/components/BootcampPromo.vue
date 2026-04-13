<script setup lang="ts">
interface Props {
    locale?: string
}
const props = withDefaults(defineProps<Props>(), { locale: 'en' })

const isKm = computed(() => props.locale === 'km')

const items = computed(() => isKm.value ? [
    { value: '22', unit: 'សប្តាហ៍', label: 'កម្មវិធីពេញលេញ', icon: 'i-lucide-calendar' },
    { value: '60+', unit: 'ម៉ោង', label: 'ការបង្រៀនផ្ទាល់', icon: 'i-lucide-monitor-play' },
    { value: '6', unit: 'Module', label: 'ផ្លូវវឹករឹង', icon: 'i-lucide-layers' },
    { value: '100%', unit: 'Hands-on', label: 'គម្រោងពិតប្រាកដ', icon: 'i-lucide-code-2' },
    { value: '∞', unit: '', label: 'ការប្រកួត Kaggle', icon: 'i-lucide-trophy' },
    { value: '1', unit: 'Certificate', label: 'សម្រាប់ Resume', icon: 'i-lucide-award' },
] : [
    { value: '22', unit: 'Weeks', label: 'Full Programme', icon: 'i-lucide-calendar' },
    { value: '60+', unit: 'Hours', label: 'Live Instruction', icon: 'i-lucide-monitor-play' },
    { value: '6', unit: 'Modules', label: 'Structured Path', icon: 'i-lucide-layers' },
    { value: '100%', unit: 'Hands-on', label: 'Real Projects', icon: 'i-lucide-code-2' },
    { value: '∞', unit: '', label: 'Kaggle Competitions', icon: 'i-lucide-trophy' },
    { value: '1', unit: 'Certificate', label: 'For your resume', icon: 'i-lucide-award' },
])
</script>

<template>
    <div class="not-prose my-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div
            v-for="item in items"
            :key="item.label"
            class="flex items-center gap-4 p-4 rounded-xl bg-bg-secondary border border-border hover:border-secondary/30 transition-colors"
        >
            <div class="shrink-0 w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                <UIcon :name="item.icon" class="size-6 text-secondary" />
            </div>
            <div class="min-w-0">
                <p class="text-xl font-extrabold text-secondary leading-none">
                    {{ item.value }}<span v-if="item.unit" class="text-sm font-semibold text-text ml-1">{{ item.unit }}</span>
                </p>
                <p class="text-sm text-text-secondary mt-1 leading-tight truncate">{{ item.label }}</p>
            </div>
        </div>
    </div>
</template>
