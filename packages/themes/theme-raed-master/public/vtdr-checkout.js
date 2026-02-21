(function () {
  const context = window.vtdr_context || {};
  if (String(context.templatePageId || "").trim() !== "checkout") return;

  const salla = window.salla || {};
  const checkoutApi = salla.checkout || {};

  const toPayload = (form) => {
    const data = new FormData(form);
    const payload = {};
    data.forEach((value, key) => {
      payload[key] = String(value == null ? "" : value);
    });
    return payload;
  };

  const setBusy = (form, busy) => {
    const submit = form.querySelector('[type="submit"]');
    if (!submit) return;
    submit.toggleAttribute("disabled", Boolean(busy));
    if (busy) submit.setAttribute("loading", "");
    else submit.removeAttribute("loading");
  };

  const resolveActionHandler = (action) => {
    if (!action) return null;
    if (action === "checkout.start") return checkoutApi.start;
    if (action === "checkout.updateAddress") return checkoutApi.updateAddress;
    if (action === "checkout.updateShipping") return checkoutApi.updateShipping;
    if (action === "checkout.updatePayment") return checkoutApi.updatePayment;
    if (action === "checkout.confirm") return checkoutApi.confirm;
    return null;
  };

  document.addEventListener("submit", async (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    const action = String(form.dataset.checkoutAction || "").trim();
    if (!action) return;

    event.preventDefault();
    const handler = resolveActionHandler(action);
    if (typeof handler !== "function") return;

    const payload = toPayload(form);
    try {
      setBusy(form, true);
      await handler(payload);
    } catch (error) {
      const message =
        error?.response?.error?.message ||
        error?.message ||
        "حدث خطأ أثناء تنفيذ عملية الدفع";
      if (window.salla?.notify?.error) window.salla.notify.error(message);
      else alert(message);
    } finally {
      setBusy(form, false);
    }
  });
})();
