import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../../App.vue'
import { createTestingPinia } from '@pinia/testing'

// Mock vue-router
vi.mock('vue-router', () => ({
  RouterView: { template: '<div>RouterView</div>' }
}))

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    locale: { value: 'en' }
  })
}))

// Mock vue-sonner
vi.mock('vue-sonner', () => ({
  Toaster: { template: '<div>Toaster</div>' }
}))

describe('App.vue', () => {
  it('renders properly', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              app: {
                theme: 'light',
                locale: 'en'
              }
            }
          })
        ]
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('RouterView')
    expect(wrapper.text()).toContain('Toaster')
  })
})
