<template>
  <div class="app-shell">
    <AppHeader />
    <main class="app-shell__content">
      <NuxtPage />
    </main>
    <AppFooter />
    <MobileNavWidget />
  </div>
</template>

<script setup lang="ts">
import AppFooter from "~/shared/ui/app-footer/AppFooter.vue";
import { useWebAppBootstrap } from "~/app/model/use-web-app-bootstrap";
import { useWebAppShell } from "~/app/model/use-web-app-shell";
import AppHeader from "~/widgets/app-header/ui/AppHeaderWidget.vue";
import MobileNavWidget from "~/widgets/mobile-nav/ui/MobileNavWidget.vue";

useWebAppShell();
useWebAppBootstrap();
</script>

<style scoped>
.app-shell {
  height: 100dvh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.app-shell__content {
  min-height: 0;
  flex: 1;
  overflow: hidden;
}
</style>
