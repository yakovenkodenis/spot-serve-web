import { basePath } from '@/config/base-path';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
    }

    navigator.serviceWorker.register(`${basePath}service-worker.js`).catch((registrationError) => {
      console.error('Service worker registration failed:', registrationError);
    });
  });
}
