# JP Accesorios

Web de venta de bisutería y joyería para **JP Accesorios** (Mislata, Valencia).
Next.js 16 (App Router) + TypeScript + Tailwind v4 + Sanity + MediaPipe.

Dos objetivos a la vez:

1. **Vender**: catálogo, probador de realidad aumentada, pedido por WhatsApp +
   Bizum, programa de fidelidad y páginas legales listas para España.
2. **Demostrar**: es el escaparate del servicio de diseño y desarrollo web —
   por eso el código está comentado en español y cada decisión técnica está
   justificada en el propio repo.

---

## Puesta en marcha

```bash
npm install
cp .env.example .env.local   # opcional: sin esto funciona igual
npm run dev                  # http://localhost:3000
```

Comandos disponibles:

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Sirve el build |
| `npm run lint` | ESLint (Next + TypeScript) |
| `npm run typecheck` | `tsc --noEmit` |

## Dónde se toca todo

| Fichero | Contenido |
| --- | --- |
| `src/data/business.ts` | Datos de la tienda: nombre, CIF, dirección, teléfono, WhatsApp, email, horarios, envíos, pagos |
| `src/data/site.ts` | Todos los textos visibles de la web |
| `src/data/products.ts` | Catálogo (8 piezas de **demostración**) |
| `src/lib/content.ts` | Fuente de verdad: Sanity si está configurado, `src/data/` si no |
| `studio/` | Panel de edición (Sanity Studio) |

> Los datos de la tienda que aún no están confirmados aparecen entre
> corchetes: `[ CIF / NIF ]`, `[ TELÉFONO ]`, `[ EMAIL DE CONTACTO ]`…
> Basta con sustituirlos en `src/data/business.ts` (o en el panel) para que
> desaparezcan de la web.

## Rutas

| Ruta | Qué es |
| --- | --- |
| `/` | Portada: hero, categorías, catálogo, probador, forma de rostro, passport, envíos, Instagram, contacto |
| `/coleccion` | Catálogo con filtro por categoría (`?categoria=anillos`) |
| `/producto/[slug]` | Ficha de producto con SEO, breadcrumbs y piezas relacionadas |
| `/provador` | Probador de realidad aumentada (cámara + subida de foto) |
| `/como-comprar` | Guía de compra, envíos y preguntas frecuentes |
| `/aviso-legal`, `/politica-de-privacidad`, `/politica-de-cookies`, `/condiciones-de-venta` | Páginas legales (LSSI + RGPD + desistimiento) |
| `/api/instagram/media` | Publicaciones recientes de Instagram, ya interpretadas como productos |
| `/api/instagram/import` | Crea/actualiza fichas de producto en Sanity desde Instagram |

## El probador de realidad aumentada

- **MediaPipe Face Landmarker** (modelo `.task` + WASM) servido desde
  `public/` — sin CDN de terceros, sin enviar la imagen a ningún servidor.
- Detecta la cara, calcula posición, escala, inclinación y profundidad; la
  pieza se ancla a la oreja, al cuello, a la muñeca o al dedo.
- Tiras de control de **tamaño** y **altura** para ajustar la prueba.
- Captura y **compartir en Stories** sin salir de la web.
- Clasifica la **forma del rostro** (ovalada, redonda, cuadrada, corazón,
  afilada) y recomienda piezas según las etiquetas de estilo de cada producto.

Los pesos del modelo están en `public/models/face_landmarker.task` y el WASM
en `public/mediapipe/wasm/`.

## Sanity (panel de edición)

Guía paso a paso para la dueña: **[`docs/GUIA-SANITY.md`](docs/GUIA-SANITY.md)**.

```bash
cd studio
npm install
cp .env.example .env   # rellenar SANITY_STUDIO_PROJECT_ID
npm run dev            # http://localhost:3333
```

- `studio/schemas/siteConfig.ts`: documento único con datos, textos, SEO,
  envíos y pagos.
- `studio/schemas/product.ts`: ficha de producto (incluye la imagen para AR).
- `studio/tools/instagramImport.tsx`: herramienta **«Importar desde
  Instagram»** que trae las publicaciones de la tienda como fichas.

Para que la web use el panel basta con definir `SANITY_PROJECT_ID` y
`SANITY_DATASET` en `.env.local`. Si el panel no está configurado, la web usa
`src/data/` y nunca se rompe.

### Importar desde Instagram

1. Crear una app en [developers.facebook.com](https://developers.facebook.com)
   y vincular la cuenta de Instagram de la tienda.
2. Generar un token con el permiso `instagram_basic`.
3. Definir `INSTAGRAM_ACCESS_TOKEN` y `SANITY_API_WRITE_TOKEN` en el servidor.
4. En el panel: «Importar desde Instagram» → seleccionar → importar.

El importador lee el pie de foto, extrae **nombre**, **precio** y
**categoría**, descarga la imagen (las URLs de Instagram caducan a las 24 h)
y la sube al asset de Sanity. Las fichas quedan **en borrador** para que la
dueña las revise antes de publicar.

## Despliegue en Vercel

```bash
npm i -g vercel
vercel
```

Variables de entorno en el panel de Vercel (Production y Preview):

```
SANITY_PROJECT_ID
SANITY_DATASET
Sanity_API_WRITE_TOKEN     (solo si usas el importador)
INSTAGRAM_ACCESS_TOKEN     (solo si usas el importador)
SANITY_REVALIDATE_SECRET   (webhook: publicar → web al instante)
```

### Publicación instantánea

La web revalida cada 60 s. Para que «Publish» se refleje al momento, crea un
webhook en Sanity (API → Webhooks) apuntando a
`https://TU-DOMINIO/api/revalidate?secret=SANITY_REVALIDATE_SECRET`, con el
filtro `_type in ["product", "siteConfig"]` y disparadores create/update/delete.

El panel (Studio) se despliega aparte, como otro proyecto de Vercel con
directorio `studio/` (usa `studio/vercel.json`).

## Datos pendientes de confirmar

- [ ] Razón social, CIF/NIF y domicilio fiscal
- [ ] Teléfono / WhatsApp y correo de contacto
- [ ] Horario de apertura
- [ ] Coordenadas exactas (mapa) o enlace al perfil de Google Maps
- [ ] Móvil de Bizum y/o enlace de pago de Bizum
- [ ] Coste de envío por zona y umbral de envío gratuito
- [ ] Catálogo real con fotos (las actuales son SVG de demostración)
- [ ] Fotos con fondo transparente para el probador AR
- [ ] Régimen de IVA para ventas en la UE (IOSS) — consultar con la asesoría

## Documentación comercial

- [`docs/CASE-STUDY.md`](docs/CASE-STUDY.md): caso de estudio del proyecto
  (argumentos para vender servicios web a otras tiendas).
- [`docs/PITCH.md`](docs/PITCH.md): guion de venta y checklist de entrega.
