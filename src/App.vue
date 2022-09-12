<script lang="ts" setup>
import {onMounted, onUnmounted, ref} from "vue";


const bc = new BroadcastChannel("TEST");

const getCurrentWidgets = () => Number(localStorage.getItem('currentWidgets')) || 0;
const setCurrentWidgets = (val: string) => localStorage.setItem('currentWidgets', val);
const getWidgetID = () => Number(localStorage.getItem('widgetCount')) || 0;
const setWidgetID = (val: string) => localStorage.setItem('widgetCount', val);

const isBaton = ref(false);

const widgetID = ref(0);

let cleanupTimer: any = undefined;

onMounted(() => {

  let timer: any = undefined;

  bc.postMessage("CONNECTED")
  const currentWidgetCount = getCurrentWidgets() + 1;
  setCurrentWidgets('' + currentWidgetCount);
  widgetID.value = getWidgetID();
  setWidgetID('' + (widgetID.value + 1));

  function takeOwnerShip() {
    timer = setTimeout(() => {
      isBaton.value = true;
      bc.postMessage("OWNERSHIP_TAKEN")
    }, widgetID.value * 100);
  }

  // First widget
  if (currentWidgetCount === 1) {
    takeOwnerShip()
  }

  bc.onmessage = (event) => {
    if (event.data === 'CLOSING') {
      takeOwnerShip();
    }

    if (event.data === 'OWNERSHIP_TAKEN') {
      clearTimeout(timer);
    }
  }
})

function cleanup() {
  bc.postMessage("CLOSING")
  bc.close();
  let currentWidgetCount = getCurrentWidgets() - 1;
  currentWidgetCount = currentWidgetCount < 0 ? 0 : currentWidgetCount;
  setCurrentWidgets('' + currentWidgetCount);
  if (currentWidgetCount === 0) {
    setWidgetID('0');
  }
}

onUnmounted(() => {
  cleanup();
  clearTimeout(cleanupTimer);
})

window.onbeforeunload = () => {
  cleanup();
}
</script>

<template>
  <p>{{ isBaton ? "I am the baton" : "I am not the baton" }}</p>
</template>
