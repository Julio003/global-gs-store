import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getProductImageUrl, useProductImageFallback } from "../utils/productImages";
import { getProductVideoUrl, productHasVideo } from "../utils/productVideo";
import "./ProductVideos.css";

const idOf = (product) => product._id || product.id;
const priceOf = (product) => `RD$${Number(product.price || 0).toLocaleString("es-DO")}`;

export default function ProductVideos({ products, usingFallback, onBuy }) {
  const videos = products.filter(productHasVideo);
  const [activeId, setActiveId] = useState(null);
  const [failedId, setFailedId] = useState(null);
  const dialog = useRef(null);
  const strip = useRef(null);
  const videoRef = useRef(null);
  const opener = useRef(null);
  const index = videos.findIndex((product) => idOf(product) === activeId);
  const active = videos[index];
  const isOpen = Boolean(active);

  useEffect(() => {
    const element = dialog.current;
    if (!element || !isOpen) return;
    element.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      opener.current?.focus();
    };
  }, [isOpen]);

  if (!videos.length) return null;

  function open(product, event) {
    opener.current = event.currentTarget;
    setActiveId(idOf(product));
  }

  function move(direction) {
    videoRef.current?.pause();
    setActiveId(idOf(videos[(index + direction + videos.length) % videos.length]));
  }

  return (
    <section className="gs-videos" aria-labelledby="gs-video-heading">
      <div className="gs-videos-heading">
        <div><span className="gs-video-eyebrow">GLOBAL-GS EN ACCIÓN</span><h2 id="gs-video-heading">Míralo antes de elegir</h2></div>
        <div className="gs-video-arrows">
          <button type="button" title="Videos anteriores" aria-label="Videos anteriores" onClick={() => strip.current?.scrollBy({ left: -360, behavior: "smooth" })}>←</button>
          <button type="button" title="Más videos" aria-label="Más videos" onClick={() => strip.current?.scrollBy({ left: 360, behavior: "smooth" })}>→</button>
        </div>
      </div>
      <div className="gs-video-strip" ref={strip}>
        {videos.map((product) => (
          <article className="gs-video-card" key={idOf(product)}>
            <button className="gs-video-poster" type="button" onClick={(event) => open(product, event)} aria-label={`Ver video: ${product.name}`}>
              <img src={getProductImageUrl(product.image, 480)} alt={product.name} loading="lazy" decoding="async" onError={useProductImageFallback} />
              <span className="gs-video-play" aria-hidden="true">▶</span>
              <span className="gs-video-tag">Ver video</span>
            </button>
            <div className="gs-video-card-info"><Link to={`/producto/${idOf(product)}`}>{product.name}</Link><strong>{priceOf(product)}</strong></div>
          </article>
        ))}
      </div>
      {active && (
        <dialog ref={dialog} className="gs-video-dialog" aria-labelledby="gs-active-video-title" onCancel={() => setActiveId(null)} onClose={() => setActiveId(null)} onClick={(event) => { if (event.target === dialog.current) setActiveId(null); }}>
          <div className="gs-video-dialog-body">
            <div className="gs-video-dialog-top"><span>Global-GS Store · {index + 1}/{videos.length}</span><button autoFocus type="button" title="Cerrar video" aria-label="Cerrar video" onClick={() => setActiveId(null)}>×</button></div>
            <div className="gs-video-stage">
              <video key={activeId} ref={videoRef} src={getProductVideoUrl(active.video)} poster={getProductImageUrl(active.image, 720)} controls playsInline autoPlay muted preload="metadata" aria-label={`Video de ${active.name}`} onError={() => setFailedId(activeId)} />
            </div>
            <div className="gs-video-dialog-info">
              <span className="gs-video-eyebrow">{active.category}</span>
              <h3 id="gs-active-video-title">{active.name}</h3>
              <strong className="gs-video-price">{priceOf(active)}</strong>
              {failedId === activeId && <p role="alert">No pudimos reproducir el video. Puedes ver las fotos en la ficha del producto.</p>}
              {usingFallback && <p className="gs-video-availability">Confirma precio y existencia por WhatsApp.</p>}
              <div className="gs-video-actions"><Link to={`/producto/${activeId}`}>Ver ficha</Link><button type="button" disabled={Number(active.stock || 0) <= 0} onClick={() => onBuy(active)}>{Number(active.stock || 0) > 0 ? "Comprar por WhatsApp" : "Producto agotado"}</button></div>
              {videos.length > 1 && <nav className="gs-video-pagination" aria-label="Cambiar video"><button type="button" onClick={() => move(-1)}>← Anterior</button><span>{index + 1} de {videos.length}</span><button type="button" onClick={() => move(1)}>Siguiente →</button></nav>}
            </div>
          </div>
        </dialog>
      )}
    </section>
  );
}
