import { createContext, useContext, useEffect, useMemo, useReducer } from "react";

// Defino los tipos de acciones que puede hacer el carrito.
const types = {
  ADD_ITEM: "ADD_ITEM",
  REMOVE_ITEM: "REMOVE_ITEM",
  SET_QTY: "SET_QTY",
  INC: "INC",
  DEC: "DEC",
  CLEAR: "CLEAR",
};

// Reducer del carrito. Recibe el estado actual y una acción, y devuelve el nuevo estado.
// Básicamente aquí decido cómo cambia el carrito cuando se añade, borra, etc.
function cartReducer(state, action) {
  switch (action.type) {
    case types.ADD_ITEM: {
      const p = action.payload;
      // miro si el producto ya está en el carrito
      const exists = state.items.find((i) => i.id === p.id);
      let items;
      if (exists) {
        // si ya estaba, le sumo 1 a la cantidad
        items = state.items.map((i) =>
          i.id === p.id ? { ...i, qty: i.qty + 1 } : i
        );
      } else {
        // si no estaba, lo añado con cantidad inicial 1
        items = [...state.items, { ...p, qty: 1 }];
      }
      return { ...state, items };
    }

    case types.REMOVE_ITEM:
      // saco del carrito el item cuyo id coincide con el payload
      return { ...state, items: state.items.filter((i) => i.id !== action.payload) };

    case types.SET_QTY: {
      // establezco una cantidad concreta para un producto
      // si ponen 0 o negativo, lo limito a mínimo 1
      const { id, qty } = action.payload;
      return {
        ...state,
        items: state.items.map((i) =>
          (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)
        ),
      };
    }

    case types.INC:
      // incremento en 1 la cantidad del producto con ese id
      return {
        ...state,
        items: state.items.map((i) =>
          (i.id === action.payload ? { ...i, qty: i.qty + 1 } : i)
        ),
      };

    case types.DEC:
      // decremento en 1 la cantidad. Si llega a 0, lo quito del carrito.
      return {
        ...state,
        items: state.items
          .map((i) =>
            (i.id === action.payload ? { ...i, qty: i.qty - 1 } : i)
          )
          .filter((i) => i.qty > 0),
      };

    case types.CLEAR:
      // vacío el carrito entero
      return { ...state, items: [] };

    default:
      return state;
  }
}

// Clave que uso en localStorage para guardar el carrito
const STORAGE_KEY = "reactshop_cart_v1";

// Cargo el estado inicial del carrito. Si ya había datos en localStorage, los uso.
// Así al recargar la página el carrito no se pierde.
function loadInitialState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  // si no había nada guardado, empiezo con carrito vacío
  return { items: [] };
}

// Creo el contexto del carrito. Aquí se va a guardar la "API" del carrito
// (items, totalPrice, funciones para añadir, etc.)
const CartContext = createContext(null);

// CartProvider es el componente que envuelve a la app y da acceso al carrito.
// Todo lo que esté dentro de <CartProvider> puede usar useCart().
export function CartProvider({ children }) {
  // useReducer me da el estado actual del carrito y una función dispatch para enviar acciones.
  // El tercer parámetro (loadInitialState) me deja inicializar leyendo de localStorage.
  const [state, dispatch] = useReducer(cartReducer, undefined, loadInitialState);

  // Cada vez que cambie el carrito, lo guardo en localStorage.
  // Así si el usuario refresca la página no se pierde lo que tenía en el carrito.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // useMemo: calculo datos derivados del carrito (totalItems, totalPrice)
  // y también preparo las funciones públicas (addItem, inc, dec, etc.).
  // Esto se vuelve a crear solo cuando cambia el estado.
  const api = useMemo(() => {
    // total de unidades en el carrito (sumo todas las qty)
    const totalItems = state.items.reduce((a, i) => a + i.qty, 0);

    // precio total del carrito = sumatorio de (precio * cantidad)
    const totalPrice = state.items.reduce((a, i) => a + i.qty * i.price, 0);

    return {
      // array de productos que hay ahora mismo en el carrito
      items: state.items,

      // número total de unidades (para el badge del navbar, por ejemplo)
      totalItems,

      // precio total calculado
      totalPrice,

      // funciones que voy a exponer para que el resto de la app pueda modificar el carrito
      addItem: (p) => dispatch({ type: types.ADD_ITEM, payload: p }),
      removeItem: (id) => dispatch({ type: types.REMOVE_ITEM, payload: id }),
      setQty: (id, qty) => dispatch({ type: types.SET_QTY, payload: { id, qty } }),
      inc: (id) => dispatch({ type: types.INC, payload: id }),
      dec: (id) => dispatch({ type: types.DEC, payload: id }),
      clear: () => dispatch({ type: types.CLEAR }),
    };
  }, [state]);

  // Hacemos accesible toda la "api" del carrito al resto de componentes hijos.
  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

// Hook personalizado para acceder al carrito fácilmente desde cualquier componente.
// Ejemplo de uso: const { items, addItem } = useCart();
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
