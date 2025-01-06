<script>
import { start } from '../scripts/poly';

export default {
  setup() {
    const runAudio = () => {
      start();
    };

    return {
      runAudio,
    }
  },
};
</script>

<template>
  <button id="tester" @click="runAudio">Test</button>
</template>
