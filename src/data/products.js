export const products = [
  {
    id: "p-1001",
    name: "Auriculares Inalámbricos Pro",
    brand: "Voxon",
    category: "Audio",
    price: 59.99,
    image:
      "/products/auriculares.jpeg",
    stock: 12,
    rating: 4.5,
    tags: ["bluetooth", "microfono"],
  },
  {
    id: "p-1002",
    name: "Teclado Mecánico 60%",
    brand: "KeyLynx",
    category: "Periféricos",
    price: 74.9,
    image:
      "/products/teclado.jpeg",
    stock: 7,
    rating: 4.7,
    tags: ["switches rojos", "rgb"],
  },
  {
    id: "p-1003",
    name: "Ratón Óptico 8K",
    brand: "SwiftMouse",
    category: "Periféricos",
    price: 39.5,
    image:
      "/products/ratonOpt.jpeg",
    stock: 20,
    rating: 4.3,
    tags: ["ergonómico", "gaming"],
  },
  {
    id: "p-1004",
    name: "Monitor 27'' 144Hz",
    brand: "ZenView",
    category: "Monitores",
    price: 199.0,
    image:
      "/products/monitor.jpeg",
    stock: 5,
    rating: 4.6,
    tags: ["144hz", "1ms"],
  },
  {
    id: "p-1005",
    name: "Altavoz Bluetooth Portátil",
    brand: "BeatBox",
    category: "Audio",
    price: 44.99,
    image:
      "/products/altavoz.jpeg",
    stock: 18,
    rating: 4.2,
    tags: ["impermeable", "party"],
  },
  {
    id: "p-1006",
    name: "SSD NVMe 1TB Gen4",
    brand: "FlashCore",
    category: "Almacenamiento",
    price: 89.99,
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop",
    stock: 14,
    rating: 4.8,
    tags: ["3500MB/s"],
  },
  {
    id: "p-1007",
    name: "Disco Duro Externo 2TB",
    brand: "DataGo",
    category: "Almacenamiento",
    price: 64.95,
    image:
      "/products/disco.jpeg",
    stock: 25,
    rating: 4.4,
    tags: ["USB 3.2"],
  },
  {
    id: "p-1008",
    name: "Portátil 14\" i5 16GB/512GB",
    brand: "NoteX",
    category: "Portátiles",
    price: 699.0,
    image:
     "/products/portatil.jpeg" ,
    stock: 6,
    rating: 4.6,
    tags: ["ofimática", "ligero"],
  },
  {
    id: "p-1009",
    name: "Webcam FullHD 1080p",
    brand: "CamLink",
    category: "Periféricos",
    price: 29.99,
    image:
      "/products/webcam.jpeg",
    stock: 30,
    rating: 4.1,
    tags: ["streaming", "zoom"],
  },
  {
    id: "p-1010",
    name: "Barra de Sonido 2.1",
    brand: "CineBar",
    category: "Audio",
    price: 129.0,
    image:
      "/products/barra.jpeg",
    stock: 10,
    rating: 4.5,
    tags: ["subwoofer", "hdmi arc"],
  },
  {
    id: "p-1011",
    name: "Smart Bulb RGB WiFi (pack 2)",
    brand: "HomeLite",
    category: "Smart Home",
    price: 19.99,
    image:
      "/products/asistente.jpeg",
    stock: 50,
    rating: 4.0,
    tags: ["alexa", "google"],
  },
  {
    id: "p-1012",
    name: "Cámara IP 2K Interior",
    brand: "SafeCam",
    category: "Smart Home",
    price: 36.99,
    image:
     "/products/camara.jpeg",
    stock: 22,
    rating: 4.3,
    tags: ["detección movimiento", "nube"],
  },
];

// Derivar categorías con conteo
export const categories = (() => {
  const map = new Map();
  for (const p of products) {
    map.set(p.category, (map.get(p.category) ?? 0) + 1);
  }
  return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
})();
