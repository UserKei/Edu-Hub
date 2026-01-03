import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';

// A simple mock component
const DemoComponent = {
  template: '<div>Hello Vitest</div>'
};

describe('Frontend Demo Test', () => {
  it('should render the component', () => {
    const wrapper = mount(DemoComponent);
    expect(wrapper.text()).toContain('Hello Vitest');
  });
});
