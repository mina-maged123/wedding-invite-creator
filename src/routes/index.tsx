import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Heart, MapPin, Music2, VolumeX, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { weddingConfig as config } from "@/lib/wedding-config";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bebo & Lucy — Wedding Invitation" },
      {
        name: "description",
        content:
          "You're invited to the wedding of Bebo & Lucy — Sunday, October 11, 2026 at Saint George's Church, 8:00 PM.",
      },
      { property: "og:title", content: "Bebo & Lucy — Wedding Invitation" },
      {
        property: "og:description",
        content:
          "You're invited to the wedding of Bebo & Lucy — Sunday, October 11, 2026 at Saint George's Church, 8:00 PM.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

type Countdown = { days: number; hours: number; minutes: number; seconds: number; complete: boolean };

function getCountdown(): Countdown {
  const distance = new Date(config.countdownDate).getTime() - Date.now();
  if (distance <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, complete: true };
  return {
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor((distance / 3_600_000) % 24),
    minutes: Math.floor((distance / 60_000) % 60),
    seconds: Math.floor((distance / 1_000) % 60),
    complete: false,
  };
}

function Names({ light = false }: { light?: boolean }) {
  return (
    <span className={light ? "names names-light" : "names"}>
      {config.groom} <span>&amp;</span> {config.bride}
    </span>
  );
}

function Divider({ heart = false }: { heart?: boolean }) {
  return (
    <div className="ornament" aria-hidden="true">
      <i />
      {heart ? <Heart fill="currentColor" /> : <b />}
      <i />
    </div>
  );
}

function SectionHeading({ label, title }: { label: string; title: string }) {
  return (
    <header className="section-heading reveal">
      <p>{label}</p>
      <h2>{title}</h2>
      <Divider />
    </header>
  );
}

function Index() {
  const [entered, setEntered] = useState(false);
  const [muted, setMuted] = useState(true);
  const [countdown, setCountdown] = useState<Countdown>({ days: 0, hours: 0, minutes: 0, seconds: 0, complete: false });
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const touchStart = useRef<number | null>(null);
  const gallery = useMemo(() => Array.from({ length: 8 }, (_, index) => config.gallery[index % config.gallery.length]), []);

  useEffect(() => {
    setCountdown(getCountdown());
    const interval = window.setInterval(() => setCountdown(getCountdown()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!entered) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { threshold: 0.12 },
    );
    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [entered]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxIndex(null);
      if (event.key === "ArrowRight") setLightboxIndex((lightboxIndex + 1) % gallery.length);
      if (event.key === "ArrowLeft") setLightboxIndex((lightboxIndex - 1 + gallery.length) % gallery.length);
    };
    document.body.classList.add("lightbox-open");
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("lightbox-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [gallery.length, lightboxIndex]);

  const seekedRef = useRef(false);

  const applyStartTime = (audio: HTMLAudioElement) => {
    if (!seekedRef.current && audio.readyState >= 1) {
      audio.currentTime = config.musicStartAt;
      seekedRef.current = true;
    }
  };

  const enterInvitation = () => {
    setEntered(true);
    const audio = audioRef.current;
    if (!config.musicUrl || !audio) return;
    applyStartTime(audio);
    const tryPlay = () => audio.play().then(() => setMuted(false)).catch(() => setMuted(true));
    tryPlay().then(() => {
      if (audio.paused) audio.addEventListener("canplay", () => void tryPlay(), { once: true });
    });
  };

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!config.musicUrl || !audio) return;
    if (audio.paused) {
      audio.play().then(() => setMuted(false)).catch(() => setMuted(true));
      return;
    }
    audio.muted = !audio.muted;
    setMuted(audio.muted);
  };

  const shiftLightbox = (amount: number) => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + amount + gallery.length) % gallery.length);
  };

  return (
    <div className="invitation">
      {config.musicUrl ? (
        <audio ref={audioRef} src={config.musicUrl} loop preload="auto" onLoadedMetadata={(event) => applyStartTime(event.currentTarget)} />
      ) : null}

      <div className={`welcome ${entered ? "welcome-hidden" : ""}`} aria-hidden={entered}>
        <div className="welcome-border" />
        <div className="welcome-content">
          <p className="eyebrow">The Wedding of</p>
          <h1><Names light /></h1>
          <Divider heart />
          <p className="welcome-date">{config.displayDate}</p>
          <Button className="enter-button" onClick={enterInvitation}>Enter</Button>
        </div>
      </div>

      {entered ? (
        <Button
          size="icon"
          variant="outline"
          className="music-toggle"
          onClick={toggleMusic}
          aria-label={config.musicUrl ? (muted ? "Play music" : "Pause music") : "Music coming soon"}
          title={config.musicUrl ? (muted ? "Play music" : "Pause music") : "Music coming soon"}
        >
          {config.musicUrl && !muted ? <Music2 /> : <VolumeX />}
        </Button>
      ) : null}

      <main className={entered ? "main-visible" : "main-hidden"}>
        <section className="hero-section">
          <div className="sparkles" aria-hidden="true">
            {Array.from({ length: 14 }, (_, index) => <span key={index} />)}
          </div>
          <div className="hero-content reveal is-visible">
            <p className="eyebrow">Together with their families</p>
            <h1><Names /></h1>
            <Divider heart />
            <p className="hero-date">{config.shortDate.toUpperCase()}</p>
            <p className="tagline">{config.tagline}</p>
          </div>
          <div className="countdown reveal is-visible" aria-label="Wedding countdown">
            {countdown.complete ? (
              <p className="today-message">Today is the day!</p>
            ) : (
              (["days", "hours", "minutes", "seconds"] as const).map((unit) => (
                <div className="countdown-card" key={unit}>
                  <strong>{String(countdown[unit]).padStart(2, "0")}</strong>
                  <span>{unit}</span>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="story-section">
          <SectionHeading label="Our Story" title="A Journey of Moments" />
          <div className="timeline">
            {config.memories.map((memory, index) => (
              <article className={`memory reveal memory-${index % 2 ? "right" : "left"}`} key={memory.caption}>
                <span className="timeline-diamond" />
                <figure>
                  <img src={memory.image} alt={`${config.groom} and ${config.bride}: ${memory.caption}`} loading="lazy" decoding="async" />
                  <figcaption>{memory.caption}</figcaption>
                </figure>
              </article>
            ))}
          </div>
        </section>

        <section className="gallery-section">
          <SectionHeading label="Together" title="Our Gallery" />
          <div className="gallery-grid reveal">
            {gallery.map((image, index) => (
              <button className={`gallery-item gallery-item-${(index % 4) + 1}`} key={index} onClick={() => setLightboxIndex(index)} aria-label={`Open gallery photo ${index + 1}`}>
                <img src={image} alt={`${config.groom} and ${config.bride}, gallery photo ${index + 1}`} loading="lazy" decoding="async" />
              </button>
            ))}
          </div>
        </section>

        <section className="details-section">
          <SectionHeading label="When & Where" title="Wedding Details" />
          <div className="details-grid">
            {[config.ceremony, config.reception].map((venue) => (
              <article className="venue-card reveal" key={venue.title}>
                <MapPin aria-hidden="true" />
                <h3>{venue.title}</h3>
                <Divider />
                <p>{venue.place}</p>
                <time>{venue.time}</time>
                <Button asChild variant="outline" className="directions-button">
                  <a href={venue.directions} target="_blank" rel="noreferrer">Get Directions</a>
                </Button>
              </article>
            ))}
          </div>
        </section>

        <footer>
          <Heart fill="currentColor" aria-hidden="true" />
          <p className="footer-credit">
            <span>Made by Mina Maged William</span>
            <a href="tel:+201206132194">01206132194</a>
          </p>
        </footer>
      </main>

      {lightboxIndex !== null ? (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo gallery">
          <Button size="icon" variant="ghost" className="lightbox-close" onClick={() => setLightboxIndex(null)} aria-label="Close gallery"><X /></Button>
          <Button size="icon" variant="ghost" className="lightbox-prev" onClick={() => shiftLightbox(-1)} aria-label="Previous photo"><ChevronLeft /></Button>
          <div
            className="lightbox-image-wrap"
            onTouchStart={(event) => { touchStart.current = event.changedTouches[0]?.clientX ?? null; }}
            onTouchEnd={(event) => {
              const end = event.changedTouches[0]?.clientX;
              if (touchStart.current !== null && end !== undefined && Math.abs(touchStart.current - end) > 45) shiftLightbox(touchStart.current > end ? 1 : -1);
              touchStart.current = null;
            }}
          >
            <img src={gallery[lightboxIndex]} alt={`Gallery photo ${lightboxIndex + 1} of ${gallery.length}`} />
            <span>{lightboxIndex + 1} / {gallery.length}</span>
          </div>
          <Button size="icon" variant="ghost" className="lightbox-next" onClick={() => shiftLightbox(1)} aria-label="Next photo"><ChevronRight /></Button>
        </div>
      ) : null}
    </div>
  );
}
