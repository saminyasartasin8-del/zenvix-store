(() => {
  const root = document.getElementById("account");
  if (!root || typeof supabaseClient === "undefined") return;

  function attachForgotPassword() {
    const form = document.getElementById("customerLogin");
    if (!form || form.querySelector(".password-recovery-link")) return;

    const link = document.createElement("button");
    link.type = "button";
    link.className = "password-recovery-link";
    link.textContent = "Forgot password?";
    const status = document.getElementById("loginMessage");
    form.insertBefore(link, status || null);

    link.addEventListener("click", async () => {
      const emailInput = form.querySelector('[name="email"]');
      const email = emailInput?.value.trim();
      const message = document.getElementById("loginMessage");
      if (!email) {
        if (message) message.textContent = "Enter your Gmail address first, then choose Forgot password.";
        emailInput?.focus();
        return;
      }
      if (message) message.textContent = "Requesting a password reset link…";
      const redirectTo = new URL("reset-password.html", window.location.origin).href;
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email, { redirectTo });
      if (message) {
        message.textContent = error
          ? "Supabase could not send the email just now. Wait before retrying; its default email service has a low sending limit."
          : "If an account uses this email, a reset link has been sent. Check your inbox and spam folder.";
      }
    });
  }

  const observer = new MutationObserver(attachForgotPassword);
  observer.observe(root, { childList: true, subtree: true });
  attachForgotPassword();
})();
