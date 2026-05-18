import { onMounted } from "vue";
import { useAuthSession } from "~/features/auth";
import { usePreferences } from "~/shared/lib/preferences/use-preferences";

export function useWebAppBootstrap() {
  const { init } = usePreferences();
  const { bootstrap } = useAuthSession();

  onMounted(() => {
    init();
    void bootstrap();
  });
}
