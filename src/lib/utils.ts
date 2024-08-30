import type { ClassValue } from "clsx";
import {  clsx } from "clsx";
import { twMerge } from "tailwind-merge";




export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function computeSHA256(file: File) {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
}

export function truncateString(
  str: string,
  n: number,
  useEllipsis: boolean = true
): string {
  if (str.length <= n) {
    return str;
  }
  if (useEllipsis) {
    return str.slice(0, n) + "...";
  }

  return str.slice(0, n);
}
