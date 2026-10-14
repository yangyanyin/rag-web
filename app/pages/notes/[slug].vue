<script setup lang="ts">
  import { MdPreview } from 'md-editor-v3'
  import 'md-editor-v3/lib/preview.css'
  const route = useRoute()
  const colorMode = useColorMode() // Nuxt UI 自带
  const note = getNotes().find((n) => n.slug === route.params.slug)
  if (!note) {
    throw createError({ statusCode: 404, statusMessage: '笔记不存在', fatal: true })
  }
  useHead({ title: note.title })
</script>

<template>
  <UContainer class="py-10 max-w-3xl">
    <NuxtLink to="/notes" class="text-sm text-muted">← 返回笔记列表</NuxtLink>
    <article class="mt-4">
      <MdPreview
        editor-id="notes-preview"
        :model-value="note.content"
        :codeFoldable="false"
        :theme="['system', 'dark'].includes(colorMode.value) ? 'dark' : 'light' "
      />
    </article>
  </UContainer>
</template>
<style scoped>
:deep(.md-editor-previewOnly) {
  background: none !important;
}
</style>