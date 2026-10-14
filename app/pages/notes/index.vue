<script setup lang="ts">
const notes = getNotes()
</script>

<template>
  <UContainer class="py-10 max-w-2xl">
    <h1 class="text-2xl font-semibold mb-6">笔记</h1>
    <ul class="space-y-3">
      <li v-for="n in notes" :key="n.slug">
        <NuxtLink
          :to="`/notes/${n.slug}`"
          class="block rounded-lg border border-default p-4 hover:bg-elevated"
        >
          <p class="font-medium">{{ n.title }}</p>
          <p class="text-xs text-muted mt-1">{{ n.slug }}.md</p>
        </NuxtLink>
      </li>
    </ul>
  </UContainer>
</template>