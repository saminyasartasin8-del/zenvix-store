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
    const message = document.getElementById("loginMessage");
    form.insertBefore(link, message || null);

    link.addEventListener("click", async () => {
      const email = form.querySelector('[name="email"]')?.value.trim();
      const status = document.getElementById("loginMessage");
      if (!email) {
        if (status) status.textContent = "Enter your Gmail address first, then choose Forgot password.";
        form.querySelector('[name="email"]')?.focus();
        return;
      }
      if (status) status.textContent = "Requesting a password reset link…";
      const redirectTo = new URL("account.html", window.location.origin).href;
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email, { redirectTo });
      if (status) {
        status.textContent = error
          ? "Could not send the reset email. Please try again later."
          : "If an account uses this email, a reset link has been sent. Check your inbox and spam folder.";
      }
    });
  }

  function showPasswordUpdateForm() {
    root.innerHTML = `<section class="account-card"><h1>Choose a new password</h1><p>Use at least 10 characters, then sign in with your new password.</p><form id="passwordUpdateForm" class="account-form"><label>New password<input name="password" type="password" minlength="10" autocomplete="new-password" required></label><label>Confirm new password<input name="confirmPassword" type="password" minlength="10" autocomplete="new-password" required></label><button class="btn orange" type="submit">Update password</button><p class="account-message" id="passwordUpdateMessage" role="status"></p></form></section>`;

    document.getElementById("passwordUpdateForm").addEventListener("submit", async event => {
      event.preventDefault();
      const form = event.currentTarget;
      const password = form.elements.password.value;
      const confirmation = form.elements.confirmPassword.value;
      const status = document.getElementById("passwordUpdateMessage");
      if (password !== confirmation) {
        status.textContent = "The passwords do not match. Please enter them again.";
        return;
      }
      status.textContent = "Updating your password…";
      const { error } = await supabaseClient.auth.updateUser({ password });
      if (error) {
        status.textContent = "Could not update the password. Please reopen the reset email and try again.";
        return;
      }
      status.innerHTML = 'Password updated. <a href="account.html">Go to sign in</a>.';
    });
  }

  const observer = new MutationObserver(attachForgotPassword);
  observer.observe(root, { childList: true, subtree: true });
  attachForgotPassword();
  supabaseClient.auth.onAuthStateChange(event => {
    if (event === "PASSWORD_RECOVERY") showPasswordUpdateForm();
  });
})();
