<template>
  <div
    class="my-scroll-container"
    :class="{ 'scroll-horizontal': $props.scrollDirection === 'horizontal' }"
    ref="scrollContainer"
    @scroll="handleScroll"
    style=""
  >
    <slot></slot>
  </div>
</template>

<script>
/**
 * Button for all use cases:
 * - small, big, wide, half
 * @author Marcel Finkbeiner marcel.finkbeiner@zoi.tech
 */
export default {
  name: 'my-scroll',
  emits: ['handle-scroll'],
  props: {
    scrollDirection: {
      type: String,
      required: false,
      default: 'vertical',
      validator: (value) => {
        return ['vertical', 'horizontal'].includes(value);
      },
    },
  },
  computed: {},
  data() {
    return {};
  },
  methods: {
    handleScroll(event) {
      const scrollContainer = this.$refs.scrollContainer;
      const maxVerticalScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
      const maxHorizontalScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;

      const vertical = { process: scrollContainer.scrollTop / maxVerticalScroll };
      const horizontal = { process: scrollContainer.scrollLeft / maxHorizontalScroll };

      this.$emit('handle-scroll', vertical, horizontal, event);
    },
  },
};
</script>

<style scoped lang="scss">
.my-scroll-container {
  overflow-y: auto;
  overflow-x: hidden;
  width: -webkit-fill-available;
  height: -webkit-fill-available;
  max-height: var(--safe-area-height);
  display: flex;
  &.scroll-horizontal {
    overflow-x: auto;
  }
}
/* width */
::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  background: black;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: orange;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: orange;
}
</style>
