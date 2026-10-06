import {
  ProductCard,
  type ProductCardLayout,
} from "@/components/ui/product-card";
import { useIsDesktop } from "@/lib/media";

const headingClassName = `m-0 w-full font-sans
  [font-weight:var(--semantics-typography-heading-font-weight)]
  text-(length:--semantics-typography-heading-heading-xl-font-size)
  leading-(--semantics-typography-heading-heading-xl-lh-tight)
  tracking-(--semantics-typography-heading-heading-xl-tracking-tight)
  [color:var(--semantics-colors-foreground-default)]`;

interface HomeProduct {
  name: string;
  price: string;
  src: string;
  alt: string;
  layout: ProductCardLayout;
  showAction?: boolean;
}

const PRODUCTS: HomeProduct[] = [
  {
    name: "TP-7 aluminum",
    price: "$1499",
    src: "/product-card-tp7.png",
    alt: "Teenage Engineering TP-7 aluminum field recorder",
    layout: "horizontal",
  },
  {
    name: "OP-1 field",
    price: "$1999",
    src: "/product-op-1-field.png",
    alt: "Teenage Engineering OP-1 field portable synthesizer",
    layout: "horizontal",
  },
  {
    name: "OP-XY",
    price: "sold out",
    src: "/product-op-xy.png",
    alt: "Teenage Engineering OP-XY synthesizer",
    layout: "horizontal",
    showAction: false,
  },
  {
    name: "EP–2350 FX–MIC",
    price: "$59",
    src: "/product-ep-2350.png",
    alt: "Teenage Engineering EP-2350 FX-MIC microphone",
    layout: "vertical",
  },
  {
    name: "CM-15 aluminum",
    price: "$1199",
    src: "/product-cm-15.png",
    alt: "Teenage Engineering CM-15 aluminum microphone",
    layout: "vertical",
  },
  {
    name: "K.O. II splash kit",
    price: "$338",
    src: "/product-ko-ii-splash.png",
    alt: "Teenage Engineering K.O. II splash kit",
    layout: "horizontal",
  },
  {
    name: "TX-6 black",
    price: "$1199",
    src: "/product-tx-6.png",
    alt: "Teenage Engineering TX-6 black mixer",
    layout: "horizontal",
  },
  {
    name: "K.O.–SIDEKICK & FX–MIC",
    price: "sold out",
    src: "/product-ko-sidekick.png",
    alt: "Teenage Engineering K.O. SIDEKICK and FX-MIC",
    layout: "vertical",
    showAction: false,
  },
  {
    name: "EP–40 riddim",
    price: "$299",
    src: "/product-ep-40.png",
    alt: "Teenage Engineering EP-40 riddim sampler",
    layout: "vertical",
  },
  {
    name: "K.O. II & FX–MIC",
    price: "$359",
    src: "/product-ko-ii-fx-mic.png",
    alt: "Teenage Engineering K.O. II and FX-MIC",
    layout: "horizontal",
  },
];

export interface HomeProductsProps {
  onAction?: React.MouseEventHandler<HTMLButtonElement>;
}

export function HomeProducts({ onAction }: HomeProductsProps) {
  const isDesktop = useIsDesktop();

  return (
    <div
      className="flex min-h-dvh w-full flex-col items-center px-(--primitives-spacing-6) md:px-(--primitives-spacing-16) [background-color:var(--semantics-colors-background-page)]"
    >
      <div className="flex w-full flex-col items-start gap-(--primitives-spacing-4)">
        <h1 className={headingClassName}>All products</h1>
        <div
          className="grid w-full grid-cols-1 gap-(--primitives-spacing-6) md:grid-cols-4 md:gap-x-(--primitives-spacing-6) md:gap-y-(--primitives-spacing-10)"
        >
          {PRODUCTS.map((product) => (
            <ProductCard
              key={product.name}
              className={
                product.layout === "horizontal" ? "md:col-span-2" : undefined
              }
              layout={isDesktop ? product.layout : "square"}
              name={product.name}
              price={product.price}
              src={product.src}
              alt={product.alt}
              showAction={product.showAction ?? true}
              onAction={onAction}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
