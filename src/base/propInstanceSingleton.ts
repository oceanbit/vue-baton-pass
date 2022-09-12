import { effectScope, onScopeDispose } from "vue";

// eslint-disable-next-line @typescript-eslint/ban-types
export const getPropInstanceSingleton = <OnAddFn extends Function>() => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  const onAddFnArr = {
    value: [] as OnAddFn[],
  };

  return (onAdd?: OnAddFn) => {
    if (onAdd) {
      const scope = effectScope();

      scope.run(() => {
        onAddFnArr.value.push(onAdd);
      });

      onScopeDispose(() => {
        onAddFnArr.value = onAddFnArr.value.filter((fn) => fn !== onAdd);

        scope.stop();
      });
    }

    return onAddFnArr;
  };
};
