import chroma from "chroma-js";
import jss from "jss-browserify/jss";
export default {
  name: "App",
  data: () => {
    return {
      darkMode: false,
      copyCode: {
        show: false,
        styles: {},
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
      let styles = {};
      this.colors.forEach((colorInfo) => {
        // Merging the styles object returned
        styles = Object.assign(
          styles,
          this.getPalette(colorInfo.variable, colorInfo.value)
        );
      });

      this.copyCode.styles = styles;
    },
    copyCSSCode() {
      const text = document.getElementById("codePreview").innerText;
      console.log(text);
      window.navigator.clipboard.writeText(text);
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