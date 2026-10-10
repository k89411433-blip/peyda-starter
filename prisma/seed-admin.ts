import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();
async function main() {
  const email = process.env.BOOTSTRAP_ADMIN_EMAIL;
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;
  if (!email || !password || password.includes('REPLACE_WITH')) throw new Error('Set BOOTSTRAP_ADMIN_EMAIL and a strong BOOTSTRAP_ADMIN_PASSWORD first.');
  if (password.length < 16) throw new Error('Bootstrap admin password must be at least 16 characters.');
  const passwordHash = await bcrypt.hash(password, Number(process.env.BCRYPT_ROUNDS ?? 12));
  await prisma.user.upsert({ where: { email }, update: {}, create: { email, displayName: 'مدیر اصلی پیدا', passwordHash, role: UserRole.ADMIN } });
  console.log(`Admin bootstrap checked for ${email}. Remove bootstrap secrets from environment after use.`);
}
main().finally(() => prisma.$disconnect());
