<template>
  <div class="app-shell">
    <AppHeader />
    <NuxtPage />
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watchEffect } from "vue";
import { useAuthSession } from "~/features/auth";
import { usePreferences } from "~/shared/lib/preferences/use-preferences";
import AppFooter from "~/shared/ui/app-footer/AppFooter.vue";
import AppHeader from "~/widgets/app-header/ui/AppHeaderWidget.vue";

const route = useRoute();
const runtimeConfig = useRuntimeConfig();
const { init, locale, setLocale, t } = usePreferences();
const { bootstrap } = useAuthSession();

const siteUrl = computed(() => String(runtimeConfig.public.siteUrl || "http://localhost:3000"));
const routePath = computed(() =>
  route.path !== "/" && route.path.endsWith("/") ? route.path.slice(0, -1) : route.path
);
const canonicalUrl = computed(() => `${siteUrl.value}${routePath.value}`);
const ogImageUrl = computed(() => `${siteUrl.value}/og-image.svg`);

const localeFromQuery = computed(() => {
  const lang = route.query.lang;
  if (lang === "ru" || lang === "en") {
    return lang;
  }
  return null;
});

watchEffect(() => {
  if (localeFromQuery.value) {
    setLocale(localeFromQuery.value);
  }
});

useHead(() => ({
  htmlAttrs: {
    lang: locale.value
  },
  link: [
    { rel: "canonical", href: canonicalUrl.value },
    { rel: "alternate", hreflang: "ru", href: `${canonicalUrl.value}?lang=ru` },
    { rel: "alternate", hreflang: "en", href: `${canonicalUrl.value}?lang=en` },
    { rel: "alternate", hreflang: "x-default", href: canonicalUrl.value },
    { rel: "manifest", href: "/manifest.webmanifest" },
    { rel: "icon", type: "image/svg+xml", href: "/icons/icon-192.svg" },
    { rel: "apple-touch-icon", href: "/icons/icon-192.svg" }
  ],
  meta: [
    { name: "application-name", content: runtimeConfig.public.appName },
    { name: "apple-mobile-web-app-capable", content: "yes" },
    { name: "apple-mobile-web-app-title", content: runtimeConfig.public.appName },
    { name: "theme-color", media: "(prefers-color-scheme: light)", content: "#fffdf7" },
    { name: "theme-color", media: "(prefers-color-scheme: dark)", content: "#0f1519" }
  ]
}));

useSeoMeta({
  titleTemplate: (chunk) => (chunk ? `${chunk} | ${runtimeConfig.public.appName}` : runtimeConfig.public.appName),
  description: () => t("page.hero.subtitle"),
  ogUrl: canonicalUrl,
  ogSiteName: runtimeConfig.public.appName,
  ogType: "website",
  ogImage: ogImageUrl,
  twitterCard: "summary_large_image",
  twitterImage: ogImageUrl
});

onMounted(() => {
  init();
  void bootstrap();
});
</script>

<style scoped>
.app-shell {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}
</style>
