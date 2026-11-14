# Guía del panel de Sanity (para la dueña de la tienda)

Sanity es el **panel de edición** de la web: sirve para cambiar precios,
fotos, textos, promociones y datos de contacto **sin tocar código**. Todo lo
que se publica en el panel aparece en la web en menos de un minuto.

> La web seguirá funcionando aunque el panel esté vacío: usa los datos de
> `src/data/` como respaldo. Sanity solo sustituye esos datos cuando hay
> contenido publicado.

---

## 1. Crear la cuenta y el proyecto (solo una vez)

1. Entra en <https://www.sanity.io/manage> y crea una cuenta (Google o GitHub).
2. Pulsa **Create project**.
3. Nombre: `JP Accesorios`. Plan: **Free** (gratis, sobra para esta tienda).
4. Dataset: `production` (déjalo tal cual).
5. Entra en el proyecto → **Settings → API** y copia el **Project ID**
   (parece `a1b2c3d4`, siempre en minúsculas).

## 2. Configurar el panel en el ordenador

1. Abre una terminal en la carpeta `studio/`.
2. Instala las dependencias (solo la primera vez):

   ```bash
   npm install
   ```

3. Crea el fichero `studio/.env` (copia de `studio/.env.example`) y rellena:

   ```env
   SANITY_STUDIO_PROJECT_ID=a1b2c3d4
   SANITY_STUDIO_DATASET=production
   SANITY_STUDIO_SITE_URL=https://jp-accesorios.es
   ```

4. Arranca el panel:

   ```bash
   npm run dev
   ```

5. Abre <http://localhost:3333> y entra con la misma cuenta de Sanity.

## 3. Primer arranque: rellenar los ajustes

En el menú de la izquierda, pulsa **Ajustes del sitio**. Es un documento único
(no se crea ni se borra) con todos los datos de la tienda:

- Nombre, razón social, CIF/NIF, teléfono, WhatsApp y email.
- Dirección y horario (si el horario está vacío, no se muestra).
- Coordenadas del mapa (si están vacías, el mapa no se activa).
- Envíos: costes, plazos y envío gratis a partir de X €.
- Pagos: Bizum, tarjeta, transferencia.
- Textos de las secciones de la portada y menú de navegación.
- SEO de la portada.
- **Portada → Fotografía principal**: la pieza grande del inicio. Súbela en
  PNG/WebP con fondo transparente y sustituye a la que haya. Al publicar, el
  hero cambia sin tocar código.

Cuando termines, pulsa **Publish** (arriba a la derecha).

## 4. Crear una pieza (producto)

1. Menú izquierdo → **Piezas** → botón **+** (Create new).
2. Rellena:
   - **Nombre** y **Dirección en la web** (el slug se genera solo).
   - **Categoría**: pendientes, collares, pulseras, anillos o sets.
   - **Precio (€)**: con punto decimal (`24.90`).
   - **Descripción corta** (una línea, sale en las tarjetas).
   - **Foto principal**: súbela desde el ordenador, se guarda en Sanity.
   - **Foto para el probador AR**: PNG con fondo transparente (opcional).
   - **Disponibilidad**: en stock / últimas unidades / bajo pedido.
   - **Destacada en portada**: actívalo para que salga primero.
3. Pulsa **Publish**.

## 5. Promociones y «últimas unidades»

No hay que hacer nada especial: la web lo calcula sola.

- **OFERTA -XX %**: rellena **Precio anterior (€)** con un valor mayor que el
  precio actual. El descuento se calcula automáticamente y aparece en la
  tarjeta y en la ficha de la pieza.
- **ÚLTIMAS UNIDADES**: pon **Disponibilidad → Últimas unidades**.
- Para quitar la oferta, borra el **Precio anterior** y publica.

Si una pieza tiene las dos cosas, manda la oferta: se muestra **OFERTA -XX %**.

### Piezas de ejemplo en el probador

En **/provador** siempre aparecen unas piezas de muestra marcadas con la
etiqueta **Ejemplo** (Argolla Doha, Cascada de Perlas, Collar Cadena Fina…).
Sirven para enseñar la realidad aumentada mientras no haya fotos propias
recortadas. No están en la colección y no se pueden comprar. Cuando la tienda
tenga suficientes piezas reales, se quitan del código en un momento.

## 6. Borradores y publicación

- Mientras no pulses **Publish**, los cambios son un **borrador** y **no se ven
  en la web**.
- Las piezas que crea el importador de Instagram llegan como borrador: revísalas
  y publícalas una a una.
- Si algo no aparece, comprueba que está publicado (punto verde).

### Que aparezca al instante (webhook)

Sin webhook, la web se refresca sola cada 60 s. Para que sea inmediato:

1. En Vercel, crea la variable `SANITY_REVALIDATE_SECRET` con una frase larga
   y aleatoria (por ejemplo la que ya está en `.env.local`).
2. En <https://www.sanity.io/manage> → tu proyecto → **API → Webhooks →
   Create webhook**:
   - **URL**: `https://TU-DOMINIO/api/revalidate?secret=LA-MISMA-FRASE`
   - **Dataset**: `production`
   - **Trigger on**: Create, Update, Delete
   - **Filter**: `_type in ["product", "siteConfig"]`
   - **HTTP method**: POST
3. Guarda y pulsa **Send test** (o publica algo). La web debe cambiar en
   segundos.

## 7. Conectar la web con el panel

En la **raíz del proyecto** (no dentro de `studio/`), crea `.env.local`:

```env
SANITY_PROJECT_ID=a1b2c3d4
SANITY_DATASET=production
```

Reinicia el servidor (`npm run dev` en la raíz). A partir de ahí la web lee el
contenido de Sanity. En producción hay que añadir esas dos variables en
**Vercel → Settings → Environment Variables**.

> Importante: en cuanto haya **una sola pieza publicada** en Sanity, la web deja
> de usar el catálogo de demostración y muestra solo las piezas de Sanity.

## 8. Publicar el panel en internet (para la dueña)

```bash
cd studio
npm run deploy
```

La primera vez pide un nombre de host (por ejemplo `jp-accesorios`) y publica el
panel en `https://jp-accesorios.sanity.studio`. Desde ahí puede entrar desde
cualquier ordenador o móvil.

Alternativa: desplegarlo como proyecto aparte en Vercel con directorio `studio/`
(ya incluye `studio/vercel.json`).

## 9. Importar desde Instagram (opcional)

Necesita dos tokens que se configuran **solo en el servidor**:

1. Crear una app en <https://developers.facebook.com> y vincular la cuenta de
   Instagram de la tienda.
2. Generar un token con el permiso `instagram_basic`.
3. Definir en el servidor `INSTAGRAM_ACCESS_TOKEN` y
   `SANITY_API_WRITE_TOKEN` (token de escritura de Sanity).
4. En el panel: **Importar desde Instagram** → seleccionar → importar.

El importador extrae nombre, precio y categoría del pie de foto, descarga la
imagen y la sube a Sanity. Las fichas quedan en borrador.

---

## Problemas frecuentes

| Síntoma | Causa / solución |
| --- | --- |
| `Project ID` inválido al arrancar | El ID debe ser minúsculas y existir en sanity.io/manage. |
| El panel abre vacío o da error de red | `SANITY_STUDIO_PROJECT_ID` mal escrito o el proyecto no existe. |
| Cambio publicado y no se ve en la web | Espera hasta 60 s (o configura el webhook del paso 6) y recarga con `Ctrl + F5`. |
| Una pieza no aparece en la web | Está en borrador: pulsa **Publish**. |
| La web no usa Sanity | Falta `SANITY_PROJECT_ID` en `.env.local` o no se reinició el servidor. |
| Las fotos no cargan | El asset debe estar subido a Sanity (no vale pegar una URL externa). |
