<template>
  <div>
     <Header />
     <Sale />
     <Footer />
  </div>
</template>

<script>
import Header from "./Header";
import Sale from "./Sale";
import Footer from "./Footer";
export default {
  name: "Dashboard",
  components: {
    Header,
    Sale,
    Footer
  },
};
</script>

<style>
</style>
