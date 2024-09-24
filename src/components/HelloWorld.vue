<script setup>
// No props needed as we are only displaying static text
</script>

<template>
  <div class="greetings">
    <h1>mSun's World</h1>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@700&display=swap');

html, body {
  margin: 0;
  height: 100%;
  overflow: hidden;
  touch-action: none; /* 禁用触控板左右滑动 */
  width: 100%; /* 确保宽度为100% */
}

body {
  overflow: hidden;
  position: fixed;
  width: 100%;
}

.greetings {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background: linear-gradient(270deg, #a1c4fd, #c2e9fb, #a1c4fd, #c2e9fb);
  background-size: 800% 800%;
  animation: gradient 10s ease infinite;
}

h1 {
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  font-size: 4rem;
  background: linear-gradient(90deg, #ff7e5f, #feb47b, #86a8e7, #91eae4);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: textGradient 5s ease infinite;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.3);
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes textGradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
