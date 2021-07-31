navigator.serviceWorker.getRegistrations().then(function (registrations) {
  for (let registration of registrations) {
    if (registration.active) {
      if (registration.active.scriptURL.endsWith('service-worker.js')) {
        registration.unregister();
      }
    }
  }
});
