export function useAuthPanel() {
  const mode = useState<"login" | "register">("auth-panel-mode", () => "login");
  const open = useState<boolean>("auth-panel-open", () => false);

  function closePanel() {
    open.value = false;
  }

  function openLogin() {
    mode.value = "login";
    open.value = true;
  }

  function openRegister() {
    mode.value = "register";
    open.value = true;
  }

  return {
    closePanel,
    mode,
    open,
    openLogin,
    openRegister
  };
}
