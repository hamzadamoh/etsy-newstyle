
"use server";

import { z } from "zod";
import type { EtsyShop, EtsyListing, TrackedShop, ShopSnapshot } from "@/lib/types";
import { db, adminAuth } from "@/firebase-config";
import { collection, addDoc, query, where, getDocs, doc, setDoc, getDoc, serverTimestamp, limit, orderBy, Timestamp, updateDoc, writeBatch } from "firebase/firestore";


const singleShopSchema = z.object({
  store: z.string().min(1, "Store name is required."),
});

const multiShopSchema = z.object({
  stores: z.string().min(1, "At least one store name is required."),
});

const keywordSchema = z.object({
  keyword: z.string().min(1, "Keyword is required."),
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

    const listingsUrl = `https://api.etsy.com/v3/application/shops/${shopId}/listings/active?limit=100&includes=MainImage`;
    const listingsRes = await fetch(listingsUrl, {
      headers: { "x-api-key": apiKey },
    });

    if (!listingsRes.ok) {
        return { shop, listings: [], error: "Shop found, but failed to fetch listings." };
    }

    const listingsData = await listingsRes.json();
    const listings: EtsyListing[] = listingsData.results.map((l: any) => ({
      ...l,
      price: parseFloat(l.price?.amount) / l.price?.divisor || 0,
      image_url: l.MainImage?.url_75x75
    }));

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


export interface KeywordResearchState {
  listings: EtsyListing[];
  count: number;
  error: string | null;
  avgPrice: number;
  avgFavorites: number;
}

export async function getKeywordData(
    prevState: KeywordResearchState,
    formData: FormData
): Promise<KeywordResearchState> {
    const validatedFields = keywordSchema.safeParse({
        keyword: formData.get("keyword"),
    });

    if (!validatedFields.success) {
        return { ...prevState, error: "Invalid keyword." };
    }

    const { keyword } = validatedFields.data;
    const apiKey = process.env.ETSY_API_KEY || "92h3z6gfdbg4142mv5ziak0k";
    
    try {
        const listingsUrl = `https://api.etsy.com/v3/application/listings/active?keywords=${encodeURIComponent(keyword)}&limit=100&sort_on=score&includes=MainImage`;
        const listingsRes = await fetch(listingsUrl, {
            headers: { "x-api-key": apiKey },
        });

        if (!listingsRes.ok) {
            return { ...prevState, error: "Failed to fetch keyword data from Etsy." };
        }

        const listingsData = await listingsRes.json();
        
        if (!listingsData.results || listingsData.results.length === 0) {
            return {
                listings: [],
                count: 0,
                avgPrice: 0,
                avgFavorites: 0,
                error: null,
            };
        }

        const listings: EtsyListing[] = listingsData.results.map((l: any) => ({
            ...l,
            price: parseFloat(l.price?.amount) / l.price?.divisor || 0,
            image_url: l.MainImage?.url_75x75
        }));
        
        const totalFavorites = listings.reduce((sum, l) => sum + l.num_favorers, 0);
        const totalPrice = listings.reduce((sum, l) => sum + l.price, 0);

        const avgFavorites = listings.length > 0 ? totalFavorites / listings.length : 0;
        const avgPrice = listings.length > 0 ? totalPrice / listings.length : 0;

        return {
            listings: listings,
            count: listingsData.count,
            avgPrice: avgPrice,
            avgFavorites: avgFavorites,
            error: null,
        };
    } catch (error) {
        console.error("Keyword research error:", error);
        return { ...prevState, error: "An unexpected error occurred." };
    }
}


// Shop Tracker Actions
const trackShopSchema = z.object({
  store: z.string().min(1, "Store name is required."),
  idToken: z.string().optional(),
});

export interface TrackShopActionState {
  success: boolean;
  message: string;
}

export async function trackShop(
  prevState: TrackShopActionState,
  formData: FormData
): Promise<TrackShopActionState> {
  console.log("Received Form Data:", Object.fromEntries(formData)); // Debug log
  
  if (!adminAuth || !db) {
    return { success: false, message: "Firebase Admin is not initialized. Check server environment variables." };
  }

  const validatedFields = trackShopSchema.safeParse({
    store: formData.get("store"),
    idToken: formData.get("idToken"),
  });

  if (!validatedFields.success) {
    return { success: false, message: validatedFields.error.errors[0].message };
  }

  const { store, idToken } = validatedFields.data;
  const apiKey = process.env.ETSY_API_KEY || "92h3z6gfdbg4142mv5ziak0k";
  
  let userId = null;
  if (!idToken) {
    return { success: false, message: "No authentication token provided." };
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    console.log("Decoded User ID:", decodedToken.uid); // Debug log
    userId = decodedToken.uid;
  } catch (error: any) {
    console.error("Token verification error:", error);
    return { success: false, message: `Authentication failed: ${error.message}` };
  }

  if (!userId) {
    return { success: false, message: "You must be logged in to track a shop." };
  }

  try {
    const shopUrl = `https://api.etsy.com/v3/application/shops?shop_name=${store}`;
    const shopRes = await fetch(shopUrl, { headers: { "x-api-key": apiKey } });
    if (!shopRes.ok) throw new Error("Failed to fetch from Etsy.");

    const shopData = await shopRes.json();
    if (!shopData.results || shopData.results.length === 0) {
      return { success: false, message: `Shop "${store}" not found on Etsy.` };
    }
    const shop: EtsyShop = shopData.results[0];

    const docId = `${userId}_${shop.shop_id}`;
    const trackedShopRef = doc(db, "trackedShops", docId);

    const docSnap = await getDoc(trackedShopRef);
    if (docSnap.exists()) {
      return { success: false, message: `You are already tracking "${shop.shop_name}".` };
    }

    const batch = writeBatch(db);

    batch.set(trackedShopRef, {
      userId: userId,
      shop_id: shop.shop_id,
      shop_name: shop.shop_name,
      icon_url_fullxfull: shop.icon_url_fullxfull,
      url: shop.url,
      last_updated: serverTimestamp(),
    });

    const today = new Date().toISOString().split('T')[0];
    const snapshotRef = doc(db, "trackedShops", docId, "snapshots", today);
    batch.set(snapshotRef, {
      date: today,
      transaction_sold_count: shop.transaction_sold_count,
      listing_active_count: shop.listing_active_count,
      num_favorers: shop.num_favorers,
      userId: userId,
    });

    await batch.commit();

    return { success: true, message: `Successfully started tracking "${shop.shop_name}".` };
  } catch (error: any) {
    console.error("Error tracking shop:", error);
    const errorMessage = `Firebase Error: ${error.message} (Code: ${error.code || 'N/A'}, Name: ${error.name || 'N/A'})`;
    return { success: false, message: errorMessage };
  }
}


export async function getTrackedShops(userId: string): Promise<TrackedShop[]> {
  if (!userId || !db) return [];

  try {
    const trackedShopsRef = collection(db, "trackedShops");
    const q = query(trackedShopsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    const shops = querySnapshot.docs.map(doc => {
        const data = doc.data();
        const lastUpdated = data.last_updated as Timestamp;
        return {
        id: doc.id,
        shop_id: data.shop_id,
        shop_name: data.shop_name,
        icon_url_fullxfull: data.icon_url_fullxfull,
        url: data.url,
        userId: data.userId,
        last_updated: lastUpdated?.toMillis() || Date.now(),
        }
    });
    
    return shops;
  } catch (error) {
      console.error("Error getting tracked shops: ", error);
      return [];
  }
}


export async function getShopSnapshots(shopId: string): Promise<ShopSnapshot[]> {
  if (!shopId || !db) return [];
  try {
    const snapshotsRef = collection(db, "trackedShops", shopId, "snapshots");
    const q = query(snapshotsRef, orderBy("date", "desc"), limit(7));
    const querySnapshot = await getDocs(q);

    const snapshots = querySnapshot.docs.map(doc => doc.data() as ShopSnapshot);
    return snapshots.reverse();
  } catch (error) {
    console.error("Error getting shop snapshots: ", error);
    return [];
  }
}

export async function refreshShopData(trackedShopId: string, shop_id: number): Promise<ShopSnapshot | null> {
    const apiKey = process.env.ETSY_API_KEY || "92h3z6gfdbg4142mv5ziak0k";
    if (!db) {
        console.error("Firestore not initialized for refreshShopData");
        return null;
    }
    try {
        const shopUrl = `https://api.etsy.com/v3/application/shops/${shop_id}`;
        const shopRes = await fetch(shopUrl, { headers: { "x-api-key": apiKey } });
        if (!shopRes.ok) throw new Error('Failed to fetch from Etsy');

        const shop: EtsyShop = await shopRes.json();
        
        const today = new Date().toISOString().split('T')[0];
        const snapshotRef = doc(db, "trackedShops", trackedShopId, "snapshots", today);

        const newSnapshot: ShopSnapshot = {
            date: today,
            transaction_sold_count: shop.transaction_sold_count,
            listing_active_count: shop.listing_active_count,
            num_favorers: shop.num_favorers,
        };

        await setDoc(snapshotRef, newSnapshot, { merge: true });
        
        const trackedShopRef = doc(db, "trackedShops", trackedShopId);
        await setDoc(trackedShopRef, { last_updated: serverTimestamp() }, { merge: true });

        return newSnapshot;

    } catch (error) {
        console.error("Error refreshing shop data:", error);
        return null;
    }
}

    