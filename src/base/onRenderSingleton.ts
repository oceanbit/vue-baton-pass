import { createSharedComposable } from "./createSharedComposable";
import { onMounted, onUnmounted, ref } from "vue";

/**
 * This composition is meant to provide a watchEffect-like `onInvalidate`
 * API for onMounted/onUnmounted. This allows us to create shared composable
 * that act much more consistently than previous watchEffectSingleton attempts
 * we made (seriously, don't go looking for them)
 */
export const getOnRenderSingleton = () =>
  createSharedComposable((onMount: (onCleanup: (fn: () => void) => void) => void) => {
    const unmountFn = ref<() => void>();

    function mount() {
      unmount();

      onMount((fn) => {
        unmountFn.value = fn;
      });
    }

    function unmount() {
      unmountFn.value?.call(null);
      unmountFn.value = undefined;
    }

    onMounted(mount);
    onUnmounted(unmount);
  });
