<template>
    <div class="user-wrapper">
        <div class="user-left-panel">
            <a-avatar slot="avatar" :src="currentUser.avatar_url" size="large" shape="square"/>
            <div class="user-name">{{ currentUser.name }}</div>
            <div class="user-login">{{ currentUser.login }}</div>
        </div>
        <div class="user-content">
            <div class="user-info">
                <div class="user-blog">{{ currentUser.blog }}</div>
                <div class="user-company">{{ currentUser.company }}</div>
                <div class="user-location">{{ currentUser.location }}</div>
                <div class="user-email">{{ currentUser.email }}</div>
                <div class="user-bio">{{ currentUser.bio }}</div>
                <div class="user-public-repos">Number of public repositories: {{ currentUser.public_repos }}</div>
            </div>
            <a-textarea v-model="comment" class="user-comment"/>
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

            <div class="user-buttons">
                <a-button type="primary" @click="saveUser()">Save</a-button>
                <a-button type="secondary" @click="onBack()">Back to search</a-button>
            </div>
        </div>
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
        this.$store.commit(SET_USER_INFO, {
          ...this.currentUser,
          login: this.login,
          comment: this.comment,
          images: this.images,
          rewriteStorage: true
        });
        this.$message.success('Saved!')
      },
      onBack() {
        this.$router.push({ name: 'home' });
      }
    },
    watch: {
      currentUser: {
        immediate: true,
        handler(user) {
          this.images = user.images;
          this.comment = user.comment;
        },
      },
    },
  };
</script>

<style scoped lang="scss">
    .user-wrapper {
        display: flex;
        .user-left-panel {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;

            .ant-avatar-lg {
                width: 10rem;
                height: 10rem;
            }

            .user-name {
                margin-top: 1rem;
                font-size: 1.5rem;
                color: black;
            }
            .user-login {
                font-size: 1.25rem;
                color: gray;
            }
        }

        .user-content {
            flex: 3;

            .user-info {
                margin-bottom: 1rem;
            }

            .user-comment {
                margin-bottom: 2rem;
            }

            .user-buttons {
                button:first-child {
                    margin-right: 1rem;
                }
            }
        }
    }
</style>
