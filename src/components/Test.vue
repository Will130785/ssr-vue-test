<template>
  <div class="test">
    <h2>Test component</h2>
    <p class="test-welcome">Hi, this is just a test component</p>
    <p class="test-message">{{ message }}</p>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        message: 'This is a message'
      }
    }
  }
</script>

<style scoped lang="scss">
.test {
  
  h2 {
    color: greenyellow
  }
}

.test-welcome {
  font-size: 20px;
  color: blue;
}

.test-message {
  font-size: 10px;
  color: orange;
}
</style>