"use server";

import { z } from "zod";
import type { EtsyShop, EtsyListing } from "@/lib/types";

const singleShopSchema = z.object({
  store: z.string().min(1, "Store name is required."),
});

const multiShopSchema = z.object({
  stores: z.string().min(1, "At least one store name is required."),
});

export interface SingleShopActionState {
  shop: EtsyShop | null;
  listings: EtsyListing[];
  error: string | null;
  message?: string;
}

export async function getEtsyShopData(
  prevState: SingleShopActionState,
  formData: FormData
): Promise<SingleShopActionState> {
  const validatedFields = singleShopSchema.safeParse({
    store: formData.get("store"),
  });

  if (!validatedFields.success) {
    return {
      shop: null,
      listings: [],
      error: "Invalid store name.",
    };
  }

  const { store } = validatedFields.data;
  const apiKey = process.env.ETSY_API_KEY || "92h3z6gfdbg4142mv5ziak0k";

  try {
    const shopUrl = `https://api.etsy.com/v3/application/shops?shop_name=${store}`;
    const shopRes = await fetch(shopUrl, {
      headers: { "x-api-key": apiKey },
    });

    if (!shopRes.ok) {
      return { shop: null, listings: [], error: "Failed to fetch shop data from Etsy API." };
    }

    const shopData = await shopRes.json();
    if (!shopData.results || shopData.results.length === 0) {
      return { shop: null, listings: [], error: `Shop "${store}" not found.` };
    }

    const shop: EtsyShop = shopData.results[0];
    const shopId = shop.shop_id;

    const listingsUrl = `https://api.etsy.com/v3/application/shops/${shopId}/listings/active?limit=100`;
    const listingsRes = await fetch(listingsUrl, {
      headers: { "x-api-key": apiKey },
    });

    if (!listingsRes.ok) {
        return { shop, listings: [], error: "Shop found, but failed to fetch listings." };
    }

    const listingsData = await listingsRes.json();
    const listings: EtsyListing[] = listingsData.results;

    return { shop, listings, error: null };
  } catch (error) {
    console.error(error);
    return { shop: null, listings: [], error: "An unexpected error occurred." };
  }
}

export interface MultiShopActionState {
  shops: EtsyShop[];
  errors: string[];
}


export async function getCompetitorData(
  prevState: MultiShopActionState,
  formData: FormData
): Promise<MultiShopActionState> {
  const validatedFields = multiShopSchema.safeParse({
    stores: formData.get("stores"),
  });

  if (!validatedFields.success) {
    return {
      shops: [],
      errors: ["Invalid store names provided."],
    };
  }
  
  const storeNames = validatedFields.data.stores.split(',').map(s => s.trim()).filter(Boolean);
  if (storeNames.length === 0) {
    return { shops: [], errors: ["Please enter at least one store name."] };
  }
  
  const apiKey = process.env.ETSY_API_KEY || "92h3z6gfdbg4142mv5ziak0k";
  const shops: EtsyShop[] = [];
  const errors: string[] = [];

  for (const store of storeNames) {
    try {
      const shopUrl = `https://api.etsy.com/v3/application/shops?shop_name=${store}`;
      const shopRes = await fetch(shopUrl, {
        headers: { "x-api-key": apiKey },
      });

      if (shopRes.ok) {
        const shopData = await shopRes.json();
        if (shopData.results && shopData.results.length > 0) {
          shops.push(shopData.results[0]);
        } else {
          errors.push(`Shop "${store}" not found.`);
        }
      } else {
        errors.push(`Failed to fetch data for "${store}".`);
      }
    } catch (error) {
       errors.push(`An unexpected error occurred for "${store}".`);
    }
  }

  return { shops, errors };
}