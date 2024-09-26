<script setup>
// No props needed as we are only displaying static text
</script>

<template>
  <div class="greetings">
    <h1>
      <img src="/favicon.svg" alt="icon" class="icon" />
      <span class="title">
        MSun<span class="highlight">'</span>s Wor<span class="highlight">l</span>d.
      </span> 
    </h1>
  </div>
</template>

<style scoped>
@import url('https://at.alicdn.com/t/font_8d5l8fzk5b87iudi.css');
/* 替换为阿里巴巴矢量图标库的字体 */

html,
body {
  margin: 0;
  height: 100%;
  overflow: hidden;
  touch-action: none;
  /* 禁用触控板左右滑动 */
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
  font-family: 'Noto Sans', sans-serif;
  /* 使用新的字体 */
  font-size: 4rem;
  /* 设置字体大小 */
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.3);
  /* 设置文本阴影 */
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

.icon {
  width: 50px;
  height: 50px;
  margin-right: 10px;
  position: relative;
  top: 2px;
  right: 2.5px;
}

.title {
  font-weight: 800;
}

.highlight {
  font-weight: 800;
  color: #ef152b;
}
</style>
