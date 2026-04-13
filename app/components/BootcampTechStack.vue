<script setup lang="ts">
const tools = [
    { icon: 'i-simple-icons-python', label: 'Python', color: '#3776AB' },
    { icon: 'i-simple-icons-numpy', label: 'NumPy', color: '#013243' },
    { icon: 'i-simple-icons-pandas', label: 'Pandas', color: '#150458' },
    { icon: 'i-simple-icons-scikitlearn', label: 'Scikit-learn', color: '#F7931E' },
    { icon: 'i-simple-icons-pytorch', label: 'PyTorch', color: '#EE4C2C' },
    { icon: 'i-simple-icons-huggingface', label: 'Hugging Face', color: '#FFD21E' },
    { icon: 'i-simple-icons-fastapi', label: 'FastAPI', color: '#009688' },
    { icon: 'i-simple-icons-docker', label: 'Docker', color: '#2496ED' },
    { icon: 'i-simple-icons-jupyter', label: 'Jupyter', color: '#F37626' },
    { icon: 'i-simple-icons-git', label: 'Git', color: '#F05032' },
    { icon: 'i-simple-icons-githubactions', label: 'GitHub Actions', color: '#2088FF' },
    { icon: 'i-simple-icons-mlflow', label: 'MLflow', color: '#0194E2' },
]
</script>

<template>
    <UMarquee pause-on-hover class="py-2" :repeat="3">
        <div v-for="tool in tools" :key="tool.label" class="flex flex-col items-center gap-2 px-5">
            <UIcon :name="tool.icon" class="size-9 shrink-0 transition-transform duration-200 group-hover:scale-110"
                :style="{ color: tool.color }" />
            <span class="text-[11px] font-semibold text-text-secondary whitespace-nowrap">
                {{ tool.label }}
            </span>
        </div>
    </UMarquee>
</template>
