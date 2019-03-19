<template>
  <div class="hello">
    <div
      ref="drawContainer"
      class="draw-container"
      v-bind:style="{ width: size.width + 'px', height: size.height + 'px' }"
    >
      <canvas
        ref="imageLayer"
        class="draw-canvas"
        :width="size.width"
        :height="size.height"
        @click="mouseclick"
        @mousemove="mousemove"
      ></canvas>
    </div>
  </div>
</template>

<script>
import utils from "../utils";

export default {
  name: "HelloWorld",
  data() {
    return {
      size: {
        width: 300,
        height: 300
      },
      points: [],
      image: {}
    };
  },
  created() {
    const img = new Image();
    img.src =
      "https://assets.media-platform.com/lifehacker/dist/images/2014/12/141221start_dog1-w960.jpg";
    this.image = img;
    this.onload = () => {};
  },
  watch: {
    image(value, old) {
      this.drawImage(value, this.$refs.imageLayer);
    }
  },
  methods: {
    drawImage(image, canvas) {
      const ctxImage = canvas.getContext("2d");
      ctxImage.drawImage(
        image,
        0,
        0,
        image.width,
        image.height,
        0,
        0,
        this.size.width,
        this.size.height
      );
    },
    clearCanvas(canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, this.size.width, this.size.height);
    },
    drawPoint(canvas, pt, radius) {
      const ctx = canvas.getContext("2d");
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, radius, 0, 2 * Math.PI, true);
      ctx.stroke();
      ctx.closePath();
    },
    drawRect(canvas, tl, br) {
      const ctx = canvas.getContext("2d");
      ctx.beginPath();
      ctx.rect(tl.x, tl.y, br.x - tl.x, br.y - tl.y);
      ctx.stroke();
      ctx.closePath();
    },
    computeCircumscribedCircle(p1, p2, p3) {
      const getDistance = (p1, p2) => {
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
      };

      // https://ja.wikipedia.org/wiki/%E5%A4%96%E6%8E%A5%E5%86%86
      // 対辺の長さ a,b,c
      const c2 = Math.pow(getDistance(p1, p2), 2);
      const a2 = Math.pow(getDistance(p2, p3), 2);
      const b2 = Math.pow(getDistance(p3, p1), 2);
      const A = a2 * (b2 + c2 - a2);
      const B = b2 * (c2 + a2 - b2);
      const C = c2 * (a2 + b2 - c2);

      const circumcenters = {
        x: (A * p1.x + B * p2.x + C * p3.x) / (A + B + C),
        y: (A * p1.y + B * p2.y + C * p3.y) / (A + B + C)
      };

      // const center = {
      //   x: (p1.x + p2.x + p3.x) / 3,
      //   y: (p1.y + p2.y + p3.y) / 3
      // };

      const radius = Math.sqrt(
        Math.pow(p1.x - circumcenters.x, 2) +
          Math.pow(p1.y - circumcenters.y, 2)
      );
      console.log(
        "pow",
        Math.pow(p1.x - circumcenters.x, 2) +
          Math.pow(p1.y - circumcenters.y, 2),
        "sqrt",
        Math.sqrt(
          Math.pow(p1.x - circumcenters.x, 2) +
            Math.pow(p1.y - circumcenters.y, 2)
        )
      );
      return { circumcenters, radius };
    },
    drawCircumcenters(canvas) {
      if (this.points.length >= 3) {
        const ret = this.computeCircumscribedCircle(
          this.points[0],
          this.points[1],
          this.points[2]
        );
        this.drawPoint(canvas, ret.circumcenters, 3);
        this.drawPoint(canvas, ret.circumcenters, ret.radius);
      }
    },
    mouseclick(e) {
      const canvas = this.$refs.imageLayer;
      const position = utils.getMousePositionFromCanvas(canvas, e);
      this.points.push(position);
      this.drawPoint(canvas, position, 2);
      console.log(this.points.length);
      if (this.points.length >= 4) {
        const x_arr = this.points.map(v => v.x);
        const y_arr = this.points.map(v => v.y);
        console.log(x_arr, y_arr);
        const tl = {
          x: Math.min(...x_arr),
          y: Math.min(...y_arr)
        };
        const br = {
          x: Math.max(...x_arr),
          y: Math.max(...y_arr)
        };
        console.log(tl, br);
        this.drawPoint(canvas, tl, 1);
        this.drawPoint(canvas, br, 1);
        this.drawRect(canvas, tl, br);
      }
    },
    mousemove(e) {}
  },
  props: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.draw-container {
  position: relative;
  margin: 0 auto;
  border: 1px rgb(124, 54, 89) solid;
}
</style>
