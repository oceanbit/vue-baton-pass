import { effectScope, EffectScope, onScopeDispose } from "vue";

/**
 * Make a composable function usable with multiple Vue instances.
 *
 * @see https://vueuse.org/createSharedComposable
 */

export function createSharedComposable<Fn extends (...args: any[]) => any>(
  composable: Fn
): Fn {
  let subscribers = 0;
  let state: ReturnType<Fn> | undefined;
  let scope: EffectScope | undefined;

  const dispose = () => {
    subscribers -= 1;
    if (scope && subscribers <= 0) {
      scope.stop();
      state = undefined;
      scope = undefined;
    }
  };

  return ((...args) => {
    subscribers += 1;
    // "scope" cannot be "state" here, because function may return undefined
    if (!scope) {
      scope = effectScope(true);
      state = scope.run(() => composable(...args));
    }
    onScopeDispose(dispose);
    return state;
  }) as Fn;
}
