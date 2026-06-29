import "server-only";

import { db } from "@/lib/db";
import { requireOwnerEmail } from "@/lib/auth";
import { slugify } from "@/lib/utils";

async function makeUniqueSlug(baseSlug: string, currentTenantId?: string) {
  const base = baseSlug || "minha-barbearia";
  let slug = base;
  let suffix = 2;

  while (true) {
    const existing = await db.tenant.findUnique({ where: { slug } });

    if (!existing || existing.id === currentTenantId) {
      return slug;
    }

    slug = `${base}-${suffix}`;
    suffix += 1;
  }
}

export async function ensureTenantForOwner(ownerEmail: string) {
  const existingTenant = await db.tenant.findUnique({
    where: { ownerEmail },
  });

  if (existingTenant) {
    return { tenant: existingTenant, created: false };
  }

  const slug = await makeUniqueSlug(slugify("Minha Barbearia"));
  const tenant = await db.tenant.create({
    data: {
      nome: "Minha Barbearia",
      slug,
      ownerEmail,
    },
  });

  return { tenant, created: true };
}

export async function getCurrentTenant() {
  const ownerEmail = await requireOwnerEmail();
  const { tenant } = await ensureTenantForOwner(ownerEmail);

  return tenant;
}

export async function getUniqueTenantSlug(slugValue: string, tenantId?: string) {
  return makeUniqueSlug(slugify(slugValue), tenantId);
}
