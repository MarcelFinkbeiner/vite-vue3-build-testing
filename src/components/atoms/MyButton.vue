<template>
  <div class="my-button-container">
    <button class="my-button" @click="clicking($event)" v-bind="$attrs">
      <slot>
        <img :class="`my-button-icon icon ${icon}`" />
      </slot>
    </button>
  </div>
</template>

<script>
export default {
  name: 'my-button',
  emits: ['click'],
  props: {
    icon: {
      type: String,
      required: false,
      default: 'water',
    },
  },
  computed: {},
  data() {
    return {};
  },
  methods: {
    clicking(event) {
      event.stopPropagation();
      if (this.$props.disabled) return;
      this.$emit('click');
    },
  },
};
</script>

<style scoped lang="scss">
.my-button-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: min-content;
  position: relative;
  .my-button {
    width: 165px;
    height: 165px;
    position: relative;
    background: white;
    border: 1px solid black;
    color: orange;
    font-size: 18px;
    padding: 35px;
    cursor: pointer;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: height 0.2s linear;
    transition: width 0.2s linear;
    &:focus,
    &:hover {
      border: 1px solid orange;
      outline: unset;
    }
    min-width: 60px;
    text-align: center;
    width: 75px;
    height: 75px;
    padding: 10px;
  }
  .my-button-icon {
    width: 100%;
    height: 100%;
    background: orange;
  }
}
</style>
