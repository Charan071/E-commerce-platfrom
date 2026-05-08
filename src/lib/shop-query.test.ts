import { describe, expect, it } from "vitest";
import type { Product } from "@/lib/mock-data";
import {
  applyShopFiltersAndSort,
  filterShopProducts,
  parseShopSortParam,
  productMatchesQuery,
  sortShopProducts,
} from "@/lib/shop-query";

function p(over: Partial<Product> & Pick<Product, "id" | "title" | "price">): Product {
  return {
    description: "",
    material: "Silk",
    color: [],
    category: "Sarees",
    image: "/x.png",
    isNew: false,
    stock: 5,
    ...over,
  };
}

describe("parseShopSortParam", () => {
  it("defaults to featured", () => {
    expect(parseShopSortParam(null)).toBe("featured");
    expect(parseShopSortParam("invalid")).toBe("featured");
  });
  it("accepts known sorts", () => {
    expect(parseShopSortParam("price-asc")).toBe("price-asc");
    expect(parseShopSortParam("newest")).toBe("newest");
  });
});

describe("productMatchesQuery", () => {
  it("matches title and material", () => {
    const product = p({ id: "1", title: "Kanchipuram Gold", price: 1000 });
    expect(productMatchesQuery(product, "gold")).toBe(true);
    expect(productMatchesQuery(product, "linen")).toBe(false);
  });
});

describe("filterShopProducts", () => {
  const products = [
    p({ id: "1", title: "A", price: 100, category: "Silk", material: "Silk" }),
    p({ id: "2", title: "B", price: 200, category: "Cotton", material: "Cotton" }),
  ];

  it("filters by category and fabric", () => {
    expect(
      filterShopProducts(products, {
        query: "",
        category: "Silk",
        fabrics: [],
      }).map((x) => x.id)
    ).toEqual(["1"]);

    expect(
      filterShopProducts(products, {
        query: "",
        category: "All Sarees",
        fabrics: ["Cotton"],
      }).map((x) => x.id)
    ).toEqual(["2"]);
  });
});

describe("sortShopProducts", () => {
  const products = [
    p({ id: "1", title: "B", price: 300 }),
    p({ id: "2", title: "A", price: 100 }),
    p({ id: "3", title: "C", price: 200 }),
  ];

  it("sorts by price ascending with title tie-break", () => {
    const sorted = sortShopProducts(products, "price-asc");
    expect(sorted.map((x) => x.id)).toEqual(["2", "3", "1"]);
  });
});

describe("applyShopFiltersAndSort", () => {
  it("applies filter then sort", () => {
    const products = [
      p({ id: "1", title: "Low", price: 50, category: "X", material: "Silk" }),
      p({ id: "2", title: "High", price: 150, category: "X", material: "Silk" }),
      p({ id: "3", title: "Other", price: 10, category: "Y", material: "Silk" }),
    ];
    const out = applyShopFiltersAndSort(
      products,
      { query: "", category: "X", fabrics: [] },
      "price-desc"
    );
    expect(out.map((x) => x.id)).toEqual(["2", "1"]);
  });
});
