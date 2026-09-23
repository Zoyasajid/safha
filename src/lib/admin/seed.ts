import { authors as seedAuthors } from "@/data/authors";
import { books as seedBooks, coupons as seedCoupons } from "@/data/books";
import { categories as seedCategories } from "@/data/categories";
import { reviews as seedReviews } from "@/data/reviews";
import { SITE } from "@/lib/constants";
import type {
  AdminAuthor,
  AdminCategory,
  AdminCoupon,
  AdminCustomer,
  AdminDB,
  AdminOrder,
  AdminProduct,
  AdminReview,
  WishlistEntry,
} from "@/lib/admin/types";

function skuFromIsbn(isbn: string) {
  return `SF-${isbn.slice(-6)}`;
}

export function buildSeed(): AdminDB {
  const extraCats: AdminCategory[] = [
    {
      id: "non-fiction",
      slug: "non-fiction",
      name: "Non-Fiction",
      description: "Essays, ideas, and reported lives.",
      status: "active",
      createdAt: "2024-01-10T08:00:00.000Z",
    },
    {
      id: "children",
      slug: "children",
      name: "Children Books",
      description: "Picture books and early readers.",
      status: "active",
      createdAt: "2024-01-10T08:00:00.000Z",
    },
    {
      id: "academic",
      slug: "academic",
      name: "Academic Books",
      description: "Syllabus and reference titles.",
      status: "active",
      createdAt: "2024-01-10T08:00:00.000Z",
    },
  ];

  const categories: AdminCategory[] = [
    ...seedCategories.map((c, i) => ({
      id: c.slug,
      slug: c.slug,
      name: c.name,
      nameUrdu: c.nameUrdu,
      description: c.description,
      status: "active" as const,
      createdAt: `2024-01-${String(i + 2).padStart(2, "0")}T08:00:00.000Z`,
    })),
    ...extraCats,
  ];

  const authors: AdminAuthor[] = seedAuthors.map((a, i) => ({
    id: a.id,
    slug: a.slug,
    name: a.name,
    nameUrdu: a.nameUrdu,
    bio: a.bio,
    location: a.location,
    coverTone: a.coverTone,
    status: "active",
    createdAt: `2023-11-${String((i % 27) + 1).padStart(2, "0")}T10:00:00.000Z`,
  }));

  const products: AdminProduct[] = seedBooks.map((b, i) => {
    const sale =
      b.originalPrice && b.originalPrice > b.price ? b.price : undefined;
    const regular =
      b.originalPrice && b.originalPrice > b.price ? b.originalPrice : b.price;
    return {
      id: b.id,
      sku: skuFromIsbn(b.isbn),
      slug: b.slug,
      title: b.title,
      titleUrdu: b.titleUrdu,
      shortDescription: b.description.slice(0, 140),
      description: b.description,
      authorId: b.authorId,
      categoryIds: [...b.categorySlugs],
      language: b.language,
      bookType: b.format,
      publisher: b.publisher,
      isbn: b.isbn,
      edition: b.edition,
      publicationDate: `${b.year}-01-01`,
      pages: b.pages,
      price: regular,
      salePrice: sale,
      costPrice: Math.round(regular * 0.55),
      currency: "PKR",
      stock: b.stock,
      lowStockThreshold: 8,
      allowBackorders: false,
      images: [
        {
          id: `${b.id}-cover`,
          url: b.coverTone,
          alt: `${b.title} cover`,
        },
      ],
      coverTone: b.coverTone,
      accent: b.accent,
      featured: Boolean(b.featured),
      bestseller: Boolean(b.bestseller),
      newArrival: Boolean(b.newArrival),
      deal: Boolean(sale),
      status: b.stock <= 0 ? "inactive" : "active",
      seoTitle: `${b.title} — Safha Karachi`,
      seoDescription: b.description.slice(0, 160),
      seoKeywords: `${b.title}, ${b.language} books, Karachi bookstore`,
      weightGrams: Math.max(180, Math.round(b.pages * 1.8)),
      lengthCm: 21,
      widthCm: 14,
      heightCm: 2.4,
      deliveryInfo:
        "Karachi next-day on orders before 2pm. Nationwide 2–5 working days.",
      reviewsEnabled: true,
      showRating: true,
      rating: b.rating,
      reviewCount: b.reviewCount,
      createdAt: `2025-${String((i % 11) + 1).padStart(2, "0")}-12T09:00:00.000Z`,
      updatedAt: `2026-08-${String((i % 27) + 1).padStart(2, "0")}T11:00:00.000Z`,
    };
  });

  products[products.length - 1].stock = 0;
  if (products[2]) products[2].stock = 4;

  const customers: AdminCustomer[] = [
    {
      id: "c-ayesha",
      name: "Ayesha Khan",
      email: "ayesha.khan@email.pk",
      phone: "0300 8240191",
      city: "Karachi",
      createdAt: "2025-11-02T10:00:00.000Z",
      status: "active",
    },
    {
      id: "c-hamza",
      name: "Hamza Raza",
      email: "hamza.raza@email.pk",
      phone: "0321 4550190",
      city: "Karachi",
      createdAt: "2026-01-14T10:00:00.000Z",
      status: "active",
    },
    {
      id: "c-sana",
      name: "Sana Mir",
      email: "sana.mir@email.pk",
      phone: "0333 2108890",
      city: "Karachi",
      createdAt: "2026-03-08T10:00:00.000Z",
      status: "active",
    },
    {
      id: "c-farah",
      name: "Farah Siddiqui",
      email: "farah.s@email.pk",
      phone: "042 111 000 00",
      city: "Lahore",
      createdAt: "2026-04-21T10:00:00.000Z",
      status: "active",
    },
    {
      id: "c-bilal",
      name: "Bilal Ahmed",
      email: "bilal.a@email.pk",
      phone: "051 8890011",
      city: "Islamabad",
      createdAt: "2026-05-30T10:00:00.000Z",
      status: "active",
    },
    {
      id: "c-usman",
      name: "Usman Javed",
      email: "usman.j@email.pk",
      phone: "022 2610090",
      city: "Hyderabad",
      createdAt: "2026-06-18T10:00:00.000Z",
      status: "blocked",
    },
  ];

  const orders: AdminOrder[] = [
    {
      id: "SF-240891",
      customerId: "c-ayesha",
      createdAt: "2026-09-20T09:12:00.000Z",
      items: [
        {
          productId: "peer-e-kamil",
          title: "Peer-e-Kamil",
          quantity: 1,
          price: 1290,
        },
        {
          productId: "atomic-habits",
          title: "Atomic Habits",
          quantity: 1,
          price: 1490,
        },
      ],
      subtotal: 2780,
      shipping: 0,
      discount: 278,
      total: 2502,
      coupon: "SAFHA10",
      paymentMethod: "cod",
      paymentStatus: "pending",
      status: "Pending",
      address: {
        fullName: "Ayesha Khan",
        phone: "0300 8240191",
        line1: "House 14, Street 7",
        area: "Clifton Block 5",
        city: "Karachi",
        province: "Sindh",
        postalCode: "75600",
      },
    },
    {
      id: "SF-240790",
      customerId: "c-hamza",
      createdAt: "2026-09-18T14:40:00.000Z",
      items: [{ productId: "namal", title: "Namal", quantity: 1, price: 1890 }],
      subtotal: 1890,
      shipping: 150,
      discount: 0,
      total: 2040,
      paymentMethod: "online",
      paymentStatus: "paid",
      status: "Confirmed",
      address: {
        fullName: "Hamza Raza",
        phone: "0321 4550190",
        line1: "Flat 3B, Al-Habib Heights",
        area: "Gulshan-e-Iqbal",
        city: "Karachi",
        province: "Sindh",
        postalCode: "75300",
      },
    },
    {
      id: "SF-240612",
      customerId: "c-sana",
      createdAt: "2026-09-12T11:05:00.000Z",
      items: [
        {
          productId: "the-alchemist",
          title: "The Alchemist",
          quantity: 2,
          price: 990,
        },
      ],
      subtotal: 1980,
      shipping: 150,
      discount: 0,
      total: 2130,
      paymentMethod: "cod",
      paymentStatus: "paid",
      status: "Processing",
      address: {
        fullName: "Sana Mir",
        phone: "0333 2108890",
        line1: "C-19, Block 13-D",
        area: "Gulshan-e-Iqbal",
        city: "Karachi",
        province: "Sindh",
        postalCode: "75300",
      },
    },
    {
      id: "SF-240501",
      customerId: "c-farah",
      createdAt: "2026-09-02T16:22:00.000Z",
      items: [
        { productId: "raja-gidh", title: "Raja Gidh", quantity: 1, price: 990 },
      ],
      subtotal: 990,
      shipping: 350,
      discount: 0,
      total: 1340,
      paymentMethod: "online",
      paymentStatus: "paid",
      status: "Shipped",
      address: {
        fullName: "Farah Siddiqui",
        phone: "042 111 000 00",
        line1: "44-C, Model Town",
        area: "Model Town",
        city: "Lahore",
        province: "Punjab",
        postalCode: "54700",
      },
    },
    {
      id: "SF-240388",
      customerId: "c-bilal",
      createdAt: "2026-08-22T10:00:00.000Z",
      items: [
        {
          productId: "psychology-of-money",
          title: "The Psychology of Money",
          quantity: 1,
          price: 1290,
        },
      ],
      subtotal: 1290,
      shipping: 350,
      discount: 200,
      total: 1440,
      coupon: "WELCOME200",
      paymentMethod: "online",
      paymentStatus: "paid",
      status: "Delivered",
      address: {
        fullName: "Bilal Ahmed",
        phone: "051 8890011",
        line1: "House 9, Street 12",
        area: "F-7",
        city: "Islamabad",
        province: "ICT",
        postalCode: "44000",
      },
    },
    {
      id: "SF-240210",
      customerId: "c-usman",
      createdAt: "2026-08-01T09:00:00.000Z",
      items: [{ productId: "zavia", title: "Zavia", quantity: 1, price: 850 }],
      subtotal: 850,
      shipping: 350,
      discount: 0,
      total: 1200,
      paymentMethod: "cod",
      paymentStatus: "refunded",
      status: "Returned",
      address: {
        fullName: "Usman Javed",
        phone: "022 2610090",
        line1: "Bungalow 2, Latifabad",
        area: "Unit 6",
        city: "Hyderabad",
        province: "Sindh",
        postalCode: "71000",
      },
    },
    {
      id: "SF-239901",
      customerId: "c-ayesha",
      createdAt: "2026-07-15T13:00:00.000Z",
      items: [
        {
          productId: "jannat-ke-pattay",
          title: "Jannat Ke Pattay",
          quantity: 1,
          price: 1450,
        },
      ],
      subtotal: 1450,
      shipping: 150,
      discount: 0,
      total: 1600,
      paymentMethod: "cod",
      paymentStatus: "failed",
      status: "Cancelled",
      address: {
        fullName: "Ayesha Khan",
        phone: "0300 8240191",
        line1: "House 14, Street 7",
        area: "Clifton Block 5",
        city: "Karachi",
        province: "Sindh",
        postalCode: "75600",
      },
    },
  ];

  const reviews: any[] = seedReviews.map((r, i) => ({
    ...r,
    customerId: customers[i % customers.length]?.id,
    status: i === 1 ? "pending" : "approved",
  }));

  const coupons: AdminCoupon[] = seedCoupons.map((c, i) => ({
    id: `cpn-${c.code.toLowerCase()}`,
    code: c.code,
    label: c.label,
    type: c.type,
    value: c.value,
    minOrder: c.minSubtotal ?? 0,
    maxDiscount: c.type === "percent" ? 800 : undefined,
    startDate: "2026-01-01",
    expiryDate: i === 2 ? "2026-12-31" : "2027-03-31",
    usageLimit: 200,
    usedCount: 12 + i * 9,
    active: true,
  }));

  const wishlist: WishlistEntry[] = [
    {
      id: "w1",
      customerId: "c-ayesha",
      productId: "aab-e-hayat",
      createdAt: "2026-09-01T10:00:00.000Z",
    },
    {
      id: "w2",
      customerId: "c-sana",
      productId: "atomic-habits",
      createdAt: "2026-09-08T10:00:00.000Z",
    },
    {
      id: "w3",
      customerId: "c-hamza",
      productId: "bang-e-dara",
      createdAt: "2026-09-11T10:00:00.000Z",
    },
    {
      id: "w4",
      customerId: "c-farah",
      productId: "nuskha-hae-wafa",
      createdAt: "2026-09-14T10:00:00.000Z",
    },
  ];

  return {
    products,
    categories,
    authors,
    customers,
    orders,
    reviews,
    coupons,
    wishlist,
    settings: {
      storeName: SITE.name,
      logoText: SITE.name,
      email: SITE.email,
      phone: SITE.phone,
      whatsapp: SITE.whatsapp,
      address: SITE.address,
      hours: SITE.hours,
      shippingInfo: `${SITE.karachiDelivery} ${SITE.pakistanDelivery}`,
      returnPolicy:
        "Unused copies in original condition may be returned within 7 days. Damaged parcels: photograph and write within 48 hours.",
      instagram: "https://instagram.com/safha.pk",
      facebook: "https://facebook.com/safha.pk",
      whatsappLink: "https://wa.me/923008240190",
      cashOnDelivery: true,
      onlinePayments: true,
      jazzCash: true,
      easyPaisa: true,
      cards: true,
    },
  };
}
