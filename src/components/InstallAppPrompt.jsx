import { useEffect, useState } from "react";

const isStandalone = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  window.navigator.standalone === true;

const isIosDevice = () => /iphone|ipad|ipod/i.test(window.navigator.userAgent);

function InstallAppPrompt() {
  const [installEvent, setInstallEvent] = useState(null);
  const [visible, setVisible] = useState(false);
  const [showIosHelp] = useState(isIosDevice);

  useEffect(() => {
    if (isStandalone()) return undefined;

    if (showIosHelp) {
      setVisible(true);
    }

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
  }, [showIosHelp]);

  const installApp = async () => {
    if (!installEvent) return;

    try {
      await installEvent.prompt();
      await installEvent.userChoice;
    } finally {
      setInstallEvent(null);
      setVisible(false);
    }
  };

  if (!visible) return null;

  return (
    <aside className="install-app-prompt" aria-label="Instalar Global-GS Store">
      <div>
        <strong>{showIosHelp ? "Instala Global-GS" : "Global-GS en tu dispositivo"}</strong>
        <span>
          {showIosHelp
            ? "En Safari, pulsa Compartir y luego Agregar a pantalla de inicio."
            : "Accede a la tienda como una app."}
        </span>
      </div>
      {installEvent && (
        <button type="button" className="install-app-button" onClick={installApp}>
          Instalar app
        </button>
      )}
      {showIosHelp && (
        <button
          type="button"
          className="install-app-button"
          onClick={() => setVisible(false)}
        >
          Entendido
        </button>
      )}
      <button
        type="button"
        className="install-app-close"
        onClick={() => setVisible(false)}
        aria-label="Cerrar aviso de instalación"
        title="Cerrar"
      >
        &times;
      </button>
    </aside>
  );
}

export default InstallAppPrompt;
