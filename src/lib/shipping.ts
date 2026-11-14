// ============================================================
// ENVÍOS
// ------------------------------------------------------------
// Cálculo del coste de envío según el destino y el importe del
// pedido. Las reglas viven en src/data/business.ts.
// ============================================================

export type ShippingZone = "pickup" | "local" | "spain" | "europe";

export type ShippingOption = {
  id: ShippingZone;
  label: string;
  detail: string;
  cost: number;
  days: string;
};

export type ShippingConfig = {
  localPickup: boolean;
  localPickupNote: string;
  localDeliveryNote: string;
  spainNote: string;
  europeNote: string;
  spainShippingCost: number;
  europeShippingCost: number;
  spainDeliveryDays: string;
  europeDeliveryDays: string;
  freeShippingFrom: number;
};

export function shippingOptions(config: ShippingConfig): ShippingOption[] {
  const options: ShippingOption[] = [];

  if (config.localPickup) {
    options.push({
      id: "pickup",
      label: "Recogida en Mislata",
      detail: config.localPickupNote,
      cost: 0,
      days: "Listo en 24 h",
    });
  }

  options.push({
    id: "local",
    label: "Entrega en Mislata y Valencia",
    detail: config.localDeliveryNote,
    cost: 0,
    days: "24 h",
  });

  options.push({
    id: "spain",
    label: "España",
    detail: config.spainNote,
    cost: config.spainShippingCost,
    days: `${config.spainDeliveryDays} días laborables`,
  });

  options.push({
    id: "europe",
    label: "Unión Europea",
    detail: config.europeNote,
    cost: config.europeShippingCost,
    days: `${config.europeDeliveryDays} días laborables`,
  });

  return options;
}

/**
 * Coste final de envío: a partir de un importe, el envío es
 * gratuito. La recogida nunca tiene coste.
 */
export function shippingCost(
  option: ShippingOption,
  subtotal: number,
  config: ShippingConfig,
): number {
  if (option.id === "pickup" || option.id === "local") return 0;
  if (subtotal >= config.freeShippingFrom) return 0;
  return option.cost;
}
