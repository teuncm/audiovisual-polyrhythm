<script>
import { onMounted } from 'vue';
import { Application, Assets, Sprite } from 'pixi.js';

export default {
  setup() {
    onMounted(async () => {
      // Create a new application
      const app = new Application();

      // Initialize the application
      await app.init({ background: '#005000', resizeTo: window });

      // Append the application canvas to the canvasContainer div
      const canvasEl = document.getElementById('canvas-el');
      canvasEl.appendChild(app.canvas);

      // Load the bunny texture
      const texture = await Assets.load('https://pixijs.com/assets/bunny.png');

      // Create a bunny Sprite
      const bunny = new Sprite(texture);

      // Center the sprite's anchor point
      bunny.anchor.set(0.5);

      // Move the sprite to the center of the screen
      bunny.x = app.screen.width / 2;
      bunny.y = app.screen.height / 2;

      app.stage.addChild(bunny);
    });
  },
};
</script>

<template>
  <div id="canvas-el"></div>
</template>
