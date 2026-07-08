function Footer() {
  const siteUrl = "https://globalgsstore.com";
  const shareText =
    "Global-GS Store: tecnologia, accesorios, CCTV, redes y soporte tecnico en RD.";

  const shareLinks = [
  {
    label: "WhatsApp",
    url: `https://wa.me/18292215896?text=${encodeURIComponent(siteUrl)}`,
    className: "whatsapp",
  },
  {
    label: "Facebook",
    url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}`,
    className: "facebook",
  },
  {
    label: "Instagram",
    url: "https://www.instagram.com/global_gs",
    className: "instagram",
  },
  {
    label: "TikTok",
    url: "https://www.tiktok.com/@juliovasquezpolanco",
    className: "tiktok",
  },
  {
    label: "X",
    url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(siteUrl)}&text=${encodeURIComponent("Visita Global-GS Store")}`,
    className: "x",
  },
];

  const copyStoreLink = async () => {
    try {
      await navigator.clipboard.writeText(siteUrl);
      alert("Enlace de Global-GS copiado.");
    } catch {
      window.prompt("Copia el enlace de Global-GS:", siteUrl);
    }
  };

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <section className="footer-brand">
          <h3>Global-GS Store</h3>
          <p>
            Soluciones tecnologicas, accesorios, seguridad electronica y soporte
            tecnico.
          </p>
        </section>

        <section className="footer-contact">
          <strong>Contacto</strong>
          <a href="https://wa.me/18292215896" target="_blank" rel="noreferrer">
            WhatsApp: 829-221-5896
          </a>
          <a
            href="https://www.instagram.com/global_gs"
            target="_blank"
            rel="noreferrer"
          >
            Instagram: @global_gs
          </a>
          <a href={siteUrl} target="_blank" rel="noreferrer">
            globalgsstore.com
          </a>
        </section>

        <section className="footer-share">
          <strong>Compartir tienda</strong>
          <div className="footer-share-actions">
            {shareLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className={`footer-share-btn ${link.className}`}
              >
                {link.label}
              </a>
            ))}

            <button type="button" onClick={copyStoreLink}>
              Copiar enlace
            </button>
          </div>
        </section>
      </div>

      <p className="footer-copy">
        &copy; 2026 Global-GS. Todos los derechos reservados.
      </p>
    </footer>
  );
}

export default Footer;
