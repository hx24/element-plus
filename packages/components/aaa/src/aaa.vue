<template>
  <div :class="ns.b()">
    <h1 :class="ns.e('title')">
      <span :class="{ [ns.m('blue')]: color === 'blue' }">aaa</span>
    </h1>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useNamespace } from '@element-plus/hooks'
import { aaaEmits, aaaProps } from './aaa'

defineOptions({
  name: 'ElAaa',
})

const props = defineProps(aaaProps)
const emits = defineEmits(aaaEmits)

const ns = useNamespace('aaa') // 创建类名

onMounted(() => {
  console.log('mounted')
})

// init here
</script>
