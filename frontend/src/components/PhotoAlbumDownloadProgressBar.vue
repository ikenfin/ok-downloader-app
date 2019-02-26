<template>
  <div class="progress-container">
    <div class="progress" :style="{ width: width }"></div>
    <span class="progress-counter" :style="{ color: progressValue < 50 ? '#000' : '#fff'}">{{ parseInt(progressValue) }}%</span>
  </div>
</template>

<script>
export default {
  props: {
    progress: {
      default: () => 0
    },
    total: {
      default: () => 0
    }
  },
  computed: {
    progressValue () {
      return ((this.progress / this.total) * 100) || 0
    },
    width () {
      return `${parseInt(this.progressValue)}%`
    }
  }
}
</script>

<style lang="scss">
.progress-container {
  height: 30px;
  background-color: #fff;
  border: 1px solid rgba(#F7931E, .5);
  border-radius: 20px;
  overflow: hidden;
  text-align: center;
  position: relative;
}
.progress-counter {
  position: absolute;
  top: 50%;
  left: 50%;
  color: #fff;
  font-size: 16px;
  margin-top: -10px;
  margin-left: -10px;
}
.progress {
  /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#f7931e+0,f4c997+16,f4b46b+74,f7931e+100 */
  background: #f7931e; /* Old browsers */
  background: -moz-linear-gradient(left, #f7931e 0%, #f4c997 16%, #f4b46b 74%, #f7931e 100%); /* FF3.6-15 */
  background: -webkit-linear-gradient(left, #f7931e 0%,#f4c997 16%,#f4b46b 74%,#f7931e 100%); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(to right, #f7931e 0%,#f4c997 16%,#f4b46b 74%,#f7931e 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f7931e', endColorstr='#f7931e',GradientType=1 ); /* IE6-9 */
  box-shadow: 0 0 10px 3px rgba(#F7931E, 0.52);
  height: 100%;
  border-radius: 0;
  width: 0;
}
</style>
