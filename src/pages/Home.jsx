import { Link } from "react-router-dom";
import { products } from "../data/products.js";
import ProductCard from "../components/ProductCard.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Home() {
  /**
   * Obtenemos la función addItem desde el contexto global del carrito.
   * El contexto (CartContext) nos permite acceder y modificar el estado
   * del carrito desde cualquier punto de la aplicación sin necesidad de
   * prop drilling (pasar props manualmente por múltiples niveles).
   */
  const { addItem } = useCart();

  /**
   * Selección inicial de productos destacados que se mostrarán en la
   * sección "Top Ventas". En este caso, se toman los primeros cuatro
   * elementos del array global de productos.
   *
   * Nota: `products` actúa como nuestra "base de datos" local simulada.
   */
  const destacados = products.slice(0, 4);

  return (
    <>
      <section className="hero container">
        <div className="hero-inner">
          <div>
            <div className="kicker">REACTSHOP</div>
            <h1 className="h1">
              Tecnología con estilo <br />al mejor precio
            </h1>

            {/* Descripción breve de la propuesta de valor de la tienda.
               La clase "lead" se usa para texto destacado secundario. */}
            <p className="lead">
              Explora un catálogo cuidado: audio, periféricos, monitores, smart home y más.
              Compra con una experiencia fluida y un carrito inteligente.
            </p>

            {/* Botones de acción principal:
               - "Explorar catálogo": lleva al listado completo de productos (/catalog)
               - "Ver carrito": permite saltar directamente al carrito (/cart)
               
               Se utilizan dos estilos de botón distintos:
               - .btn.btn-primary → acción principal
               - .btn.btn-ghost   → acción secundaria menos llamativa
               
               Esto refuerza visualmente la jerarquía de acciones.
            */}
            <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
              <Link to="/catalog" className="btn btn-primary">
                Explorar catálogo
              </Link>
              <Link to="/cart" className="btn btn-ghost">
                Ver carrito
              </Link>
            </div>
          </div>

          <div>
          
            <div className="card" style={{ padding: 16 }}>
              <div className="muted" style={{ marginBottom: 8 }}>
                Top Ventas
              </div>

              {/* 
                Grid que renderiza dinámicamente las tarjetas de producto destacadas.
                Para cada producto en `destacados` se renderiza <ProductCard />.

                ProductCard es un componente reutilizable que encapsula:
                - imagen del producto
                - nombre, precio, marca...
                - botón para añadir al carrito
                - link a la página de detalle del producto

                onAdd={() => addItem(p)}:
                - Pasamos una función que, cuando se ejecute dentro de ProductCard,
                  añadirá ese producto concreto al carrito global.
              */}
              <div className="grid">
                {destacados.map((p) => (
                  <ProductCard
                    key={p.id}            // React necesita una key estable al mapear listas
                    product={p}           // Objeto completo del producto a renderizar
                    onAdd={() => addItem(p)} // Acción para añadir al carrito
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*
        === Sección "Recomendados para ti" ===
        Esta segunda sección continúa debajo del hero.

        Se usa las funciones products.slice(0, 4) y products.slice(4, 8)
        para tomar 8 productos en total, divididos en dos bloques:

          Los primeros 4 como “Top Ventas”.
          Los siguientes 4 como “Recomendados”.
          
      */}
      <section className="container" style={{ marginTop: 22 }}>
        <h2 style={{ margin: "0 0 10px" }}>Recomendados para ti</h2>

        <div className="grid">
          {products.slice(4, 8).map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onAdd={() => addItem(p)}
            />
          ))}
        </div>
      </section>
    </>
  );
}
