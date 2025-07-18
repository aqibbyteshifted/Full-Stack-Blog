'use server';
import { getUserData } from "@/lib/auth";

export async function fetchUserRole() {
  const role = await getUserData();
  return role;
}