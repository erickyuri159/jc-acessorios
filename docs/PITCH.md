# Guión de venta — JP Accesorios

Material para presenting este proyecto a otras tiendas y vender servicios web.
La web es la prueba: enséñala en el móvil antes de decir nada.

---

## 1. Pitch de 30 segundos

> «Esta es la web de una joyería de Mislata que vende por Instagram. Mira: en
> este móvil te pones los pendientes con la cámara y ves cómo te quedan antes
> de comprarlos. No hay app, no hay registro y la imagen no sale de tu
> teléfono. Y cuando eliges las piezas, el pedido te sale escrito en el
> WhatsApp de la tienda, listo para pagar por Bizum. El catálogo se actualiza
> solo con lo que la tienda sube a Instagram, y tiene las páginas legales que
> necesita para vender a Europa sin miedo.»

---

## 2. Los tres argumentos que cierran la venta

### 2.1 «La gente ve las piezas antes de comprar»
La competencia usa filtros de foto. Esto es un probador: la clienta se ve la
pieza puesta. Convierte la duda («¿me quedará bien?») en confianza.
Y no se puede ver en una foto: es lo que separa esta web de una tienda más.

### 2.2 «No tengo que mantener dos catálogos»
El panel tiene un botón: **Importar desde Instagram**. La tienda publica en
Instagram (que ya hace) y la web se actualiza sola, con el nombre, el precio y
la categoría ya detectados. Quien no tiene web no tiene este problema; quien
tiene una web carísima, sí.

### 2.3 «Vende sin que estés pegada al móvil»
Catálogo, ficha, cesta y pedido por WhatsApp. La tienda confirma y cobra.
Menos conversación, más conversión: el cliente que ya ha decidido no se
desiste por escribir tres mensajes.

---

## 3. Qué incluye el paquete

| Bloque | Detalle |
| --- | --- |
| Diseño | Identidad visual, tipografía, paleta, sistema de componentes |
| Catálogo | Listado con filtros, ficha de producto, SEO por pieza, relacionados |
| Probador AR | Cámara en el navegador, control de tamaño/altura, captura y compartir |
| Pedido | Cesta persistente, resumen por WhatsApp, pago por Bizum |
| Fidelidad | Passport de sellos local, sin registro |
| Panel | Sanity Studio en español, documento único de ajustes, importador de Instagram |
| Legal | Aviso legal, privacidad, cookies, condiciones de venta (LSSI + RGPD) |
| SEO | Sitemap, robots, datos estructurados (tienda, producto, migas) |
| Despliegue | Vercel, dominio, cabeceras de seguridad, HTTPS |
| Formación | Una hora de vídeo explicando cómo cambiar precios, textos y fotos |

---

## 4. Planes (sugerencias; ajusta a tu mercado)

| Plan | Precio orientativo | Para quién |
| --- | --- | --- |
| **Presencia** — landing + catálogo básico + WhatsApp | 900 – 1.400 € | Tiendas que solo quieren que sus productos se vean y poder recibir pedidos |
| **Tienda** — todo lo del plan Presencia + probador AR + panel + legal | 2.500 – 4.000 € | El plan que se vende con este caso de estudio |
| **Tienda + AR a medida** — probador con tipos de pieza propios, integración con el ERP, analítica | 5.000 – 9.000 € | Tiendas con catálogo amplio o varios puntos de venta |
| **Mantenimiento** | 60 – 120 €/mes | Hosting, dominio, actualizaciones, petites mejoras, métricas |

> El margen del mantenimiento es lo que hace el negocio sostenible. Insiste
> en ello desde la primera reunión.

---

## 5. Preguntas que siempre salen

**«¿No es muy caro?»**
Compara con lo que cuesta un mes de publicidad en Instagram. La web se paga
sola con dos o tres ventas al mes, y a partir de ahí es beneficio.

**«¿Cuánto tarda?»**
Entre 2 y 4 semanas desde que entrega el catálogo y los textos. La parte
lenta no es el desarrollo: es reunir fotos, precios y datos fiscales.

**«¿Y si quiero cambiar los precios yo?»**
Por eso va con panel: cambias el precio y publicas. Sin tocar código, sin
llamar a nadie.

**«¿Qué pasa con mis datos?»**
Todo en el servidor de la tienda o en el hosting que elijas (en este
proyecto, Vercel + Sanity). Sin cookies de terceros, sin perfilado. Y las
páginas legales ya están revisadas.

**«¿Puedo usar mi dominio?»**
Sí, se conecta en el despliegue.

**«¿Y si no uso Instagram?»**
El importador es opcional: el catálogo se carga desde el panel o desde
ficheros. La web funciona igual.

---

## 6. Checklist de entrega (por cliente)

- [ ] Datos fiscales completos: razón social, CIF, domicilio
- [ ] Contacto: teléfono, WhatsApp, email, horario, ubicación
- [ ] Fotografías de las piezas (con fondo transparente para el AR)
- [ ] Precios y descripciones
- [ ] Banner o logotipo en alta resolución
- [ ] Dominio y acceso a Vercel / hosting
- [ ] Acceso a Instagram (token) si se quiere el importador
- [ ] Revisión de las páginas legales con los datos reales
- [ ] Formación: grabación de la sesión y manual de uso

---

## 7. Material de apoyo

- Demo en vivo: `npm run dev` y abrir `/provador` en el móvil.
- Capturas de la web y del panel (panel ya instalado).
- `docs/CASE-STUDY.md`: el caso de estudio completo, con las decisiones
  técnicas justificadas.
- Este repo: código comentado en español, sin trampas, listo para enseñar.
