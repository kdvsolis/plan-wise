<template>
  <div id="main">
    <main-header></main-header>
    <router-view></router-view>
  </div>
</template>

<script>
// I-import ang iyong navbar component mula sa file path
import mainHeader from "./components/Header.vue";

export default {
  components: {
    mainHeader,
  },
};
</script>

