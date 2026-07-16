import { useEffect, useState } from "react";

const isStandalone = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  window.navigator.standalone === true;

function InstallAppPrompt() {
  const [installEvent, setInstallEvent] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isStandalone()) return undefined;

    const handleInstallAvailable = (event) => {
      event.preventDefault();
      setInstallEvent(event);
      setVisible(true);
    };

    const handleInstalled = () => {
      setInstallEvent(null);
      setVisible(false);
    };

    window.addEventListener("beforeinstallprompt", handleInstallAvailable);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleInstallAvailable);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const installApp = async () => {
    if (!installEvent) return;

    await installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside className="install-app-prompt" aria-label="Instalar Global-GS Store">
      <div>
        <strong>Global-GS en tu dispositivo</strong>
        <span>Accede a la tienda como una app.</span>
      </div>
      <button type="button" className="install-app-button" onClick={installApp}>
        Instalar app
      </button>
      <button
        type="button"
        className="install-app-close"
        onClick={() => setVisible(false)}
        aria-label="Cerrar aviso de instalacion"
        title="Cerrar"
      >
        &times;
      </button>
    </aside>
  );
}

export default InstallAppPrompt;
