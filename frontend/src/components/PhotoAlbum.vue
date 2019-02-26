<template>
  <div class="b-photo-album">
    <header class="b-photo-album__header">
      <h4 class="b-photo-album__title">{{ album.title }}</h4>
      <span v-if="album.photos_count" class="b-photo-album__count">({{ album.photos_count }} фото)</span>
    </header>

    <!-- <photo-album-preview :previews="album.previews"></photo-album-preview> -->
    <div class="b-photo-album__cover">
      <img v-if="albumCover" :src="albumCover" class="b-photo-album__cover_img">
    </div>

    <div class="b-photo-album__download">
      <button class="b-photo-album__download_btn" @click="download(album)">
        Скачать альбом <span v-if="downloadCost > 0" class="b-photo-album__download_cost">({{ downloadCost }} OK)</span>
      </button>
    </div>
  </div>
</template>

<script>
import PhotoAlbumPreview from './PhotoAlbumPreview'

export default {
  components: {
    PhotoAlbumPreview
  },
  props: {
    album: {
      type: Object
    }
  },
  methods: {
    download (aid) {
      this.$emit('download', aid)
    }
  },
  computed: {
    albumCover () {
      if (this.album.main_photo && this.album.main_photo.pic320min) {
        return this.album.main_photo.pic320min
      } else {
        return null
      }
    },
    downloadCost () {
      return 0 // return Math.ceil(this.album.photos_count / 2)
    }
  }
}
</script>

<style lang="scss">
$ok-clr: #F7931E;
$gray-clr: #A1A1A1;

.b-photo-album {
  display: flex;
  flex-direction: column;
  border: 2px solid $ok-clr;
  border-radius: 10px;
  // max-width: 30%;
  overflow: hidden;
  margin: 10px;
  flex-basis: 240px;

  &__header {
    border-bottom: 2px solid $ok-clr;
    text-align: center;
    padding: 10px 5px;
    font-size: 1.1em;
  }

  &__title {
    margin: 0;
    font-weight: normal;
  }

  &__count {
    display: block;
    margin-top: 6px;
    font-size: .7em;
    font-weight: 300;
    color: $gray-clr;
  }

  &__cover {
    display: flex;
    align-items: center;
    height: 100%;

    &_img {
      display: block;
      max-width: 100%;
      height: auto;
      // justify-self: center;
    }
  }

  &__download {
    border-top: 2px solid $ok-clr;
    margin-top: auto;

    $ctx: #{&};

    &_btn {
      display: block;
      width: 100%;
      border: none;
      outline: none;
      padding: 10px 5px;
      font-size: .8em;
      transition: background-color .3s ease,
                  color .3s ease;

      &:hover {
        color: #fff;
        background-color: $ok-clr;

        #{$ctx}_cost {
          color: #fff;
        }
      }
    }
    &_cost {
      color: $ok-clr;
      font-weight: bold;
      transition: color .3s ease;
    }
  }
}
</style>
