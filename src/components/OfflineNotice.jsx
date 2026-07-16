import { useEffect, useState } from "react";

function OfflineNotice() {
  const [isOffline, setIsOffline] = useState(() => !navigator.onLine);

  useEffect(() => {
    const showOfflineNotice = () => setIsOffline(true);
    const hideOfflineNotice = () => setIsOffline(false);

    window.addEventListener("offline", showOfflineNotice);
    window.addEventListener("online", hideOfflineNotice);

    return () => {
      window.removeEventListener("offline", showOfflineNotice);
      window.removeEventListener("online", hideOfflineNotice);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="offline-notice" role="status" aria-live="polite">
      Necesitas conexión a internet para ver productos actualizados de Global-GS
      Store.
    </div>
  );
}

export default OfflineNotice;
