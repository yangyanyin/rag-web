<script setup lang="ts">
useHead({ title: 'RAG 知识库' })

// 入口卡片，路径和你顶部导航保持一致
const features = [
  {
    title: '知识库搜索',
    desc: '输入问题，检索文档原文，或开启 AI 基于文档生成回答。',
    icon: 'i-lucide-search',
    to: '/knowledge',
  },
  {
    title: '随手记',
    desc: '记录开发过程中的笔记和踩坑经验。',
    icon: 'i-lucide-notebook-pen',
    to: '/notes',
  },
]

// 技术栈，按你的实际项目调整
const stack = ['Nuxt', 'NestJS', 'Chroma Cloud', 'Qwen Embedding', '火山方舟', 'SSE 流式输出']
</script>

<template>
  <UContainer class="py-16 sm:py-24">
    <!-- 顶部介绍 -->
    <section class="text-center max-w-2xl mx-auto">
      <h1 class="text-3xl sm:text-5xl font-bold tracking-tight">
        让大模型<span class="text-primary">基于你的文档</span>回答问题
      </h1>
      <p class="mt-4 text-muted leading-7">
        一个 RAG 知识库问答案例：文档切块、向量检索、流式生成，检索结果可溯源。
      </p>
      <div class="mt-8 flex justify-center gap-3">
        <UButton to="/knowledge" size="lg" icon="i-lucide-search">开始搜索</UButton>
        <UButton to="/notes" size="lg" color="neutral" variant="outline">查看笔记</UButton>
      </div>
    </section>

    <!-- 功能入口 -->
    <section class="mt-16 grid gap-4 sm:grid-cols-2 max-w-3xl mx-auto">
      <NuxtLink v-for="f in features" :key="f.to" :to="f.to" class="block">
        <UCard class="h-full transition hover:ring-primary/50">
          <div class="flex items-start gap-3">
            <UIcon :name="f.icon" class="size-6 text-primary shrink-0 mt-0.5" />
            <div>
              <p class="font-medium">{{ f.title }}</p>
              <p class="mt-1 text-sm text-muted leading-6">{{ f.desc }}</p>
            </div>
          </div>
        </UCard>
      </NuxtLink>
    </section>

    <!-- 技术栈 -->
    <section class="mt-16 text-center">
      <p class="text-sm text-muted">技术栈</p>
      <div class="mt-3 flex flex-wrap justify-center gap-2">
        <UBadge v-for="s in stack" :key="s" color="neutral" variant="subtle">{{ s }}</UBadge>
      </div>
    </section>
  </UContainer>
</template>