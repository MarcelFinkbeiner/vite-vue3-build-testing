<template>
  <div id="nested-videos" class="page">
    <main v-if="!selectedAnimation">
      <my-scroll class="nested-videos-scroll">
        <div
          v-for="animationName in animations"
          :key="animationName.folder"
          class="item"
          @click="
            () => {
              console.log(animationName);
              selectedAnimation = animationName;
            }
          "
        >
          <div class="animation">
            <img :src="animationName.thumbnail" />
          </div>
          <div class="animation-name">
            <span>{{ $t('maintainAnimations.' + animationName.translation) }}</span>
          </div>
        </div>
      </my-scroll>
    </main>
    <main v-else style="width: 100%; backgroud-color: transparent">
      <b-carousel
        id="main-carousel"
        v-model="slide"
        :interval="0"
        controls
        indicators
        img-width="670"
        img-height="390"
        style="text-shadow: 1px 1px 2px #333"
      >
        <b-carousel-slide
          img-blank
          v-for="(vid, index) in videos[selectedAnimation.folder]"
          :key="index"
          style="background: transparent"
        >
          <div class="fullscreen-animation">
            <video autoplay loop muted inline>
              <source :src="vid" type="video/mp4" />
            </video>
          </div>
        </b-carousel-slide>
      </b-carousel>
    </main>
    <my-footer>
      <my-button v-if="selectedAnimation" icon="back" @click="goingBack()" />
      <my-button v-else icon="back" @click="$router.push('/home')" />
      <template #title>
        {{
          selectedAnimation
            ? $t('nestedVideos.' + selectedAnimation.translation)
            : $t('common.nestedVideos')
        }}
      </template>
    </my-footer>
  </div>
</template>

<script>
import { MyScroll } from '@/components/atoms';

export default {
  name: 'nested-videos',
  components: {
    MyScroll,
  },
  data() {
    return {
      slide: 0,
      animations: {},
      videos: {},
      selectedAnimation: null,
    };
  },
  watch: {},
  async mounted() {
    const animationsPaths = await import.meta.glob('../assets/videos/mp4/**/*.png');
    console.log(animationsPaths);

    this.animations = Object.keys(animationsPaths)
      .map((e) => e.replace('../assets/videos/mp4/', './'))
      .map((e) => {
        const img = {
          folder: e.split('/')[1],
          thumbnail: new URL(e.replace('./', '../assets/videos/mp4/'), import.meta.url).href,
          translation: e.split('/')[1].split('_')[1],
          number: e.split('/')[1].split('_')[0],
        };
        return img;
      })
      .sort((a, b) => a.number - b.number);

    const videoPaths = await import.meta.glob('../assets/videos/mp4/**/*.mp4');
    this.videos = Object.keys(videoPaths).reduce((p, c) => {
      const [key, value] = c.replace('../assets/videos/mp4/', '').split('/');
      if (!p[key]) p[key] = [];
      p[key].push(new URL(['../assets/videos/mp4', key, value].join('/'), import.meta.url).href);
      console.log(p);
      return p;
    }, {});
  },
  methods: {
    goingBack() {
      this.selectedAnimation = null;
      this.slide = 0;
    },
  },
};
</script>

<style lang="scss" scoped>
.page {
  flex-direction: column;
  .nested-videos-scroll {
    flex-direction: column;
    padding: 20px;
    .item {
      display: inline-flex;
      cursor: pointer;
      width: 1000px;
      height: 200px;
      background: white;
      margin-bottom: 15px;
      border: 1px solid black;
      border-radius: 5px;
      .animation {
        img {
          height: 100%;
          border-top-left-radius: 5px;
          border-bottom-left-radius: 5px;
        }
      }
      .animation-name {
        font-size: 28px;
        font-weight: bold;
        width: 100%;
        text-align: center;
        margin-top: auto;
        margin-bottom: auto;
        padding: 20px;
        span {
          color: orange;
        }
      }
    }
  }
  .fullscreen-animation {
    background: white;
    // border: 1px solid var(--c-grey);
    border-radius: 5px;
    padding: 10px;
    padding-bottom: 30px;
    width: fit-content;
    margin-left: auto;
    margin-right: auto;
    video {
      height: 470px;
      border: 1px black;
      border-radius: 5px;
    }
  }
  :deep(#main-carousel) {
    .carousel-control-prev,
    .carousel-control-next {
      bottom: 150px;
      min-height: var(--safe-area-height);
    }
    .carousel-inner {
      > div {
        min-height: var(--safe-area-height);
      }
    }
    .carousel-indicators {
      button {
        transition: background-color 0.2s ease !important;
        background-color: black;
        opacity: 1;
        &.active {
          background-color: orange;
        }
      }
    }
  }
}
</style>
