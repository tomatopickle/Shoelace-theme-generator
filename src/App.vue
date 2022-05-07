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
                >Toggle Dark Mode</sl-button
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
    <sl-dialog
      label="Copy Code"
      :open="copyCode.show"
      @sl-after-hide="copyCode.show = false"
    >
      <div>
        Add this to your stylesheeet, and don't forget to add the class to an
        element!
      </div>
      <br />
      <div id="codePreview">
        <code>.custom-theme {</code>
        <br />
        <template v-for="(color, i) in this.copyCode.styles" :key="i">
          <code>
            {{ `${i}: ${color};` }}
          </code>
          <br />
        </template>
        <code>}</code>
      </div>
      <div slot="footer">
        <sl-button class="margin-small" variant="primary" @click="copyCSSCode()"
          >Copy Code</sl-button
        >
      </div>
    </sl-dialog>
  </div>
</template>

<script src="./script.js"></script>

<style>
@import url("./styles.css");
</style>
