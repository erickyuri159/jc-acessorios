"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FaceLandmarker } from "@mediapipe/tasks-vision";
import { PieceImage } from "@/components/ui/PieceImage";
import { formatPrice, type Product } from "@/data/products";
import {
  FACE_SHAPE_LABELS,
  analyseFace,
  recommendProducts,
  type FaceAnalysis,
} from "@/lib/face";
import { cameraErrorMessage, createFaceLandmarker } from "@/lib/faceLandmarker";

type TryOnStudioProps = {
  products: Product[];
  initialSlug?: string;
};

type Mode = "camera" | "photo";

type DrawState = {
  image: HTMLImageElement | null;
  product: Product | null;
  sizeMul: number;
  offsetMul: number;
};

/**
 * Probador de joyería en realidad aumentada.
 *
 * Funciona íntegramente en el navegador: el modelo de rostro se
 * descarga del propio servidor, la imagen de la cámara no sale del
 * dispositivo y las piezas se dibujan sobre un lienzo.
 */
export function TryOnStudio({ products, initialSlug }: TryOnStudioProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const landmarkerRef = useRef<FaceLandmarker | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const photoRef = useRef<HTMLImageElement | null>(null);
  const frameRef = useRef(0);

  const [mode, setMode] = useState<Mode>("camera");
  const [status, setStatus] = useState<"idle" | "starting" | "ready" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Product>(
    () =>
      products.find((product) => product.slug === initialSlug) ??
      // Al abrir, se muestra un collar: es la pieza que mejor se
      // entiende de un vistazo y la que más se prueba.
      products.find(
        (product) => product.arType === "necklace" && product.isDemo,
      ) ??
      products.find((product) => product.arType === "necklace") ??
      products[0],
  );
  const [sizeMul, setSizeMul] = useState(1);
  const [offsetMul, setOffsetMul] = useState(0);
  const [analysis, setAnalysis] = useState<FaceAnalysis | null>(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [photoReady, setPhotoReady] = useState(false);

  // Refs con los valores que usa el bucle de dibujo: así el bucle
  // no se reinicia cada vez que el usuario toca un control.
  const drawState = useRef<DrawState>({
    image: null,
    product: null,
    sizeMul: 1,
    offsetMul: 0,
  });

  useEffect(() => {
    drawState.current.sizeMul = sizeMul;
    drawState.current.offsetMul = offsetMul;
    drawState.current.product = selected;
  }, [sizeMul, offsetMul, selected]);

  /* ------------------------------------------------------------
   * Carga de la imagen de la pieza (con fondo transparente)
   * ---------------------------------------------------------- */
  useEffect(() => {
    const source = selected.arImage ?? selected.image;
    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
    };
    img.src = source;
    return () => {
      img.onload = null;
    };
  }, [selected]);

  /* ------------------------------------------------------------
   * Dibujo del AR
   * ---------------------------------------------------------- */
  const drawOverlays = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      landmarks: { x: number; y: number; z: number }[],
      width: number,
      height: number,
    ) => {
      const image = imageRef.current;
      const product = drawState.current.product;
      if (!image || !product || !image.complete || !image.naturalWidth) return;

      // El lienzo se dibuja en espejo (vista de selfie), así que los
      // landmarks se pasan de x a (1 - x) para que cuadren.
      const point = (index: number) => ({
        x: (1 - landmarks[index].x) * width,
        y: landmarks[index].y * height,
      });
      const rawPoint = (index: number) => ({
        x: landmarks[index].x * width,
        y: landmarks[index].y * height,
      });
      const depth = (index: number) => landmarks[index].z * width;

      const left = point(234);
      const right = point(454);
      const chin = point(152);
      const forehead = point(10);

      const faceWidth = Math.hypot(right.x - left.x, right.y - left.y);
      if (faceWidth <= 0) return;

      // Altura de la cara (frente → barbilla): sirve para que un
      // collar caiga hacia el pecho en lugar de quedarse en el
      // mentón, sea cual sea el largo de la foto de la pieza.
      const faceHeight = Math.max(
        Math.hypot(chin.x - forehead.x, chin.y - forehead.y),
        faceWidth,
      );

      // Inclinación de la cabeza: se toma el eje del rostro en
      // coordenadas sin espejo y se normaliza a ±90°.
      const rawLeft = rawPoint(234);
      const rawRight = rawPoint(454);
      let tilt = Math.atan2(rawRight.y - rawLeft.y, rawRight.x - rawLeft.x);
      if (tilt > Math.PI / 2) tilt -= Math.PI;
      if (tilt < -Math.PI / 2) tilt += Math.PI;

      const rotation = -tilt;
      const down = { x: Math.sin(tilt), y: Math.cos(tilt) };

      const depthLeft = depth(234);
      const depthRight = depth(454);
      const depthAverage = (depthLeft + depthRight) / 2;

      const type = product.arType ?? "earring";
      const base = product.arScale ?? 0.35;
      const { sizeMul: size, offsetMul: offset } = drawState.current;

      ctx.save();

      if (type === "necklace") {
        // El collar cuelga del cuello: cuanto más largo sea el
        // recorte (relación alto/ancho), más baja la pieza hacia
        // el pecho en vez de quedarse encima de la barbilla.
        const aspect = image.naturalHeight / image.naturalWidth;
        const lengthFactor = Math.min(Math.max(aspect / 1.5, 0.8), 2.2);
        const neckGap = faceHeight * 0.16;
        const dropBase = faceHeight * 0.22 * (lengthFactor - 1);

        const width =
          faceWidth * base * 1.6 * size * Math.min(lengthFactor, 1.35);
        const height = width * aspect;
        const centerX = (left.x + right.x) / 2;
        const anchor = {
          x: centerX + down.x * neckGap,
          y:
            chin.y +
            down.y * neckGap +
            dropBase +
            faceHeight * 0.05 * offset,
        };
        ctx.translate(anchor.x, anchor.y);
        ctx.rotate(rotation);
        ctx.drawImage(image, -width / 2, 0, width, height);
      } else {
        const height = faceWidth * base * size;
        const width = height * (image.naturalWidth / image.naturalHeight);

        for (const [ear, earDepth] of [
          [left, depthLeft],
          [right, depthRight],
        ] as const) {
          // La oreja más cercana al cámara se dibuja algo mayor.
          const perspective = Math.min(
            Math.max(1 - (earDepth - depthAverage) * 0.9, 0.6),
            1.6,
          );
          const anchor = {
            x: ear.x + down.x * faceWidth * 0.015,
            y:
              ear.y +
              down.y * faceWidth * 0.015 +
              faceWidth * 0.012 * offset,
          };

          ctx.save();
          ctx.translate(anchor.x, anchor.y);
          ctx.rotate(rotation);
          ctx.drawImage(
            image,
            (-width * perspective) / 2,
            0,
            width * perspective,
            height * perspective,
          );
          ctx.restore();
        }
      }

      ctx.restore();
    },
    [],
  );

  /* ------------------------------------------------------------
   * Cámara
   * ---------------------------------------------------------- */
  useEffect(() => {
    if (mode !== "camera") return;

    let cancelled = false;
    let raf = 0;
    let stream: MediaStream | null = null;

    async function start() {
      setStatus("starting");
      setError(null);

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 960 },
          },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;
        await video.play();

        const landmarker = await createFaceLandmarker("VIDEO");
        if (cancelled) {
          landmarker.close();
          return;
        }

        landmarkerRef.current = landmarker;
        setStatus("ready");

        const loop = () => {
          raf = requestAnimationFrame(loop);

          const canvas = canvasRef.current;
          const videoElement = videoRef.current;
          if (!canvas || !videoElement || !landmarkerRef.current) return;
          if (videoElement.readyState < 2) return;

          const width = videoElement.videoWidth;
          const height = videoElement.videoHeight;
          if (!width || !height) return;

          if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
          }

          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          ctx.save();
          ctx.clearRect(0, 0, width, height);
          ctx.translate(width, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(videoElement, 0, 0, width, height);
          ctx.restore();

          let landmarks: { x: number; y: number; z: number }[] | null = null;
          try {
            const result = landmarkerRef.current.detectForVideo(
              videoElement,
              performance.now(),
            );
            landmarks = result.faceLandmarks?.[0] ?? null;
          } catch {
            landmarks = null;
          }

          setFaceDetected(Boolean(landmarks));

          if (landmarks) {
            drawOverlays(ctx, landmarks, width, height);

            frameRef.current += 1;
            if (frameRef.current % 15 === 0) {
              const result = analyseFace(landmarks, width, height);
              if (result) setAnalysis(result);
            }
          }
        };

        raf = requestAnimationFrame(loop);
      } catch (caught) {
        setError(cameraErrorMessage(caught));
        setStatus("error");
      }
    }

    start();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      stream?.getTracks().forEach((track) => track.stop());
      landmarkerRef.current?.close();
      landmarkerRef.current = null;
    };
  }, [mode, drawOverlays]);

  /* ------------------------------------------------------------
   * Modo foto
   * ---------------------------------------------------------- */
  const handlePhoto = useCallback(
    async (file: File) => {
      setError(null);
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.src = url;

      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });

      if (!img.naturalWidth) {
        URL.revokeObjectURL(url);
        setError("No se ha podido leer la imagen. Prueba con otra foto.");
        return;
      }

      photoRef.current = img;
      setPhotoReady(true);
      setMode("photo");
      setFaceDetected(false);
      setAnalysis(null);

      try {
        const landmarker = await createFaceLandmarker("IMAGE");
        const result = landmarker.detect(img);
        landmarker.close();

        const landmarks = result.faceLandmarks?.[0] ?? null;
        setFaceDetected(Boolean(landmarks));
        if (landmarks) {
          const result2 = analyseFace(landmarks, img.naturalWidth, img.naturalHeight);
          if (result2) setAnalysis(result2);
        } else {
          setError(
            "No hemos detectado una cara en la foto. Prueba con una imagen de frente y bien iluminada.",
          );
        }
      } catch {
        setError("No se ha podido analizar la foto.");
      }
    },
    [],
  );

  // Dibujo del modo foto.
  useEffect(() => {
    if (mode !== "photo" || !photoReady) return;
    const photo = photoRef.current;
    const canvas = canvasRef.current;
    if (!photo || !canvas) return;

    const width = photo.naturalWidth;
    const height = photo.naturalHeight;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(photo, 0, 0, width, height);

    const landmarker = landmarkerRef.current;
    if (landmarker) {
      const result = landmarker.detect(photo);
      const landmarks = result.faceLandmarks?.[0];
      if (landmarks) {
        drawOverlays(ctx, landmarks, width, height);
      }
    }
  }, [mode, photoReady, drawOverlays]);

  /* ------------------------------------------------------------
   * Captura y compartir
   * ---------------------------------------------------------- */
  const capture = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], "jp-accesorios-probador.jpg", {
        type: "image/jpeg",
      });

      if (typeof navigator !== "undefined" && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: "JP Accesorios" });
          return;
        } catch {
          // El usuario canceló el diálogo: se pasa a la descarga.
        }
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "jp-accesorios-probador.jpg";
      link.click();
      URL.revokeObjectURL(url);
    }, "image/jpeg", 0.92);
  }, []);

  const recommended = useMemo(
    () =>
      recommendProducts(products, analysis)
        .filter((product) => !product.isDemo)
        .slice(0, 4),
    [products, analysis],
  );

  const onFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) void handlePhoto(file);
      event.target.value = "";
    },
    [handlePhoto],
  );

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      {/* ---------------------------------------------------- */}
      {/* Escenario                                            */}
      {/* ---------------------------------------------------- */}
      <div className="lg:col-span-7">
        <div className="ar-stage hud-marco relative overflow-hidden rounded-sm border border-linea">
          <canvas
            ref={canvasRef}
            className="ar-canvas block h-full w-full object-contain"
            style={{ aspectRatio: "4 / 5" }}
          />

          <video
            ref={videoRef}
            playsInline
            muted
            className="pointer-events-none absolute h-0 w-0 opacity-0"
            aria-hidden="true"
          />

          <div className="scanline" aria-hidden="true" />
          <div className="scanline-barrido" aria-hidden="true" />

          {/* Marco de instrumento: esquinas y lecturas. */}
          <div
            className="pointer-events-none absolute inset-3"
            aria-hidden="true"
          >
            <span className="absolute top-0 left-0 h-6 w-6 border-t border-l border-oro/70" />
            <span className="absolute top-0 right-0 h-6 w-6 border-t border-r border-oro/70" />
            <span className="absolute bottom-0 left-0 h-6 w-6 border-b border-l border-oro/70" />
            <span className="absolute right-0 bottom-0 h-6 w-6 border-r border-b border-oro/70" />
          </div>

          {/* Lecturas en vivo. */}
          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between gap-3 border-b border-linea bg-noche/70 px-4 py-2.5 backdrop-blur">
            <span className="flex items-center gap-2 text-[0.625rem] font-bold uppercase tracking-[0.18em] text-humo">
              <span
                className={`punto-estado ${
                  faceDetected ? "" : "punto-estado--pedido"
                }`}
                aria-hidden="true"
              />
              {faceDetected ? "Rostro fijado" : "Buscando rostro"}
            </span>
            <span className="text-[0.625rem] font-bold uppercase tracking-[0.18em] text-oro">
              {mode === "camera" ? "Cámara en vivo" : "Foto fija"}
            </span>
          </div>

          {status === "starting" ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-marfil">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-oro border-t-transparent" />
              <p className="text-sm text-humo">
                Activando la cámara y cargando el detector…
              </p>
            </div>
          ) : null}

          {status === "idle" ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 text-center text-marfil">
              <p className="font-display text-2xl">El probador está listo</p>
              <p className="max-w-xs text-sm text-humo">
                Activa la cámara para verte las piezas en la cara, o sube una
                foto tuya.
              </p>
            </div>
          ) : null}

          {mode === "camera" && status === "ready" && !faceDetected ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-noche/80 p-4 text-center text-sm text-marfil/90 backdrop-blur">
              Coloca tu cara dentro del encuadre para empezar.
            </div>
          ) : null}
        </div>

        {error ? (
          <p
            role="alert"
            className="mt-4 rounded-sm border border-rubi/30 bg-rubi/10 px-4 py-3 text-sm text-rubi"
          >
            {error}
          </p>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <label className="btn-outline cursor-pointer">
            Subir una foto
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={onFileChange}
            />
          </label>

          {mode === "photo" ? (
            <button
              type="button"
              onClick={() => {
                setMode("camera");
                setPhotoReady(false);
              }}
              className="btn-outline"
            >
              Volver a la cámara
            </button>
          ) : null}

          <button
            type="button"
            onClick={() => void capture()}
            className="btn-prisma"
          >
            Guardar foto
          </button>
        </div>

        {/* Controles de ajuste */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <label className="block">
            <span className="flex items-center justify-between text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-humo">
              Tamaño
              <span className="tabular-nums text-oro">{sizeMul.toFixed(2)}×</span>
            </span>
            <input
              type="range"
              min={0.5}
              max={1.8}
              step={0.02}
              value={sizeMul}
              onChange={(event) => setSizeMul(Number(event.target.value))}
              className="mt-3 w-full accent-[#e7be6a]"
            />
          </label>

          <label className="block">
            <span className="flex items-center justify-between text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-humo">
              Altura
              <span className="tabular-nums text-oro">
                {offsetMul > 0 ? "+" : ""}
                {offsetMul.toFixed(1)}
              </span>
            </span>
            <input
              type="range"
              min={-4}
              max={12}
              step={0.1}
              value={offsetMul}
              onChange={(event) => setOffsetMul(Number(event.target.value))}
              className="mt-3 w-full accent-[#e7be6a]"
            />
          </label>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* Panel lateral                                        */}
      {/* ---------------------------------------------------- */}
      <div className="lg:col-span-5">
        <h2 className="label text-oro">Elige la pieza</h2>

        <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-3">
          {products.map((product) => {
            const active = product.id === selected.id;
            return (
              <li key={product.id}>
                <button
                  type="button"
                  onClick={() => setSelected(product)}
                  aria-pressed={active}
                  className={`block w-full overflow-hidden rounded-sm border p-2 transition-colors ${
                    active
                      ? "border-oro bg-oro/10"
                      : "border-linea bg-noche-2 hover:border-oro/60"
                  }`}
                >
                  <span className="piece-frame relative block aspect-square overflow-hidden rounded-sm">
                    <PieceImage
                      src={product.arImage ?? product.image}
                      alt=""
                      className="object-contain p-1"
                      sizes="120px"
                    />
                    {product.isDemo ? (
                      <span className="absolute inset-x-0 bottom-0 bg-noche/85 py-1 text-center text-[0.5625rem] font-bold tracking-[0.14em] uppercase text-oro">
                        Ejemplo
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-2 block truncate text-[0.6875rem] font-semibold text-marfil">
                    {product.name}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {selected.isDemo ? (
          <p className="mt-4 rounded-sm border border-oro/30 bg-oro/5 px-4 py-3 text-sm leading-relaxed text-humo">
            <span className="font-semibold text-oro">Pieza de ejemplo.</span>{" "}
            Está aquí para que veas cómo funciona el probador. No forma parte de
            la colección ni se puede comprar.
          </p>
        ) : null}

        {/* Resultado del análisis */}
        <div className="relative mt-8 overflow-hidden rounded-sm border border-linea bg-noche-2 p-6">
          <div
            className="pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full bg-prisma opacity-20 blur-[60px]"
            aria-hidden="true"
          />
          <div className="relative">
            {analysis ? (
              <>
                <p className="label text-oro">Tu forma de rostro</p>
                <h3 className="font-display mt-2 text-2xl text-marfil">
                  {FACE_SHAPE_LABELS[analysis.shape]}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-humo">
                  {analysis.advice}
                </p>
              </>
            ) : (
              <p className="text-sm text-humo">
                Cuando el probador detecte tu rostro, te dirá qué piezas te
                favorecen y por qué.
              </p>
            )}
          </div>
        </div>

        {analysis ? (
          <>
            <h3 className="label mt-8 text-oro">Recomendado para tu rostro</h3>
            <ul className="mt-4 space-y-3">
              {recommended.map((product) => (
                <li key={product.id}>
                  <Link
                    href={`/producto/${product.slug}`}
                    className="flex items-center gap-4 rounded-sm border border-linea bg-noche-2 p-3 transition-colors hover:border-oro"
                  >
                    <span className="piece-frame relative h-16 w-16 shrink-0 overflow-hidden rounded-sm">
                      <PieceImage
                        src={product.image}
                        alt=""
                        className="object-contain p-1"
                        sizes="64px"
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold text-marfil">
                        {product.name}
                      </span>
                      <span className="block text-sm text-oro">
                        {formatPrice(product.price)}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>
    </div>
  );
}
