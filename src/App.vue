<template>
  <div>
    <div id="header">
      <h2>Shoelace Theme Generator</h2>
    </div>
    <div id="content">
      <sl-split-panel position="68">
        <div slot="start" style="height: 100%">
          <sl-card class="card-preview">
            <div id="colorsHeader">
              <h2>Colors</h2>
              <sl-button size="medium" @click="switchToDarkMode()"
                >Switch to Dark Mode</sl-button
              >
              <sl-button variant="primary" @click="showCode()"
                >Get Code</sl-button
              >
            </div>
            <div>
              <div
                v-for="color in colors"
                class="colors-parent"
                v-bind:key="color.id"
              >
                <h4>
                  {{ color.name }}
                </h4>
                <div class="colors">
                  <sl-color-picker
                    :value="color.value"
                    label="Select a color"
                    v-on:sl-change="updateColor($event, color.variable)"
                    format="hex"
                  ></sl-color-picker>
                  <div
                    class="swatch"
                    v-for="number in numbers"
                    :key="number"
                    :style="{
                      backgroundColor: `var(${color.variable + '-' + number})`,
                    }"
                  ></div>
                </div>
              </div>
            </div>
          </sl-card>
        </div>
        <div slot="end" style="height: 100%" class="custom-theme">
          <sl-card class="card-preview">
            <h2>Preview</h2>
            <div>
              <sl-button variant="default">Default</sl-button>
              <sl-button variant="primary">Primary</sl-button>
              <sl-button variant="success">Success</sl-button>
              <sl-button variant="neutral">Neutral</sl-button>
              <sl-button variant="warning">Warning</sl-button>
              <sl-button variant="danger">Danger</sl-button>
            </div>
          </sl-card>
        </div>
      </sl-split-panel>
    </div>
    <sl-dialog label="Copy Code" :open="copyCode.show" @sl-after-hide="copyCode.show = false;">
      <pre id="codePreview">
      <code>{{copyCode.styles}}</code>

      </pre>
      <div slot="footer">
        <sl-button class="margin-small" variant="primary">Copy Code</sl-button>
      </div>
    </sl-dialog>
  </div>
</template>

<script>
import chroma from "chroma-js";
import jss from "jss-browserify/jss";
export default {
  name: "App",
  data: () => {
    return {
      darkMode: false,
      copyCode: {
        show: false,
        styles: "",
      },
      numbers: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
      colors: [
        { name: "Primary", id: "primary", variable: "--sl-color-primary" },
        { name: "Success", id: "success", variable: "--sl-color-success" },
        { name: "Warning", id: "warning", variable: "--sl-color-warning" },
        { name: "Danger", id: "danger", variable: "--sl-color-danger" },
        { name: "Neutral", id: "neutral", variable: "--sl-color-neutral" },
      ],
    };
  },
  mounted() {
    this.colors.forEach((color, i) => {
      this.colors[i].value = getComputedStyle(
        document.documentElement
      ).getPropertyValue(`${color.variable}-500`);
    });
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      this.switchToDarkMode();
    }
  },
  methods: {
    showCode() {
      this.copyCode.show = true;
      let styles = "";
      this.colors.forEach((colorInfo) => {
        // Converting JSON object to CSS code and adding it
        let palette = this.getPalette(colorInfo.variable, colorInfo.value);
        for (var variable of Object.keys(palette)) {
          styles += `\n ${variable}: ${palette[variable]}`;
        }
      });
      
      this.copyCode.styles = styles;
    },
    updateColor(e, variable) {
      let value = e.target.value;
      this.colors.forEach((color, i) => {
        if (color.variable == variable) {
          this.colors[i].value = e.target.value;
        }
      });
      jss.set(":root,:host,.sl-theme-light", this.getPalette(variable, value));
    },
    switchToDarkMode() {
      let styles = {};
      this.darkMode = !this.darkMode;
      this.colors.forEach((colorInfo) => {
        // Merging the styles object returned
        styles = Object.assign(
          styles,
          this.getPalette(colorInfo.variable, colorInfo.value)
        );
      });
      // Clearing previous styles
      jss.remove(":root,:host,.sl-theme-light");
      jss.set(":root,:host,.sl-theme-light", styles);
    },
    getPalette(variable, value) {
      // Returns a pallete of colors in a json format
      // If it's in this format hsl(x y z%) add commas to it
      let styles = {};
      if (value.includes("hsl") && !value.includes(",")) {
        value = value.trim().replaceAll(" ", ",");
      }
      const hex = chroma(value).hex();

      let scale = chroma
        .scale([
          chroma(hex).luminance(0.95), // 50
          chroma(hex).luminance(0.84), // 100
          chroma(hex).luminance(0.73), // 200
          chroma(hex).luminance(0.62), // 300
          chroma(hex).luminance(0.49), // 400
          chroma(hex).luminance(0.35), // 500
          chroma(hex).luminance(0.23), // 600
          chroma(hex).luminance(0.15), // 700
          chroma(hex).luminance(0.1), // 800
          chroma(hex).luminance(0.05), // 900
          chroma(hex).luminance(0.02), // 950
        ])
        .colors(this.numbers.length);
      if (this.darkMode) {
        scale = scale.reverse();
        if (variable == "--sl-color-neutral") {
          styles[`--sl-color-neutral-0`] = `${chroma(
            chroma(scale[1]).luminance(0.01)
          ).hex()} `;
        }
      } else {
        styles[`--sl-color-neutral-0`] = `${chroma(
          chroma(scale[1]).luminance(1)
        ).hex()} `;
      }

      scale.map((color, index) => {
        const rgb = chroma(color).rgb();
        styles[`${variable}-${this.numbers[index]}`] = `rgb(${rgb})`;
      });
      return styles;
    },
  },
};
</script>

<style>
body {
  font-family: var(--sl-font-sans);
  font-size: var(--sl-font-size-medium);
  font-weight: var(--sl-font-weight-normal);
  letter-spacing: var(--sl-letter-spacing-normal);
  background-color: var(--sl-color-neutral-0);
  color: var(--sl-color-neutral-900);
  line-height: var(--sl-line-height-normal);
  --spacing: 1.5rem;
  --swatch-size: 55px;
}
#codePreview {
  background-color: var(--sl-color-neutral-50);
  height: max-content;
  border-radius: var(--sl-border-radius-medium);
}
h1,
h2,
h3,
h4,
h5,
h6 {
  margin: 0;
}
#content {
  margin: auto;
  margin-top: 30px;
  width: 95vw;
}
.card-preview {
  width: 100%;
}
.card-preview sl-button {
  margin: var(--sl-spacing-2x-small);
}
.swatch {
  display: inline-block;
  width: var(--swatch-size);
  height: var(--swatch-size);
  border-radius: 2px;
  margin-inline: 2px;
}
.colors {
  display: flex;
  align-items: center;
}
.colors-parent {
  width: max-content;
  margin: auto;
}
.colors-parent h4 {
  position: relative;
  right: 2.5vw;
}
.colors sl-color-picker {
  margin-right: 10px;
}
#colorsHeader {
  display: flex;
  margin-bottom: 7px;
}
#colorsHeader h2 {
  width: 90%;
}
</style>