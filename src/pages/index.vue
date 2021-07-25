
<template>
  <div>
    <p>The visited URL is: {{ url }}</p>
	<p><button @click="sayHello">Hello There!!</button></p>
	<router-link to="/about">About page</router-link>
  </div>
</template>

<script>
export default {
  data() {
	return {
	  url: this.$route.path
	}
  },
  methods: {
	sayHello() {
	  window.alert('Hello!')
	}
  },
  created () {
	console.log('created')
  },
  mounted () {
	console.log('mounted')
  }
}
</script>
