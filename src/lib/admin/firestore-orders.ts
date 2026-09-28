import {
  getFirebaseAdminDb,
  isFirebaseAdminConfigured,
} from "@/lib/firebase-admin";
import type { AdminOrder, OrderStatus, PaymentStatus } from "@/lib/admin/types";

const orderStatuses: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
  "Returned",
];

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value : "";
}

function numberValue(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function normalizeDate(value: unknown) {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "toDate" in value) {
    const toDate = (value as { toDate?: () => Date }).toDate;
    if (typeof toDate === "function") return toDate.call(value).toISOString();
  }
  return new Date(0).toISOString();
}

function normalizeOrder(id: string, raw: Record<string, unknown>): AdminOrder {
  const customer = asRecord(raw.customer);
  const address = asRecord(raw.address ?? customer);
  const rawItems = Array.isArray(raw.items) ? raw.items : [];
  const rawStatus = stringValue(raw.status);
  const rawPaymentStatus = stringValue(raw.paymentStatus);
  const paymentStatuses: PaymentStatus[] = [
    "pending",
    "unpaid",
    "paid",
    "failed",
    "refunded",
  ];

  return {
    id: stringValue(raw.id) || id,
    customerId: stringValue(raw.customerId),
    customerName:
      stringValue(customer.name) || stringValue(address.fullName) || "Customer",
    customerEmail: stringValue(customer.email ?? raw.customerEmail),
    createdAt: normalizeDate(raw.createdAt),
    items: rawItems.map((value) => {
      const item = asRecord(value);
      return {
        productId: stringValue(item.bookId ?? item.productId),
        title: stringValue(item.bookName ?? item.title) || "Book",
        quantity: numberValue(item.quantity),
        price: numberValue(item.unitPrice ?? item.price),
      };
    }),
    subtotal: numberValue(raw.subtotal),
    shipping: numberValue(raw.shipping),
    discount: numberValue(raw.discount),
    total: numberValue(raw.total),
    ...(typeof raw.coupon === "string" ? { coupon: raw.coupon } : {}),
    paymentMethod: raw.paymentMethod === "online" ? "online" : "cod",
    ...(typeof raw.onlinePaymentMethod === "string"
      ? { onlinePaymentMethod: raw.onlinePaymentMethod }
      : {}),
    paymentStatus: paymentStatuses.includes(rawPaymentStatus as PaymentStatus)
      ? (rawPaymentStatus as PaymentStatus)
      : "pending",
    status: orderStatuses.includes(rawStatus as OrderStatus)
      ? (rawStatus as OrderStatus)
      : "Pending",
    address: {
      fullName:
        stringValue(address.fullName) ||
        stringValue(customer.name) ||
        "Customer",
      phone: stringValue(address.phone),
      line1: stringValue(address.line1),
      area: stringValue(address.area),
      city: stringValue(address.city),
      province: stringValue(address.province),
      postalCode: stringValue(address.postalCode),
    },
  };
}

export function isOrderStatus(value: unknown): value is OrderStatus {
  return (
    typeof value === "string" && orderStatuses.includes(value as OrderStatus)
  );
}

export async function readFirestoreOrders(): Promise<AdminOrder[]> {
  if (!isFirebaseAdminConfigured()) return [];
  const snapshot = await getFirebaseAdminDb().collection("orders").get();
  return snapshot.docs
    .map((doc) => normalizeOrder(doc.id, doc.data()))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function updateFirestoreOrderStatus(
  id: string,
  status: OrderStatus,
) {
  if (!isFirebaseAdminConfigured()) {
    throw new Error("Firebase Admin credentials are not configured.");
  }
  const snapshot = await getFirebaseAdminDb()
    .collection("orders")
    .where("id", "==", id)
    .limit(1)
    .get();
  const order = snapshot.docs[0];
  if (!order) return null;
  await order.ref.update({ status });
  return normalizeOrder(order.id, { ...order.data(), status });
}
