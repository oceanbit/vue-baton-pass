<script lang="ts" setup>
import {useBatonPass} from "./use-baton-pass";
import {watch} from "vue";

const {isBaton} = useBatonPass();

watch(isBaton, (value, oldValue, onCleanup) => {
  // DO EFFECT CODE HERE
})
</script>

<template>
  <p>{{ isBaton ? "I am the baton" : "I am not the baton" }}</p>
</template>
