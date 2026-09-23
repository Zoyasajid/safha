"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getBookById } from "@/lib/books";
import type { Address, CartItem, Order, User } from "@/types";

type Toast = { id: number; message: string } | null;

type StoreContextValue = {
  cart: CartItem[];
  wishlist: string[];
  user: User | null;
  addresses: Address[];
  orders: Order[];
  toast: Toast;
  addToCart: (bookId: string, quantity?: number) => void;
  updateQty: (bookId: string, quantity: number) => void;
  removeFromCart: (bookId: string) => void;
  clearCart: () => void;
  toggleWishlist: (bookId: string) => void;
  isWishlisted: (bookId: string) => boolean;
  login: (user: User) => void;
  register: (user: User) => void;
  logout: () => void;
  saveAddress: (address: Address) => void;
  removeAddress: (id: string) => void;
  placeOrder: (order: Order) => void;
  cartCount: number;
  cartSubtotal: number;
};

const StoreContext = createContext<StoreContextValue | null>(null);
const STORAGE_KEY = "safha-store-v1";

type Persisted = {
  cart: CartItem[];
  wishlist: string[];
  user: User | null;
  addresses: Address[];
  orders: Order[];
};

const defaultAddresses: Address[] = [
  {
    id: "addr-clifton",
    label: "Home",
    fullName: "Reader at Safha",
    phone: "0300 8240190",
    line1: "House 14, Street 7",
    area: "Clifton Block 5",
    city: "Karachi",
    province: "Sindh",
    postalCode: "75600",
    isDefault: true,
  },
];

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>(defaultAddresses);
  const [orders, setOrders] = useState<Order[]>([]);
  const [toast, setToast] = useState<Toast>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Persisted;
        setCart(parsed.cart ?? []);
        setWishlist(parsed.wishlist ?? []);
        setUser(parsed.user ?? null);
        setAddresses(parsed.addresses?.length ? parsed.addresses : defaultAddresses);
        setOrders(parsed.orders ?? []);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const payload: Persisted = { cart, wishlist, user, addresses, orders };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [hydrated, cart, wishlist, user, addresses, orders]);

  const notify = useCallback((message: string) => {
    const id = Date.now();
    setToast({ id, message });
    window.setTimeout(() => {
      setToast((t) => (t?.id === id ? null : t));
    }, 2400);
  }, []);

  const addToCart = useCallback(
    (bookId: string, quantity = 1) => {
      const book = getBookById(bookId);
      if (!book || book.stock <= 0) {
        notify("This title is currently out of stock.");
        return;
      }
      setCart((prev) => {
        const existing = prev.find((i) => i.bookId === bookId);
        const nextQty = (existing?.quantity ?? 0) + quantity;
        if (nextQty > book.stock) {
          notify(`Only ${book.stock} copies available.`);
          return prev;
        }
        if (existing) {
          return prev.map((i) =>
            i.bookId === bookId ? { ...i, quantity: nextQty } : i,
          );
        }
        return [...prev, { bookId, quantity }];
      });
      notify("Added to your basket.");
    },
    [notify],
  );

  const updateQty = useCallback((bookId: string, quantity: number) => {
    const book = getBookById(bookId);
    if (!book) return;
    if (quantity <= 0) {
      setCart((prev) => prev.filter((i) => i.bookId !== bookId));
      return;
    }
    setCart((prev) =>
      prev.map((i) =>
        i.bookId === bookId
          ? { ...i, quantity: Math.min(quantity, book.stock) }
          : i,
      ),
    );
  }, []);

  const removeFromCart = useCallback((bookId: string) => {
    setCart((prev) => prev.filter((i) => i.bookId !== bookId));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback(
    (bookId: string) => {
      setWishlist((prev) => {
        const has = prev.includes(bookId);
        notify(has ? "Removed from wishlist." : "Saved to wishlist.");
        return has ? prev.filter((id) => id !== bookId) : [...prev, bookId];
      });
    },
    [notify],
  );

  const isWishlisted = useCallback(
    (bookId: string) => wishlist.includes(bookId),
    [wishlist],
  );

  const login = useCallback(
    (next: User) => {
      setUser(next);
      notify(`Welcome back, ${next.name.split(" ")[0]}.`);
    },
    [notify],
  );

  const register = useCallback(
    (next: User) => {
      setUser(next);
      notify("Your Safha account is ready.");
    },
    [notify],
  );

  const logout = useCallback(() => {
    setUser(null);
    notify("Signed out.");
  }, [notify]);

  const saveAddress = useCallback((address: Address) => {
    setAddresses((prev) => {
      const rest = address.isDefault
        ? prev.map((a) => ({ ...a, isDefault: false }))
        : prev;
      const exists = rest.some((a) => a.id === address.id);
      return exists
        ? rest.map((a) => (a.id === address.id ? address : a))
        : [...rest, address];
    });
    notify("Address saved.");
  }, [notify]);

  const removeAddress = useCallback((id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const placeOrder = useCallback(
    (order: Order) => {
      setOrders((prev) => [order, ...prev]);
      setCart([]);
      notify("Order placed. Shukriya for shopping at Safha.");
    },
    [notify],
  );

  const cartCount = cart.reduce((n, i) => n + i.quantity, 0);
  const cartSubtotal = cart.reduce((n, i) => {
    const book = getBookById(i.bookId);
    return n + (book ? book.price * i.quantity : 0);
  }, 0);

  const value = useMemo(
    () => ({
      cart,
      wishlist,
      user,
      addresses,
      orders,
      toast,
      addToCart,
      updateQty,
      removeFromCart,
      clearCart,
      toggleWishlist,
      isWishlisted,
      login,
      register,
      logout,
      saveAddress,
      removeAddress,
      placeOrder,
      cartCount,
      cartSubtotal,
    }),
    [
      cart,
      wishlist,
      user,
      addresses,
      orders,
      toast,
      addToCart,
      updateQty,
      removeFromCart,
      clearCart,
      toggleWishlist,
      isWishlisted,
      login,
      register,
      logout,
      saveAddress,
      removeAddress,
      placeOrder,
      cartCount,
      cartSubtotal,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
