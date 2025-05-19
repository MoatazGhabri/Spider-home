import { h, defineComponent } from 'vue'

export const SidebarOpen = defineComponent({
  name: 'SidebarOpen',
  props: {
    size: {
      type: [Number, String],
      default: 24
    },
    strokeWidth: {
      type: [Number, String],
      default: 2
    }
  },
  setup(props) {
    return () => h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      width: props.size,
      height: props.size,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: props.strokeWidth,
      strokeLinecap: 'round',
      strokeLinejoin: 'round'
    }, [
      h('rect', { x: '3', y: '3', width: '18', height: '18', rx: '2', ry: '2' }),
      h('line', { x1: '9', y1: '3', x2: '9', y2: '21' }),
      h('path', { d: 'M13 16l4-4-4-4' })
    ])
  }
})

export const SidebarClose = defineComponent({
  name: 'SidebarClose',
  props: {
    size: {
      type: [Number, String],
      default: 24
    },
    strokeWidth: {
      type: [Number, String],
      default: 2
    }
  },
  setup(props) {
    return () => h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      width: props.size,
      height: props.size,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: props.strokeWidth,
      strokeLinecap: 'round',
      strokeLinejoin: 'round'
    }, [
      h('rect', { x: '3', y: '3', width: '18', height: '18', rx: '2', ry: '2' }),
      h('line', { x1: '9', y1: '3', x2: '9', y2: '21' }),
      h('path', { d: 'M15 16l-4-4 4-4' })
    ])
  }
})

export const Channels = defineComponent({
  name: 'Channels',
  props: {
    size: {
      type: [Number, String],
      default: 24
    },
    strokeWidth: {
      type: [Number, String],
      default: 2
    }
  },
  setup(props) {
    return () => h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      width: props.size,
      height: props.size,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: props.strokeWidth,
      strokeLinecap: 'round',
      strokeLinejoin: 'round'
    }, [
      h('circle', { cx: '12', cy: '12', r: '8' }),
      h('line', { x1: '12', y1: '2', x2: '12', y2: '4' }),
      h('line', { x1: '12', y1: '20', x2: '12', y2: '22' }),
      h('line', { x1: '2', y1: '12', x2: '4', y2: '12' }),
      h('line', { x1: '20', y1: '12', x2: '22', y2: '12' }),
      h('line', { x1: '4.93', y1: '4.93', x2: '6.34', y2: '6.34' }),
      h('line', { x1: '17.66', y1: '17.66', x2: '19.07', y2: '19.07' }),
      h('line', { x1: '19.07', y1: '4.93', x2: '17.66', y2: '6.34' }),
      h('line', { x1: '6.34', y1: '17.66', x2: '4.93', y2: '19.07' })
    ])
  }
})

export const HomeIcon = defineComponent({
  name: 'HomeIcon',
  props: {
    size: {
      type: [Number, String],
      default: 24
    },
    strokeWidth: {
      type: [Number, String],
      default: 2
    }
  },
  setup(props) {
    return () => h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      width: props.size,
      height: props.size,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: props.strokeWidth,
      strokeLinecap: 'round',
      strokeLinejoin: 'round'
    }, [
      h('path', { d: 'M5 12.55a11 11 0 0 1 14.08 0' }),
      h('path', { d: 'M1.42 9a16 16 0 0 1 21.16 0' }),
      h('path', { d: 'M8.53 16.11a6 6 0 0 1 6.95 0' }),
      h('line', { x1: '12', y1: '20', x2: '12.01', y2: '20' })
    ])
  }
})

export const RollerShutter = defineComponent({
  name: 'RollerShutter',
  props: {
    size: {
      type: [Number, String],
      default: 24
    },
    strokeWidth: {
      type: [Number, String],
      default: 2
    }
  },
  setup(props) {
    return () => h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      width: props.size,
      height: props.size,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: props.strokeWidth,
      strokeLinecap: 'round',
      strokeLinejoin: 'round'
    }, [
      h('rect', { x: '3', y: '3', width: '18', height: '18', rx: '2' }),
      h('line', { x1: '3', y1: '9', x2: '21', y2: '9' }),
      h('line', { x1: '3', y1: '15', x2: '21', y2: '15' }),
      h('path', { d: 'M4 3h16a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z' })
    ])
  }
})

export const Smile = defineComponent({
  name: 'Smile',
  props: {
    size: {
      type: [Number, String],
      default: 24
    },
    strokeWidth: {
      type: [Number, String],
      default: 2
    }
  },
  setup(props) {
    return () => h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      width: props.size,
      height: props.size,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: props.strokeWidth,
      strokeLinecap: 'round',
      strokeLinejoin: 'round'
    }, [
      h('circle', { cx: '12', cy: '12', r: '10' }),
      h('path', { d: 'M8 14s1.5 2 4 2 4-2 4-2' }),
      h('line', { x1: '9', y1: '9', x2: '9.01', y2: '9' }),
      h('line', { x1: '15', y1: '9', x2: '15.01', y2: '9' })
    ])
  }
})
