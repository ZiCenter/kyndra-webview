<template>
  <v-app>
    <v-main>
        <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { useQueryTheme } from '@/composables/useQueryTheme.ts'

const route = useRoute()
const applyTheme = useQueryTheme()

watch(() => route.query, applyTheme, { immediate: true })
</script>
