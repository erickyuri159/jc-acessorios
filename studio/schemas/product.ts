import { defineField, defineType } from "sanity";

/**
 * Ficha de producto. Es lo que rellena la dueña (o el importador
 * de Instagram) y lo que alimenta la web.
 *
 * Los campos coinciden uno a uno con los que lee el sitio en
 * src/lib/content.ts, así que cualquier cambio aquí hay que
 * reflejarlo allí.
 */

export default defineType({
  name: "product",
  type: "document",
  title: "Pieza",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Nombre de la pieza",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "Dirección en la web",
      options: { source: "title", maxLength: 60 },
      validation: (Rule) =>
        Rule.required().custom((value: { current?: string } | undefined) => {
          const current = value?.current;
          if (!current) return true;
          return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(current)
            ? true
            : "Solo minúsculas, números y guiones. No pegues aquí una URL.";
        }),
    }),
    defineField({
      name: "category",
      type: "string",
      title: "Categoría",
      options: {
        list: [
          { title: "Pendientes", value: "pendientes" },
          { title: "Collares", value: "collares" },
          { title: "Pulseras", value: "pulseras" },
          { title: "Anillos", value: "anillos" },
          { title: "Sets", value: "sets" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "price",
      type: "number",
      title: "Precio (€)",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "compareAtPrice",
      type: "number",
      title: "Precio anterior (€)",
      description: "Solo si la pieza está rebajada. Déjalo vacío si no.",
    }),
    defineField({
      name: "shortDescription",
      type: "text",
      title: "Descripción corta",
      description: "Una línea: se usa en las tarjetas del catálogo.",
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Descripción completa",
    }),
    defineField({
      name: "materials",
      type: "string",
      title: "Materiales",
      description: "Ej.: «Acero dorado 18k, perlas cultivadas».",
    }),
    defineField({
      name: "image",
      type: "image",
      title: "Foto principal",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "arImage",
      type: "image",
      title: "Foto para el probador AR",
      description:
        "Misma pieza con fondo transparente (PNG). Si se deja vacío, el probador usa la foto principal.",
      options: { hotspot: true },
    }),
    defineField({
      name: "arType",
      type: "string",
      title: "Tipo de pieza (AR)",
      description: "Dónde se coloca la pieza sobre el rostro.",
      options: {
        list: [
          { title: "Pendiente (oreja)", value: "earring" },
          { title: "Collar (cuello)", value: "necklace" },
          { title: "Pulsera (muñeca)", value: "bracelet" },
          { title: "Anillo (dedo)", value: "ring" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "arScale",
      type: "number",
      title: "Tamaño en el AR",
      description:
        "0.25 = muy pequeña, 0.7 = muy grande. Si se deja vacío se usa el valor por defecto.",
    }),
    defineField({
      name: "stock",
      type: "string",
      title: "Disponibilidad",
      options: {
        list: [
          { title: "En stock", value: "in-stock" },
          { title: "Últimas unidades", value: "low-stock" },
          { title: "Bajo pedido", value: "made-to-order" },
        ],
        layout: "radio",
      },
      initialValue: "in-stock",
    }),
    defineField({
      name: "featured",
      type: "boolean",
      title: "Destacada en portada",
      initialValue: false,
    }),
    defineField({
      name: "tags",
      type: "array",
      title: "Etiquetas de estilo",
      description:
        "El probador las usa para recomendar piezas según la forma del rostro (p. ej.: «delicada», «clásica», «ovalada»).",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "instagramUrl",
      type: "url",
      title: "Publicación de Instagram",
      description: "Enlace al post original de esta pieza.",
    }),
    defineField({
      name: "instagramId",
      type: "string",
      title: "ID de Instagram",
      description: "Lo rellena el importador. No hace falta tocarlo.",
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      price: "price",
      media: "image",
      category: "category",
    },
    prepare({ title, price, media, category }) {
      const euros =
        typeof price === "number" ? `${price.toFixed(2).replace(".", ",")} €` : "";
      return {
        title: title || "Pieza sin nombre",
        subtitle: [category, euros].filter(Boolean).join(" · "),
        media,
      };
    },
  },
});
