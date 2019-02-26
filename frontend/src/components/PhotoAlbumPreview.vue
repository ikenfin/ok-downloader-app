<template>
  <div :class="cssClass">
    <div v-for="(preview, idx) in previews" :key="idx" :style="{ backgroundImage: url(`${preview}`)}"></div>
  </div>
</template>

<script>
export default {
  props: {
    previews: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    cssClass () {
      return [
        'b-photo-album-previews',
        `b-photo-album-previews--template-${this.previews.length}`
      ]
    }
  },
  methods: {
  }
}
</script>

<style>

</style>
