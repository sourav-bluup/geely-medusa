import type { SubscriberConfig } from "@medusajs/framework"

const STORE_FRONT_URL = process.env.STORE_FRONT_URL || "http://localhost:3000"
const STORE_REVALIDATE_SECRET = process.env.STORE_REVALIDATE_SECRET

export async function revalidateNext(tags: string[]) {
  
    const response = await fetch(`${STORE_FRONT_URL}/api/revalidate/store`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-revalidate-secret": STORE_REVALIDATE_SECRET!,
      },
      body: JSON.stringify({ tags }),
    })

    if (!response.ok) {
      throw new Error(`Failed to revalidate: ${response.statusText}`)
    }
    console.log("Revalidation successful for tags:", tags)
    console.log(await response.json())
  
}

export default async function revalidateNextHandler() {
  await revalidateNext(['collection', 'product'])
}

export const config: SubscriberConfig = {
  event: [
    'product.created',
    'product.updated',
    'product.deleted',
    'product-collection.created',
    'product-collection.updated',
    'product-collection.deleted',
    'product-variant.created',
    'product-variant.updated',
    'product-variant.deleted',
    'order.placed',
  ],
};
