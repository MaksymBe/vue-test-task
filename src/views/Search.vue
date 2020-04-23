<template>
  <div class="search-wrapper">
    <a-auto-complete
            class="search"
            size="large"
            placeholder="input here"
            @select="onSelect"
            @search="handleChange"
    >
      <template slot="dataSource">
        <a-select-option v-for="u in users" :key="u.login" >
          {{ u.login }}
        </a-select-option>
      </template>
      <a-input>
        <a-button
                slot="suffix"
                style="margin-right: -12px"
                class="search-btn"
                size="large"
                type="primary"
        >
          <a-icon type="search" />
        </a-button>
      </a-input>
    </a-auto-complete>
    <a-list :dataSource="users" :loading="loading">
      <a-list-item slot="renderItem" slot-scope="user" @click="onUserClick(user.login)">
        <a-list-item-meta :title="user.login">
          <a-avatar slot="avatar" :src="user.avatar_url"/>
        </a-list-item-meta>
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
  import { GET_USERS, SEARCH_USERS } from '../store/action.type';
  import { SET_USERS } from '../store/mutation.type';

export default {
  name: 'Search',
  computed: {
    users() {
      return this.$store.getters.users;
    },
  },
  data() {
    return {
      loading: false,
      debounceTimeoutId: null,
    };
  },
  mounted() {
    if (!this.users.length) {
      this.loading = true;
      this.$store.dispatch(GET_USERS).finally(() => this.loading = false);
    }
  },
  methods: {
    handleChange(value) {
      clearTimeout(this.debounceTimeoutId);

      if (!value) return;

      this.debounceTimeoutId = setTimeout(() => {
        this.loading = true;
        this.$store.dispatch(SEARCH_USERS, value)
                .finally(() => this.loading = false);
      }, 500);
    },
    onSelect(selectedLogin) {
      this.$store.commit(SET_USERS, this.users.filter(({ login }) => login === selectedLogin));
    },
    onUserClick(login) {
      this.$router.push({ name: 'user', params: { login } });
    },
  }
}
</script>

<style lang="scss">
  .search-wrapper {
    padding-right: 50px;
  }

  .search {
    width: 100%;

    .ant-select-auto-complete {
      .ant-select-selection--single {
        margin-right: -46px;
      }

      .ant-input-affix-wrapper {
        .ant-input:not(:last-child) {
          padding-right: 62px;
        }

        .ant-input-suffix button {
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }
      }
    }
  }

  .search-item {
    display: flex;
  }

  .search-item-desc {
    flex: auto;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .search-item-count {
    flex: none;
  }
</style>
