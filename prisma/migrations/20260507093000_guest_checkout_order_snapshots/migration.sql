-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "userId" DROP NOT NULL;
ALTER TABLE "orders" ALTER COLUMN "addressId" DROP NOT NULL;
ALTER TABLE "orders" ADD COLUMN "customerName" TEXT;
ALTER TABLE "orders" ADD COLUMN "customerEmail" TEXT;
ALTER TABLE "orders" ADD COLUMN "customerPhone" TEXT;
ALTER TABLE "orders" ADD COLUMN "shippingLine1" TEXT;
ALTER TABLE "orders" ADD COLUMN "shippingLine2" TEXT;
ALTER TABLE "orders" ADD COLUMN "shippingCity" TEXT;
ALTER TABLE "orders" ADD COLUMN "shippingState" TEXT;
ALTER TABLE "orders" ADD COLUMN "shippingPincode" TEXT;
ALTER TABLE "orders" ADD COLUMN "shippingCountry" TEXT DEFAULT 'India';
