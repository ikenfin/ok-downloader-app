<template>
  <div class="b-okdapp" v-if="!authenticateInProgress || authenticated">
    <div v-if="downloadInProgress">
      <photo-album-download-progress-bar :progress="downloadProgress" :total="100">
      </photo-album-download-progress-bar>
    </div>
    <div v-else>
      <div class="b-okdapp__download_panel" v-if="downloadComplete && downloadUrl">
        <h3>Скачивание и архивация фотографий завершена</h3>
        <p>
          Теперь вы можете скачать архив со своими фотографиями по ссылке:
          <a class="b-okdapp__link" :href="downloadUrl" target="_blank">скачать</a>
        </p>
      </div>
      <div>
        <div class="b-okdapp__top_panel">
          <h3 class="b-okdapp__title">Доступные фотоальбомы</h3>
          <button class="b-okdapp__logout" @click.prevent="logout()">Выйти</button>
        </div>
        <hr>
        <div class="b-okdapp__btn_panel">
          <button class="b-okdapp__download" @click.prevent="downloadAll()">
            Скачать все
            <span v-if="downloadCost > 0" class="b-okdapp__download_cost">({{ downloadCost }} ОК)</span>
            <span v-if="totalPhotosCount > 0" class="b-okdapp__download_count">({{ totalPhotosCount }} фото)</span>
          </button>
        </div>

        <div class="b-photo-albums">
          <photo-album
            v-for="(album, idx) in albums"
            :key="idx"
            :album="album"
            @download="downloadAlbum($event)">
          </photo-album>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="authenticateInProgress" class="b-okdapp b-okdapp--loading">
    <div class="b-okdapp__loading_container">
      <p>Odnoklassniki photo downloader</p>
      <p class="b-okdapp__loading_text">auth...</p>
      <img src="../assets/loading.gif" class="b-okdapp__spinner">
    </div>
  </div>
  <div v-else>
    <p>Не удалось авторизоваться через "Одноклассники", попробуйте снова</p>
    <a href="/auth" class="btn-auth">
      Войти с помощью
      <img src="/images/ok.png" />
    </a>
  </div>
</template>

<script>
import PhotoAlbum from './PhotoAlbum'
import PhotoAlbumDownloadProgressBar from './PhotoAlbumDownloadProgressBar'
import { mapVuexModels } from 'vuex-models'
import { mapGetters } from 'vuex'

export default {
  components: {
    PhotoAlbum,
    PhotoAlbumDownloadProgressBar
  },
  computed: {
    ...mapVuexModels(['albums']),
    ...mapGetters([
      'totalPhotosCount',
      'authenticateInProgress',
      'authenticated',
      'downloadProgress',
      'downloadInProgress',
      'downloadComplete',
      'downloadUrl'
    ]),
    downloadCost () {
      return 0 // Math.ceil(this.totalPhotosCount / 2)
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('logout')
    },
    async downloadAll () {
      const req = {
        albums: this.albums
      }

      await this.$store.dispatch('download', req)
    },
    async downloadAlbum (albums) {
      const req = {
        albums: [albums]
      }

      await this.$store.dispatch('download', req)
    }
  },
  async created () {
    if (!localStorage.getItem('okd-token')) {
      location = '/auth'
    }
    this.$store.dispatch('authenticate', localStorage.getItem('okd-token'))
    const response = await this.$http.get('/api/albums')
    const json = response.data

    if (json.albums) {
      this.albums = json.albums
    }
  },
  watch: {
    authenticated (newV) {
      // user logout
      if (newV === null) {
        localStorage.clear()
        location = '/'
      }
    }
  }
}
</script>

<style lang="scss">
$ok-clr: #F7931E;
$logout-clr: #cc2424;
$gray-clr: #A1A1A1;

hr {
  border: none;
  border-bottom: 2px solid $ok-clr;
  // margin: 1em 0 4em
}

h3 {
  font-size: 20px;
}

.b-okdapp {
  &__link {
    color: $ok-clr;
    font-weight: bold;
  }

  &__title {
    font-weight: normal;
  }

  &__btn_panel {
    width: 100%;
    text-align: center;
    margin: 2em 0;
  }

  &__top_panel {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: center;
  }

  &__download_panel {
    max-width: 100%;
    text-align: center;
    margin: 2em 0;
    border: 2px solid $ok-clr;
    padding: 1em;
    border-radius: 6px;
  }

  &--loading {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    text-align: center;
    letter-spacing: 1px;
  }
  &__spinner {
    display: block;
    max-width: 80px;
    margin: 20px auto;
  }
  &__loading_text {
    font-size: 1.1em;
    text-transform: uppercase;
    letter-spacing: 1.2em;
    margin: 40px auto;
  }
  &__loading_container {
    margin: auto;
  }
}

.b-photo-albums {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.b-okdapp__logout {
  border: 2px solid $logout-clr;
  border-radius: 10px;
  padding: 10px 20px;
  font-size: .9em;
  text-align: center;
  transition: background-color .3s ease,
              color .3s ease;
  color: #fff;
  background: $logout-clr;
  font-weight: lighter;
  text-transform: uppercase;
  letter-spacing: 1px;

  &:hover {
    background-color: lighten($logout-clr, 10%);
  }
}

.b-okdapp__download {
  border: 2px solid $ok-clr;
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 1.1em;
  text-align: center;
  transition: background-color .3s ease,
              color .3s ease;
  text-transform: uppercase;
  font-weight: normal;
  $ctx: #{&};

  &:hover {
    background-color: $ok-clr;
    color: #fff;

    #{$ctx}_cost {
      color: #fff;
    }
    #{$ctx}_count {
      color: #fff;
    }
  }

  &_cost {
    color: $ok-clr;
    font-weight: bold;
    transition: color .3s ease;
  }
  &_count {
    display: block;
    margin-top: 6px;
    font-size: .7em;
    font-weight: 300;
    color: $gray-clr;
    transition: color .3s ease;
  }
}
</style>
