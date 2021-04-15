/*
 * @Description:
 * @Anthor: Telliex
 * @Date: 2021-04-14 10:31:04
 * @LastEditors: Telliex
 * @LastEditTime: 2021-04-15 19:21:33
 */
/* eslint-disable */

declare module '*.vue' {
  import type { ComponentOptions } from 'vue'
  const component: ComponentOptions
  export default component
}

// lodash
declare module 'lodash'
