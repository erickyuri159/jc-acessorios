# Caso de estudio — JP Accesorios

**Web de venta de bisutería y joyería con probador de realidad aumentada**
Mislata (Valencia) · Next.js 16 · Sanity · MediaPipe · WhatsApp + Bizum

---

## 1. El problema

JP Accesorios vende por Instagram y por WhatsApp. Eso funciona hasta que
llega el momento de convertir:

- El catálogo existe en el feed, no en un sitio: **nadie puede buscar por
  «pendientes de oro»** ni compartir una ficha concreta.
- Cada venta exige una conversación: lista de piezas, precios, forma de pago,
  dirección de envío. La tienda pierde tiempo en lo mecánico.
- No hay ninguna señal de confianza: sin datos fiscales, sin política de
  privacidad, sin condiciones de venta. Para una tienda que **vende a toda
  España y a la Unión Europea**, eso no es un detalle: es un riesgo legal
  (LSSI, RGPD, IVA intracomunitario, derecho de desistimiento).
- El precio no está en la web, así que la tienda depende del directo para
  cerrar la venta.

## 2. La propuesta

Una web que hace tres cosas a la vez:

1. **Vende sin que la dueña esté delante.** Catálogo navegable, ficha de
   producto, cesta, y el pedido sale por WhatsApp ya escrito con el
   desglose. La dueña solo confirma disponibilidad y cobra.
2. **Enseña a probar.** Un probador de realidad aumentada en el navegador:
   la clienta se ve los pendientes puestos antes de comprarlos. Es la
   diferencia entre «me lo imagino» y «me lo veo».
3. **Cumple la norma.** Aviso legal, política de privacidad, política de
   cookies y condiciones de venta escritas para una tienda española que
   vende dentro y fuera de la UE.

Además, un **passport de fidelidad** local (sellos por cada 10 €) que
devuelve la compra y da un motivo para volver sin necesidad de un motor de
puntos complejo ni de una base de datos de clientes.

## 3. El probador de realidad aumentada (la pieza técnica)

Es el elemento que hace que esta web no sea «una tienda más».

| Decisión | Por qué |
| --- | --- |
| **MediaPipe Face Landmarker** (modelo `.task` + WASM) | Detector de rostros preciso, MIT/Apache, sin backend y sin coste por uso |
| **Todo en el cliente** (wasm + modelo en `public/`) | La imagen de la cámara **no sale del móvil**: es un argumento de privacidad vendible, además de una decisión de costes (0 € de GPU) |
| **Anclaje por landmark** (234/454) | La pieza se coloca sobre la oreja real, con inclinación y escala relativas al rostro, no pegada en el centro de la cara |
| **Tiras de tamaño y altura** | El AR siempre es una aproximación: el control manual es lo que convierte una demo en una herramienta de venta |
| **Clasificación de forma de rostro** | Convierte una curiosidad técnica en consejo de estilo: la web dice *qué te favorece*, no solo *cómo te queda* |
| **Compartir a Stories** | El bucle viral: la clienta publica su prueba y el post vuelve al feed de la tienda |

Restricciones reales que se respetaron: funciona en móvil sin app, en
HTTPS, con permiso de cámara explícito (`Permissions-Policy: camera=(self)`)
y sin ninguna llamada a un servidor con la imagen.

## 4. El catálogo conectado a Instagram

La tienda no va a mantener dos catálogos. El panel (**Sanity Studio**) tiene
una herramienta propia, **«Importar desde Instagram»**:

1. Lee las publicaciones recientes por la Graph API de Meta.
2. Interpreta el pie de foto: extrae **nombre**, **precio** (€12,50) y
   **categoría** (pendientes, collares, pulseras, anillos, sets).
3. Descarga la imagen (las URLs de Instagram caducan a las 24 h) y la sube al
   asset de Sanity: el catálogo deja de depender de Instagram.
4. Crea la ficha **en borrador** para que la dueña la revise y la publique.

Resultado: **lo que la tienda sube a Instagram aparece en la web el mismo
día**, sin trabajo duplicado. Es la diferencia entre un sitio que hay que
mantener y un sitio que se mantiene solo.

## 5. Decisiones de negocio

- **WhatsApp + Bizum en lugar de pasarela de pago.** Bizum es lo que ya usa
  la clienta en el móvil y elimina el abandono del formulario de tarjeta. El
  coste de integración es cero y la conversión sube.
- **Sin base de datos de clientes.** El carrito y el passport viven en
  `localStorage`. Sin registro, sin RGPD sobre perfiles, sin infraestructura
  que mantener. Para una tienda de este tamaño es la decisión correcta.
- **Sin cookies de terceros.** Ni analítica, ni banner de cookies. Solo
  almacenamiento local propio (carrito y sellos). Menos fricción, menos
  riesgo, y una política de cookies honesta en vez de un texto vacío.
- **Sin dependencia de la foto de producto:** las piezas del catálogo actual
  son SVG (demostración) y las reales se suben con fondo transparente para el
  AR.

## 6. Stack y motivos

| Capa | Elección | Motivo |
| --- | --- | --- |
| Frontend | Next.js 16 (App Router) + React 19 | SSR/ISR para SEO, rutas por producto estáticas, API routes en el mismo proyecto |
| Estilos | Tailwind v4 + CSS propio | Sistema de diseño en tokens, sin dependencia de un kit genérico |
| Contenido | Sanity | Panel en español, gratis hasta el volumen que necesita una tienda, y el importador de Instagram es código propio |
| AR | MediaPipe tasks-vision | Sin backend, sin coste por uso, licencia permisiva |
| Hosting | Vercel | Despliegue con `git push`, previsualizaciones por rama, coste cero hasta tráfico real |
| Pagos | Bizum | Ver arriba |

## 7. Resultado esperado

> Sustituye las cifras por los datos reales cuando los haya.

- Web indexable: cada pieza tiene URL, `Product` schema, breadcrumbs y
  `sitemap.xml` generado.
- 0 € de coste variable por venta online: ni pasarela, ni hosting de vídeo,
  ni GPU para el AR.
- Catálogo que se actualiza solo desde Instagram.
- Cumplimiento legal base resuelto antes de la primera venta.

## 8. Qué se puede replicar en otras tiendas

Este proyecto es una plantilla, no un caso aislado. Lo que se arrastra a cada
nuevo cliente:

- Sistema de diseño (tokens, tipografía, componentes `Reveal`, `SectionHeading`,
  `PieceImage`).
- Bloque de probador AR, con el tipo de pieza configurable por producto.
- Integración Instagram → catálogo, con el parser del pie de foto.
- Bloque legal (LSSI, RGPD, cookies, desistimiento) adaptado a los datos del
  cliente.
- Checkout por WhatsApp con el mensaje ya redactado.
- Panel de edición con el documento único de ajustes.

**Lo que hay que rehacer por cliente:** colores, tipografías, textos,
catálogo y el color de marca. El núcleo técnico se mantiene.

## 9. Mejoras pendientes

- [ ] Programa de fidelidad conectado a un CRM simple (HubSpot / Notion) para
  no perder los sellos de quien limpia el navegador.
- [ ] Guía de tallas con tallas reales de la tienda (tabla de medidas).
- [ ] Envío automático de confirmación de pedido desde Vercel con Resend.
- [ ] Analítica sin cookies: Vercel Analytics o Umami, con aviso en la
      política de cookies.
- [ ] Versión en valencià del catálogo para el cliente local.
