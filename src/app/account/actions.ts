"use server";

import { revalidatePath } from "next/cache";
import { getAuthContext } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type ProfileState = { error?: string; success?: string } | null;
type AddressState = { error?: string; success?: string } | null;

export async function updateProfile(
  prevState: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const auth = await getAuthContext();
  if (!auth) return { error: "You must be signed in." };

  const name = (formData.get("name") as string | null)?.trim() || null;
  const phone = (formData.get("phone") as string | null)?.trim() || null;

  if (name && name.length > 120) {
    return { error: "Name is too long (max 120 characters)." };
  }
  if (phone && phone.length > 20) {
    return { error: "Phone number is too long." };
  }

  await prisma.user.update({
    where: { id: auth.userId },
    data: { name, phone },
  });

  revalidatePath("/account");
  return { success: "Profile updated successfully." };
}

export async function addAddress(
  prevState: AddressState,
  formData: FormData
): Promise<AddressState> {
  const auth = await getAuthContext();
  if (!auth) return { error: "You must be signed in." };

  const fullName = (formData.get("fullName") as string | null)?.trim();
  const phone = (formData.get("phone") as string | null)?.trim();
  const line1 = (formData.get("line1") as string | null)?.trim();
  const line2 = (formData.get("line2") as string | null)?.trim() || null;
  const city = (formData.get("city") as string | null)?.trim();
  const state = (formData.get("state") as string | null)?.trim();
  const pincode = (formData.get("pincode") as string | null)?.trim();
  const isDefault = formData.get("isDefault") === "on";

  if (!fullName || !phone || !line1 || !city || !state || !pincode) {
    return { error: "Please fill all required fields." };
  }

  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId: auth.userId, isDefault: true },
      data: { isDefault: false },
    });
  }

  await prisma.address.create({
    data: {
      userId: auth.userId,
      fullName,
      phone,
      line1,
      line2,
      city,
      state,
      pincode,
      isDefault,
    },
  });

  revalidatePath("/account/addresses");
  return { success: "Address added." };
}

export async function deleteAddress(addressId: string) {
  const auth = await getAuthContext();
  if (!auth) return;

  await prisma.address.deleteMany({
    where: { id: addressId, userId: auth.userId },
  });

  revalidatePath("/account/addresses");
}
