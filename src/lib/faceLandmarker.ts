// ============================================================
// MEDIAPIPE FACE LANDMARKER
// ------------------------------------------------------------
// El detector de rostros se carga desde el propio servidor
// (public/mediapipe/wasm y public/models). Nada se descarga de
// terceros ni se envía a ningún servidor: el análisis ocurre
// entero en el navegador, que es lo que permite cumplir el
// RGPD sin letra pequeña.
// ============================================================

import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

const WASM_PATH = "/mediapipe/wasm";
const MODEL_PATH = "/models/face_landmarker.task";

type Fileset = Awaited<ReturnType<typeof FilesetResolver.forVisionTasks>>;

let filesetPromise: Promise<Fileset> | null = null;

function loadFileset() {
  if (!filesetPromise) {
    filesetPromise = FilesetResolver.forVisionTasks(WASM_PATH);
  }
  return filesetPromise;
}

/**
 * Crea un detector de rostros.
 *
 * Se intenta primero con la GPU (mucho más fluido) y se cae a CPU
 * automáticamente cuando el dispositivo no lo soporta.
 */
export async function createFaceLandmarker(
  mode: "VIDEO" | "IMAGE",
): Promise<FaceLandmarker> {
  const vision = await loadFileset();

  const options = (delegate: "GPU" | "CPU") => ({
    baseOptions: { modelAssetPath: MODEL_PATH, delegate },
    runningMode: mode,
    numFaces: 1,
    minFaceDetectionConfidence: 0.4,
    minFacePresenceConfidence: 0.4,
    minTrackingConfidence: 0.4,
  });

  try {
    return await FaceLandmarker.createFromOptions(vision, options("GPU"));
  } catch {
    return await FaceLandmarker.createFromOptions(vision, options("CPU"));
  }
}

/** Mensaje de error legible para la cliente. */
export function cameraErrorMessage(error: unknown): string {
  if (error instanceof DOMException) {
    if (error.name === "NotAllowedError") {
      return "El navegador no nos deja usar la cámara. Actívala desde el candado de la barra de direcciones y vuelve a intentarlo.";
    }
    if (error.name === "NotFoundError") {
      return "No encontramos ninguna cámara en este dispositivo. Puedes subir una foto para probar las piezas.";
    }
    if (error.name === "NotReadableError") {
      return "Otra aplicación está usando la cámara. Ciérrala y vuelve a intentarlo.";
    }
  }
  return "No se ha podido iniciar la cámara. Puedes subir una foto para probar las piezas.";
}
