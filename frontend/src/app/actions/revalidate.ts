"use server";

import { revalidatePath } from "next/cache";

export async function triggerRevalidate(path: string = "/") {
  revalidatePath(path);
  return { success: true };
}
