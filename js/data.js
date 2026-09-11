/* =====================================================================
   OLYMPUS DRINKS BAR · DATOS DEL SITIO
   ---------------------------------------------------------------------
   Este es el ÚNICO archivo que hay que tocar para cambiar sabores,
   precios, horarios o enlaces. No hace falta saber de diseño.

   Reglas rápidas:
   - Los precios van en número, sin puntos ni signo:  16000  (no "$16.000")
   - Para ocultar algo sin borrarlo:  disponible: false
   - Los colores son códigos HEX (puedes sacarlos de https://htmlcolorcodes.com)
   - Respeta las comas entre elementos y las comillas en los textos.
   ===================================================================== */

window.OLYMPUS = {

  /* ---------- Negocio y contacto ---------- */
  negocio: {
    nombre: "Olympus Drinks Bar",
    telefono: "312 451 6239",
    whatsapp: "573124516239",               // con indicativo 57, sin espacios ni +
    direccion: "Carrera 75 # 24-11, segundo piso",
    barrio: "Modelia",
    ciudad: "Bogotá",
    mapsQuery: "Carrera 75 # 24-11, Modelia, Bogotá, Colombia"
  },

  /* ---------- Pedidos a domicilio ----------
     Si un enlace queda vacío (""), el botón se muestra como "Muy pronto". */
  pedidos: {
    rappi: "https://www.rappi.com.co/restaurantes/900505195-olympus-drinks-bar",
    didi: ""   // ← pega aquí el enlace de DiDi Food cuando lo tengan
  },

  redes: {
    instagram: "https://www.instagram.com/olympusdrinksbar/",
    facebook: "https://www.facebook.com/people/Olympus-Drinks-Bar-Granizados-Modelia/61579339652137/",
    tiktok: "https://www.tiktok.com/@olympusdrinksbar"
  },

  /* ---------- Horario ----------
     dia: 0 = domingo, 1 = lunes ... 6 = sábado
     Si cierran después de medianoche, escribe la hora de cierre tal cual ("03:00"). */
  horarios: [
    { dia: 3, abre: "18:00", cierra: "23:00" },
    { dia: 4, abre: "18:00", cierra: "23:00" },
    { dia: 5, abre: "16:00", cierra: "03:00" },
    { dia: 6, abre: "18:00", cierra: "03:00" }
  ],

  /* ---------- Granizados: tamaños ---------- */
  tamanos: [
    { id: "9oz",    nombre: "9 oz",   precio: 9000,  forma: "vaso",   escala: 0.62 },
    { id: "16oz",   nombre: "16 oz",  precio: 16000, forma: "vaso",   escala: 0.82 },
    { id: "22oz",   nombre: "22 oz",  precio: 20000, forma: "vaso",   escala: 1 },
    { id: "pecera", nombre: "Pecera", precio: 27000, forma: "pecera", escala: 1 }
  ],

  /* ---------- Granizados: sabores ----------
     ESTOS CAMBIAN SEGUIDO. Para agregar uno, copia un bloque { ... },
     pégalo debajo y cambia los datos.
       nombre:     el sabor
       licor:      "Whisky", "Vodka", "Ginebra", "Ron", "Tequila", "Aguardiente"...
                   o null si es sin alcohol
       colores:    3 colores de abajo hacia arriba (así se pinta el vaso)
       disponible: false para ocultarlo hoy
       nuevo:      true para mostrar la marca "Nuevo"                          */
  sabores: [
    { nombre: "Fresa",     licor: "Whisky",  colores: ["#C81D4E", "#FF3D6E", "#FFB0C4"], disponible: true, nuevo: false },
    { nombre: "Maracuyá",  licor: "Vodka",   colores: ["#F59E0B", "#FFC93C", "#FFF1A8"], disponible: true, nuevo: false },
    { nombre: "Bubaloo",   licor: "Ginebra", colores: ["#C04BD9", "#FF78C8", "#B9F3FF"], disponible: true, nuevo: false },
    { nombre: "Mandarina", licor: null,      colores: ["#E8590C", "#FF8C1A", "#FFCB7A"], disponible: true, nuevo: false }

    // Ejemplo para agregar otro (quita las dos barras // del inicio y pon una coma al final del anterior):
    // { nombre: "Mora", licor: "Ron", colores: ["#5B21B6", "#8B5CF6", "#DDD6FE"], disponible: true, nuevo: true }
  ],

  /* ---------- Peceras para 5 personas ---------- */
  peceras: [
    {
      nombre: "Corona",
      precio: 90000,
      color: "#FFC93C",
      incluye: ["Pecera gigante escarchada", "Mix de granizado a tu elección", "Mix de gomitas", "4 shots en jeringa", "2 Coronas"]
    },
    {
      nombre: "Stella Artois",
      precio: 95000,
      color: "#FF3DA8",
      incluye: ["Pecera gigante escarchada", "Mix de granizado a tu elección", "Mix de gomitas", "4 shots en jeringa", "2 Stella Artois"]
    },
    {
      nombre: "Aguardiente",
      precio: 140000,
      color: "#2EE6E6",
      incluye: ["Pecera gigante escarchada", "Mix de granizado a tu elección", "Mix de gomitas", "4 shots en jeringa", "Media de Aguardiente Amarillo"]
    }
  ],

  /* ---------- Cocteles ----------
     vaso: "rocas", "huracan", "copa", "alto", "miel" (define el dibujo del vaso) */
  cocteles: [
    { dios: "Zeus",     nombre: "Orange", precio: 18000, color: "#FFA630", vaso: "rocas",   ingredientes: "Ron blanco, jugo de naranja, granadina y hielo" },
    { dios: "Poseidón", nombre: "Azul",   precio: 18000, color: "#35C8FF", vaso: "huracan", ingredientes: "Aguardiente o vodka, curaçao azul y soda de limón" },
    { dios: "Afrodita", nombre: "Rosé",   precio: 18000, color: "#FF3DA8", vaso: "copa",    ingredientes: "Ginebra, jugo de frutos rojos y soda" },
    { dios: "Hefesto",  nombre: "Fuego",  precio: 18000, color: "#FF5A36", vaso: "alto",    ingredientes: "Tequila, pulpa de mango, Tajín y limón" },
    { dios: "Apolo",    nombre: "Honey",  precio: 18000, color: "#F2B53A", vaso: "miel",    ingredientes: "Whiskey, jugo de manzana, jugo de limón y sirope de miel" }
  ],

  /* ---------- Micheladas de los dioses ----------
     icono: "hermes", "dioniso", "ares", "helios", "cronos" */
  micheladas: {
    sabores: [
      { dios: "Hermes",  fruta: "Limón",    color: "#9BE33B", icono: "hermes" },
      { dios: "Dioniso", fruta: "Piña",     color: "#A855F7", icono: "dioniso" },
      { dios: "Ares",    fruta: "Mango",    color: "#FF3B3B", icono: "ares" },
      { dios: "Helios",  fruta: "Naranja",  color: "#FFB020", icono: "helios" },
      { dios: "Cronos",  fruta: "Maracuyá", color: "#8B5CF6", icono: "cronos" }
    ],
    cervezas: [
      { nombre: "Águila",               precio: 9000 },
      { nombre: "Poker",                precio: 9000 },
      { nombre: "Budweiser",            precio: 9000 },
      { nombre: "Heineken",             precio: 9000 },
      { nombre: "Club Colombia Dorada", precio: 12000 },
      { nombre: "Corona",               precio: 16000 },
      { nombre: "Stella Artois",        precio: 16000 }
    ]
  },

  /* ---------- Cervezas, shots y bebidas ---------- */
  cervezas: [
    { nombre: "Águila",               precio: 5000 },
    { nombre: "Poker",                precio: 5000 },
    { nombre: "Budweiser",            precio: 5000 },
    { nombre: "Heineken",             precio: 5000 },
    { nombre: "Coronita",             precio: 7000 },
    { nombre: "Club Colombia Dorada", precio: 7500 },
    { nombre: "Corona",               precio: 11000 },
    { nombre: "Stella Artois",        precio: 11000 }
  ],
  shots: [
    { nombre: "Shot grande",      precio: 6000 },
    { nombre: "Shot pequeño",     precio: 4000 },
    { nombre: "Jeringa",          precio: 2500 }
  ],
  bebidas: [
    { nombre: "Agua",         precio: 4000 },
    { nombre: "Agua con gas", precio: 5000 }
  ]
};
