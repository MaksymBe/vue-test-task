<template>
    <div class="user-wrapper">
        <div>
            <div class="user-avatar"/>
            <div class="user-name">{{ currentUser.name }}</div>
            <div class="user-login">{{ currentUser.login }}</div>
        </div>
        <a-textarea v-model="comment"/>
        <a-upload
                listType="picture-card"
                :fileList="images"
                @preview="handlePreview"
                @change="handleChange"
        >
            <div>
                <a-icon type="plus"/>
                <div class="ant-upload-text">Upload</div>
            </div>
        </a-upload>
        <a-button type="primary" @click="saveUser()">Save</a-button>
        <a-button type="secondary" @click="onBack()">Back to search</a-button>
    </div>
</template>

<script>
  import { SET_USER_INFO } from '../store/mutation.type';
  import { GET_USER } from '../store/action.type';

  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  export default {
    name: 'User',
    computed: {
      currentUser() {
        return this.$store.getters.user(this.login);
      },
    },
    props: {
      login: String,
    },
    data() {
      return {
        comment: '',
        images: [],
      };
    },
    beforeMount() {
      this.$store.dispatch(GET_USER, this.login);
    },
    methods: {
      async handlePreview(file) {
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj);
        }
      },
      handleChange({ fileList }) {
        this.images = fileList;
      },
      saveUser() {
        this.$store.commit(SET_USER_INFO,
          { ...this.currentUser, login: this.login, comment: this.comment, images: this.images, rewriteStorage: true });
      },
      onBack() {
        this.$router.push({ name: 'home' });
      }
    },
    watch: {
      currentUser: {
        immediate: true,
        handler(user) {
          console.log(user)
          this.images = user.images;
          this.comment = user.comment;
        },
      },
    },
  };
</script>

<style scoped lang="scss">

</style>
