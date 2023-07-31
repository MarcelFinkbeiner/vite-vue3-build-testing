<!-- vue tempate -->
<template>
  <div class="my-footer-container" v-bind="$attrs" @click="clicking">
    <div class="container left">
      <slot>
        <slot name="left">
          <my-button
            :icon="$props.backIcon"
            @click="
              $props.back
                ? $props.back()
                : $props.backPath
                ? $router.push($props.backPath)
                : $router.go(-1)
            "
          />
        </slot>
      </slot>
    </div>
    <div class="container title">
      <slot name="title">
        {{ $props.title }}
      </slot>
    </div>
    <div class="container right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'my-footer',
  components: {},
  emits: ['click'],
  props: {
    title: {
      type: String,
      required: false,
      default: '',
    },
    backIcon: {
      type: String,
      required: false,
      default: 'back',
    },
    backPath: {
      type: String,
      required: false,
    },
    back: {
      type: Function,
      required: false,
    },
    hideBack: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      debug: false,
    };
  },
  methods: {
    clicking() {
      this.$emit('click');
    },
  },
  created() {},
};
</script>
<style scoped lang="scss">
.my-footer-container {
  left: 0px;
  right: 0px;
  top: 0px;
  text-align: center;
  font-size: 26px;
  position: fixed;
  color: white;
  height: 110px;
  border-top: 1px solid;
  border-image-slice: 1;

  border-image-source: linear-gradient(to right, transparent, white, transparent);
  padding-left: 50px;
  padding-right: 50px;
  display: flex;
  align-items: center;
  background: white;
  z-index: 100;

  & div.container {
    display: flex;
    flex: 1;
    gap: 10px;
    &.right {
      justify-content: flex-end;
    }
    &.title {
      flex: 2;
      justify-content: center;
    }
  }
}
</style>
