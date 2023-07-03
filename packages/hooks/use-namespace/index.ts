import { computed, inject, ref, unref } from 'vue'

import type { InjectionKey, Ref } from 'vue'

export const defaultNamespace = 'el'
const statePrefix = 'is-'

const _bem = (
  namespace: string,
  block: string,
  blockSuffix: string,
  element: string,
  modifier: string
) => {
  let cls = `${namespace}-${block}`
  if (blockSuffix) {
    cls += `-${blockSuffix}`
  }
  if (element) {
    cls += `__${element}`
  }
  if (modifier) {
    cls += `--${modifier}`
  }
  return cls
}

export const namespaceContextKey: InjectionKey<Ref<string | undefined>> =
  Symbol('namespaceContextKey')

export const useGetDerivedNamespace = (
  namespaceOverrides?: Ref<string | undefined>
) => {
  const derivedNamespace =
    namespaceOverrides || inject(namespaceContextKey, ref(defaultNamespace))
  const namespace = computed(() => {
    return unref(derivedNamespace) || defaultNamespace
  })
  return namespace
}

export const useNamespace = (
  block: string,
  namespaceOverrides?: Ref<string | undefined>
) => {
  const namespace = useGetDerivedNamespace(namespaceOverrides)
  const b = (blockSuffix = '') =>
    _bem(namespace.value, block, blockSuffix, '', '')
  const e = (element?: string) =>
    element ? _bem(namespace.value, block, '', element, '') : ''
  const m = (modifier?: string) =>
    modifier ? _bem(namespace.value, block, '', '', modifier) : ''
  const be = (blockSuffix?: string, element?: string) =>
    blockSuffix && element
      ? _bem(namespace.value, block, blockSuffix, element, '')
      : ''
  const em = (element?: string, modifier?: string) =>
    element && modifier
      ? _bem(namespace.value, block, '', element, modifier)
      : ''
  const bm = (blockSuffix?: string, modifier?: string) =>
    blockSuffix && modifier
      ? _bem(namespace.value, block, blockSuffix, '', modifier)
      : ''
  const bem = (blockSuffix?: string, element?: string, modifier?: string) =>
    blockSuffix && element && modifier
      ? _bem(namespace.value, block, blockSuffix, element, modifier)
      : ''
  const is: {
    (name: string, state: boolean | undefined): string
    (name: string): string
  } = (name: string, ...args: [boolean | undefined] | []) => {
    const state = args.length >= 1 ? args[0]! : true
    return name && state ? `${statePrefix}${name}` : ''
  }

  // for css var
  // --el-xxx: value;
  const cssVar = (object: Record<string, string>) => {
    const styles: Record<string, string> = {}
    for (const key in object) {
      if (object[key]) {
        styles[`--${namespace.value}-${key}`] = object[key]
      }
    }
    return styles
  }
  // with block
  const cssVarBlock = (object: Record<string, string>) => {
    const styles: Record<string, string> = {}
    for (const key in object) {
      if (object[key]) {
        styles[`--${namespace.value}-${block}-${key}`] = object[key]
      }
    }
    return styles
  }

  const cssVarName = (name: string) => `--${namespace.value}-${name}`
  const cssVarBlockName = (name: string) =>
    `--${namespace.value}-${block}-${name}`

  return {
    namespace, // 如 'button'
    b, // b() 为 'el-button'
    e, // e('icon') 为 'el-button__icon'
    m, // m('primary') 为 'el-button--primary'
    be, // be('primary', 'icon') 为 'el-button-primary__icon'
    em, // em('icon', 'primary') 为 'el-button__icon-primary'
    bm, // bm('primary', 'icon') 为 'el-button-primary--icon'
    bem, // bem('primary', 'icon', 'active') 为 'el-button-primary__icon--active'
    is, // is('loading', true) 为 'is-loading'
    // css
    cssVar, // cssVar({ color: 'red' }) 为 { '--el-color': 'red' }
    cssVarName, // cssVarName('color') 为 '--el-color'
    cssVarBlock, // cssVarBlock({ color: 'red' }) 为 { '--el-button-color': 'red' }
    cssVarBlockName, // cssVarBlockName('color') 为 '--el-button-color'
  }
}

export type UseNamespaceReturn = ReturnType<typeof useNamespace>
