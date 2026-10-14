<template>
  <div>
    <UHeader
      :ui="{
      center: 'hidden md:flex',
      toggle: 'md:hidden',
    }"
    >
      <template #title>
        <UIcon name="i-glyphs-poly:cannabis" class="size-12" />
      </template>
      <UNavigationMenu :items="headerNav" />
      <template #body>
        <UNavigationMenu :items="headerNav" orientation="vertical" class="-mx-2.5" />
      </template>
      <template #right>
        <UColorModeButton />
        <UButton
          color="neutral"
          variant="ghost"
          to="https://github.com/yangyanyin"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
        />
      </template>
    </UHeader>
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const headerNav = computed<NavigationMenuItem[]>(() => {
  return [
    {
      label: '首页',
      to: '/'
    },
    {
      label: '知识库搜索',
      to: '/knowledge'
    },
    {
      label: '随手记',
      to: '/notes'
    },
    // {
    //   label: '关于我们',
    //   to: '/about'
    // }
  ]
})
</script>