<template>
  <UContainer class="py-10 max-w-2xl">
    <form class="flex gap-2" @submit.prevent="onSubmit">
      <UInput
        v-model="keyword"
        class="flex-1"
        size="lg"
        placeholder="输入你的问题"
        icon="i-lucide-search"
        :disabled="loading"
      />
      <UButton
        type="submit"
        size="lg"
        :loading="loading"
        :disabled="!keyword.trim()"
      >
        搜索
      </UButton>
    </form>

    <USwitch
      v-model="aiSearch"
      class="mt-4"
      label="启用 AI 回答"
      :disabled="loading"
    />
    <p class="mt-2 text-sm text-muted flex flex-wrap items-center gap-1">
    <UIcon name="i-lucide-info" class="size-4 shrink-0" />
    <template v-if="aiSearch">
      AI 会根据文档内容生成回答，可能存在偏差，请以原文为准。
    </template>
    <template v-else>
      以下内容均来自文档原文，未经过 AI 加工。
    </template>
    <a
      href="https://www.mdshowhub.com/"
      target="_blank"
      rel="noopener noreferrer"
      class="text-primary underline"
    >
      查看完整文档 ↗
    </a>
  </p>

    <UAlert
      v-if="error"
      class="mt-4"
      color="error"
      variant="subtle"
      title="请求失败"
      :description="error"
    />

    <!-- AI 模式 -->
    <UCard v-if="aiSearch && (answer || loading)" class="mt-4">
      <template #header>
        <span class="font-medium">AI 回答</span>
      </template>
      <p class="whitespace-pre-wrap leading-7">{{ answer || '思考中…' }}</p>
    </UCard>

    <!-- 普通检索模式 -->
    <template v-if="!aiSearch && results.length">
      <UCard v-for="(item, i) in results" :key="i" class="mt-4">
        <!-- <template #header>
          <div class="flex items-center justify-between gap-3">
            <div class="min-w-0">
              <p class="font-medium truncate">{{ item.heading }}</p>
            </div>
            <UBadge color="neutral" variant="subtle">相关度 {{ item.score }}%</UBadge>
          </div>
        </template> -->

        <MdPreview
          v-if="clean(item.text).length > 0"
          editor-id="preview"
          :model-value="clean(item.text)"
          :codeFoldable="false"
          :theme="colorMode.value === 'dark' ? 'dark' : 'light'"
        />

      </UCard>
    </template>
  </UContainer>
</template>
<script setup lang="ts">
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'
import { useKnowledgeApi } from '../../api/knowledge'
const knowledgeApi = useKnowledgeApi()
const colorMode = useColorMode() // Nuxt UI 自带

const loading = ref(false)
const aiSearch = ref(false)
const results = ref<any>([])     // 普通检索结果
const answer = ref<any>('')
const keyword = ref('')
const error = ref<any>('')


const onSubmit = async () => {
  const q = keyword.value.trim()
  if (!q || loading.value) return
  loading.value = true
  try {
    if (aiSearch.value) {
      await askAI()
    } else {
      await searchOnly()
    } 
  } catch (message) {
    error.value = message || '请求失败！'
  } finally {
    loading.value = false
  }
 
}

const searchOnly = async () => {
  const res:any = await knowledgeApi.searchPost({keyword: keyword.value})
  results.value = res.data
}

const askAI = async () => {
  const res:any = await knowledgeApi.searchPost({keyword: keyword.value, ai_search: true})
  const reader = res.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    // SSE 的消息以空行（\n\n）分隔
    const events = buffer.split('\n\n')
    buffer = events.pop() ?? ''   // 最后一段可能不完整，留到下次

    for (const event of events) {
      for (const line of event.split('\n')) {
        if (!line.startsWith('data:')) continue
        const payload = line.slice(5).trim()
        if (payload === '[DONE]') continue   // 如果后端有结束标记
        try {
          answer.value += JSON.parse(payload)   // 还原成真实文本，\n\n 变成换行
        } catch {
          answer.value += payload              // 不是 JSON 就原样拼
        }
      }
    }
  }
}

const clean = (s: string) =>
  s.replace(/<!--[\s\S]*?-->/g, '').replace(/\n{3,}/g, '\n\n').trim()
</script>