import { buildProps } from '@element-plus/utils'

import type { ExtractPropTypes } from 'vue'
import type Aaa from './aaa.vue'

export const aaaProps = buildProps({
  /**
   * @description 是否显示
   */
  show: Boolean,
  /**
   * @description 文本颜色
   */
  color: {
    type: String,
    default: 'red',
    values: ['red', 'blue'], // 可选项
    required: false,
    validator: (val: unknown): val is string => typeof val === 'string',
  },
})

export const aaaEmits = {
  close: (evt: MouseEvent) => evt instanceof MouseEvent,
}
export type AaaEmits = typeof aaaEmits

/** ExtractPropTypes 用来提取vue中声明式prop的某些参数类型，这里即提取所有参数类型 */
export type AaaProps = ExtractPropTypes<typeof aaaProps>
export type AaaInstance = InstanceType<typeof Aaa>
