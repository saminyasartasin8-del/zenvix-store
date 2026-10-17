(() => {
  const root = document.getElementById("passwordRecoveryRoot");
  if (!root || typeof supabaseClient === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const recoveryUrl = params.has("code") || params.get("type") === "recovery" ||
    params.has("token_hash") || window.location.hash.includes("type=recovery");
  let formVisible = false;

  function showInvalidLink() {
    root.innerHTML = `<section class="account-card"><h1>Reset link unavailable</h1><p>This link may have expired or already been used. Return to your account page and request a new reset email.</p><a class="btn orange" href="account.html">Back to sign in</a></section>`;
  }

  function showPasswordForm(session) {
    if (!session) return;
    formVisible = true;
    root.innerHTML = `<section class="account-card"><h1>Choose a new password</h1><p>Enter your new password twice. Use at least 10 characters.</p><form id="passwordUpdateForm" class="account-form"><label>New password<input name="password" type="password" minlength="10" autocomplete="new-password" required></label><label>Confirm new password<input name="confirmPassword" type="password" minlength="10" autocomplete="new-password" required></label><button class="btn orange" type="submit">Update password</button><p class="account-message" id="passwordUpdateMessage" role="status"></p></form></section>`;
    document.getElementById("passwordUpdateForm").addEventListener("submit", async event => {
      event.preventDefault();
      const form = event.currentTarget;
      const password = form.elements.password.value;
      const confirmation = form.elements.confirmPassword.value;
      const message = document.getElementById("passwordUpdateMessage");
      if (password !== confirmation) {
        message.textContent = "The passwords do not match. Please enter them again.";
        return;
      }
      message.textContent = "Updating your password…";
      const { error } = await supabaseClient.auth.updateUser({ password });
      if (error) {
        message.textContent = "Could not update the password. Request a fresh reset email and try again.";
        return;
      }
      message.innerHTML = 'Password updated successfully. <a href="account.html">Go to your account</a>.';
    });
  }

  supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === "PASSWORD_RECOVERY" || (recoveryUrl && session)) showPasswordForm(session);
  });

  if (recoveryUrl) {
    supabaseClient.auth.getSession().then(({ data, error }) => {
      if (data?.session) showPasswordForm(data.session);
      else if (error || !formVisible) showInvalidLink();
    });
  } else {
    showInvalidLink();
  }
})();
