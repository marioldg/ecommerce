import { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const types = {
  ADD_ITEM: "ADD_ITEM",
  REMOVE_ITEM: "REMOVE_ITEM",
  SET_QTY: "SET_QTY",
  INC: "INC",
  DEC: "DEC",
  CLEAR: "CLEAR",
};

function cartReducer(state, action) {
  switch (action.type) {
    case types.ADD_ITEM: {
      const p = action.payload;
      const exists = state.items.find((i) => i.id === p.id);
      let items;
      if (exists) {
        items = state.items.map((i) =>
          i.id === p.id ? { ...i, qty: i.qty + 1 } : i
        );
      } else {
        items = [...state.items, { ...p, qty: 1 }];
      }
      return { ...state, items };
    }
    case types.REMOVE_ITEM:
      return { ...state, items: state.items.filter((i) => i.id !== action.payload) };
    case types.SET_QTY: {
      const { id, qty } = action.payload;
      return {
        ...state,
        items: state.items.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)),
      };
    }
    case types.INC:
      return {
        ...state,
        items: state.items.map((i) => (i.id === action.payload ? { ...i, qty: i.qty + 1 } : i)),
      };
    case types.DEC:
      return {
        ...state,
        items: state.items
          .map((i) => (i.id === action.payload ? { ...i, qty: i.qty - 1 } : i))
          .filter((i) => i.qty > 0),
      };
    case types.CLEAR:
      return { ...state, items: [] };
    default:
      return state;
  }
}

const STORAGE_KEY = "reactshop_cart_v1";

function loadInitialState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { items: [] };
}

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadInitialState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const api = useMemo(() => {
    const totalItems = state.items.reduce((a, i) => a + i.qty, 0);
    const totalPrice = state.items.reduce((a, i) => a + i.qty * i.price, 0);
    return {
      items: state.items,
      totalItems,
      totalPrice,
      addItem: (p) => dispatch({ type: types.ADD_ITEM, payload: p }),
      removeItem: (id) => dispatch({ type: types.REMOVE_ITEM, payload: id }),
      setQty: (id, qty) => dispatch({ type: types.SET_QTY, payload: { id, qty } }),
      inc: (id) => dispatch({ type: types.INC, payload: id }),
      dec: (id) => dispatch({ type: types.DEC, payload: id }),
      clear: () => dispatch({ type: types.CLEAR }),
    };
  }, [state]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
