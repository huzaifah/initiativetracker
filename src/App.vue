<template>
  <router-view></router-view>
</template>

<script>
import { mapActions } from "vuex";

export default {
  methods: {
    ...mapActions({
      initializeInitiative: "store/initializeInitiative"
    })
  },
  created() {
    this.initializeInitiative(this.$store);
  }

};
</script>
