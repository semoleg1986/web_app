import { onBeforeUnmount, toValue, watch } from "vue";
import type { MaybeRefOrGetter } from "vue";

export function useSseChannel(
  url: MaybeRefOrGetter<string>,
  handlers: {
    // eslint-disable-next-line no-unused-vars
    onMessage?: (message: string) => void | Promise<void>;
    onOpen?: () => void;
    onError?: () => void;
  } = {}
) {
  let source: EventSource | null = null;

  function close() {
    if (source) {
      source.close();
      source = null;
    }
  }

  function open(nextUrl: string) {
    close();
    if (!import.meta.client || !nextUrl) {
      return;
    }

    source = new EventSource(nextUrl, { withCredentials: true });
    source.onopen = () => {
      handlers.onOpen?.();
    };
    source.addEventListener("update", (event) => {
      handlers.onMessage?.((event as MessageEvent<string>).data);
    });
    source.addEventListener("error", () => {
      handlers.onError?.();
    });
    source.onmessage = (event) => {
      handlers.onMessage?.(event.data);
    };
    source.onerror = () => {
      handlers.onError?.();
    };
  }

  if (import.meta.client) {
    watch(
      () => toValue(url),
      (nextUrl) => {
        open(nextUrl);
      },
      { immediate: true }
    );

    onBeforeUnmount(() => {
      close();
    });
  }

  return { close };
}
