import {onMounted, onUnmounted, ref} from "vue";

export const useBatonPass = () => {
    const bc = new BroadcastChannel("TEST");

    const getCurrentWidgets = () => Number(localStorage.getItem('currentWidgets')) || 0;
    const setCurrentWidgets = (val: string) => localStorage.setItem('currentWidgets', val);
    const getWidgetID = () => Number(localStorage.getItem('widgetCount')) || 0;
    const setWidgetID = (val: string) => localStorage.setItem('widgetCount', val);

    const isBaton = ref(false);

    const widgetID = ref(0);

    let cleanupTimer: any = undefined;
    let timer: any = undefined;

    onMounted(() => {
        bc.postMessage("CONNECTED")
        const currentWidgetCount = getCurrentWidgets() + 1;
        setCurrentWidgets('' + currentWidgetCount);
        widgetID.value = getWidgetID();
        setWidgetID('' + (widgetID.value + 1));

        function takeOwnerShip() {
            timer = setTimeout(() => {
                isBaton.value = true;
                bc.postMessage("OWNERSHIP_TAKEN")
            }, widgetID.value);
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
        clearTimeout(cleanupTimer);
        clearTimeout(timer);
    }

    onUnmounted(() => {
        cleanup();
    })

    window.onbeforeunload = () => {
        cleanup();
    }

    return {isBaton};
}
