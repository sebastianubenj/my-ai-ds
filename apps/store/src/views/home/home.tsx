import * as React from "react";

import {
  Navigation,
  NavigationBagTrigger,
  type NavigationBagItem,
  NavigationLink,
  NavigationMenuLink,
  NavigationSearchTrigger,
  NavigationSection,
} from "@/components/ui/navigation";
import {
  HomeProducts,
  type HomeProduct,
} from "@/patterns/home-products/home-products";

const links = [
  "Products",
  "Services",
  "Discover",
  "Support",
  "About",
] as const;

type HomeLink = (typeof links)[number];

const panels: Record<HomeLink, { sections: number; links: number }> = {
  Products: { sections: 3, links: 8 },
  Services: { sections: 2, links: 4 },
  Discover: { sections: 2, links: 6 },
  Support: { sections: 1, links: 5 },
  About: { sections: 1, links: 3 },
};

function stopNavigation(event: React.MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
}

function MenuLinks({ count }: { count: number }) {
  return Array.from({ length: count }, (_, index) => (
    <NavigationMenuLink
      key={index}
      href={`#item-${index}`}
      onClick={stopNavigation}
    >
      Navigation menu link
    </NavigationMenuLink>
  ));
}

function LinkPanel({ sections, links: linkCount }: { sections: number; links: number }) {
  return Array.from({ length: sections }, (_, index) => (
    <NavigationSection key={index} heading="Heading">
      <MenuLinks count={linkCount} />
    </NavigationSection>
  ));
}

function HomeMenu() {
  return (
    <NavigationSection>
      {links.map((label) => (
        <NavigationMenuLink
          key={label}
          href={`#${label.toLowerCase()}`}
          onClick={stopNavigation}
          submenu={<LinkPanel {...panels[label]} />}
        >
          {label}
        </NavigationMenuLink>
      ))}
    </NavigationSection>
  );
}

function bagQuantity(count: number) {
  return count > 1 ? `x${count}` : undefined;
}

function addProductToBag(
  items: NavigationBagItem[],
  product: HomeProduct,
): NavigationBagItem[] {
  const index = items.findIndex((item) => item.name === product.name);

  if (index === -1) {
    return [
      ...items,
      {
        name: product.name,
        src: product.src,
        alt: product.alt,
      },
    ];
  }

  return items.map((item, itemIndex) => {
    if (itemIndex !== index) return item;
    const current = Number.parseInt(item.quantity?.replace(/^x/, "") ?? "1", 10);
    const next = current + 1;
    return { ...item, quantity: bagQuantity(next) };
  });
}

export interface HomeProps {
  onReview?: () => void;
}

export function Home({ onReview }: HomeProps) {
  const [bagItems, setBagItems] = React.useState<NavigationBagItem[]>([]);

  return (
    <>
      <Navigation
        logoHref="/"
        logoLabel="Home"
        searchLabel="Search"
        clearSearchLabel="Clear search"
        menuLabel="Menu"
        closeLabel="Close"
        backLabel="Back"
        menu={<HomeMenu />}
      >
        {links.map((label) => (
          <NavigationLink
            key={label}
            value={label.toLowerCase()}
            href={`#${label.toLowerCase()}`}
            onClick={stopNavigation}
            menu={<LinkPanel {...panels[label]} />}
            menuLabel={`${label} menu`}
          >
            {label}
          </NavigationLink>
        ))}
        <NavigationSearchTrigger />
        <NavigationBagTrigger
          aria-label="Bag"
          signInHref="/login"
          onSignInClick={stopNavigation}
          items={bagItems}
          onReview={onReview}
        />
      </Navigation>
      <HomeProducts
        onAction={(product) => {
          setBagItems((items) => addProductToBag(items, product));
        }}
      />
    </>
  );
}
