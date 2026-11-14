import { Catalog } from "@/components/sections/Catalog";
import { Categories } from "@/components/sections/Categories";
import { Contact } from "@/components/sections/Contact";
import { FaceShape } from "@/components/sections/FaceShape";
import { Instagram } from "@/components/sections/Instagram";
import { Passport } from "@/components/sections/Passport";
import { Shipping } from "@/components/sections/Shipping";
import { TryOn } from "@/components/sections/TryOn";
import { CinematicHero } from "@/components/hero/CinematicHero";
import { Marquee } from "@/components/ui/Marquee";
import { getSiteContent } from "@/lib/content";

// Regenerar el contenido cada 60 s para que los cambios publicados
// en el panel aparezcan en la web sin necesidad de desplegar de nuevo.
export const revalidate = 60;

export default async function HomePage() {
  const { business, site, products, categories } = await getSiteContent();

  return (
    <>
      <CinematicHero business={business} site={site} products={products} />
      <Marquee
        items={categories.map((category) => category.title)}
        duration={38}
      />
      <Categories categories={categories} site={site} />
      <Catalog products={products} site={site} />
      <TryOn site={site} />
      <FaceShape site={site} />
      <Passport site={site} />
      <Shipping business={business} site={site} />
      <Instagram business={business} site={site} />
      <Contact business={business} site={site} />
    </>
  );
}
