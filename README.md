# Olympus Drinks Bar · Sitio web

Sitio de una sola página para Olympus Drinks Bar (Carrera 75 # 24-11, segundo piso, Modelia, Bogotá).
Es HTML, CSS y JavaScript puro: no necesita instalar nada, ni compilar, ni base de datos.

## Estructura

```
olympus-drinks/
├── index.html            Página principal (inicio, productos, contacto, sugerencias)
├── gracias.html          Se muestra si alguien envía el formulario sin JavaScript
├── privacidad.html       Política de tratamiento de datos (completar antes de publicar)
├── 404.html              Página para direcciones que no existen
├── css/styles.css        Todo el diseño
├── js/data.js            ★ SABORES, PRECIOS, HORARIOS Y ENLACES (lo que más vas a editar)
├── js/main.js            Comportamiento: carrusel, vaso interactivo, horario, formulario
├── assets/img/           Imágenes (dioses en WebP, micheladas, favicon, imagen para redes)
├── assets/fonts/         Fuentes Cinzel y Barlow (licencia libre OFL, incluida)
├── netlify.toml          Configuración de Netlify
├── robots.txt, sitemap.xml
└── README.md
```

## Cómo editar el contenido

Casi todo se cambia en **`js/data.js`**. Cada sección tiene comentarios en español.

### Cambiar los sabores de granizado

Busca `sabores:` y edita la lista. Cada sabor es una línea:

```js
{ nombre: "Fresa", licor: "Whisky", colores: ["#C81D4E", "#FF3D6E", "#FFB0C4"], disponible: true, nuevo: false },
```

- `licor`: el nombre del licor, o `null` (sin comillas) si es sin alcohol.
- `colores`: tres colores de abajo hacia arriba. Así se pinta el vaso y la gota del sabor.
- `disponible: false` oculta el sabor sin borrarlo.
- `nuevo: true` le pone la marca "Nuevo".
- Entre cada sabor va una coma. Al último no le hace falta.

Para sacar colores: https://htmlcolorcodes.com

### Cambiar precios

Los precios van como número, sin puntos ni signo: `16000`, no `"$16.000"`. El sitio les da formato solo.
Los precios que aparecen en el banner principal ("desde $9.000", "desde $90.000", "$18.000") también se actualizan solos.

### Agregar el enlace de DiDi Food

En `pedidos:` pega el enlace entre las comillas:

```js
didi: "https://..."
```

Mientras esté vacío, los botones de DiDi se muestran como "Muy pronto".

### Cambiar el horario

En `horarios:` cada línea es un día (`0` = domingo … `6` = sábado). Si cierran después de medianoche, escribe la hora tal cual (`"03:00"`).
El aviso "Abierto ahora / Cerrado" usa la hora de Bogotá.

> El horario también está escrito en dos lugares fijos que hay que actualizar a mano si cambia: el texto de la diapositiva de Apolo en `index.html` y el bloque `openingHoursSpecification` al inicio de `index.html` (lo usa Google).

### Cambiar o agregar diapositivas del banner

En `index.html`, busca `<article class="slide"`. Cada diapositiva tiene:

- `style="--accent:#FF2E63"`: el color neón de esa diapositiva.
- La imagen (versiones `-sm.webp` y `-lg.webp`).
- Título, texto y botones.

Para agregar una: copia un `<article class="slide">…</article>` completo y agrega su botón en `.hero__tabs` con el mismo color. Actualiza los textos `aria-label="1 de 7"`.

**Imágenes nuevas:** usa formato vertical 2:3 con fondo negro, como las de los dioses. Conviértelas a WebP en https://squoosh.app, con un ancho de 560 px (`-sm`) y otro de 960 px (`-lg`).

## Probar en tu computador

Puedes abrir `index.html` con doble clic. Todo funciona excepto el envío del formulario, que solo funciona en Netlify.

Para verlo como en un servidor real, abre una terminal en la carpeta y ejecuta:

```bash
python3 -m http.server 8000
```

Después entra a http://localhost:8000

## Subir a GitHub

**Opción sin terminal:**

1. Entra a https://github.com/new, ponle un nombre (por ejemplo `olympus-drinks-web`) y crea el repositorio.
2. Haz clic en "uploading an existing file".
3. Arrastra **el contenido** de la carpeta. Deben quedar `index.html`, `css/`, `js/`, etc. en la raíz, no dentro de otra carpeta.
4. Haz clic en "Commit changes".

**Con terminal:**

```bash
cd olympus-drinks
git init
git add .
git commit -m "Sitio Olympus Drinks Bar"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/olympus-drinks-web.git
git push -u origin main
```

## Publicar en Netlify

1. Entra a https://app.netlify.com y ve a **Add new project → Import an existing project → GitHub**.
2. Elige el repositorio y configura:
   - **Branch:** `main`
   - **Build command:** vacío
   - **Publish directory:** `.`
3. **Importante, antes de desplegar:** ve a **Project configuration → Forms** y activa **Enable form detection**. Si el sitio ya estaba publicado, activa la detección y vuelve a desplegar (**Deploys → Trigger deploy**). Sin este paso el formulario no guarda nada.
4. Haz clic en **Deploy**.

Cada vez que subas cambios a GitHub, Netlify publica la nueva versión sola en uno o dos minutos.

### Ver las sugerencias recibidas

En Netlify, entra a **Forms → sugerencias**.
Para recibirlas por correo: **Project configuration → Notifications → Emails and webhooks → Form submission notifications**.

El formulario tiene un campo trampa contra robots y Netlify filtra spam automáticamente (revisa también la pestaña "Spam submissions").

### Usar el sitio existente

Si quieres reemplazar el sitio actual (`olympus-drinks-bar.netlify.app`), conecta este repositorio a ese mismo proyecto de Netlify en **Project configuration → Build & deploy → Link repository**, o borra el proyecto viejo y usa ese nombre en el nuevo.

## Si usan un dominio propio

Cuando tengan un dominio (por ejemplo `olympusdrinks.com`), reemplaza `https://olympus-drinks-bar.netlify.app` por el dominio nuevo en:

- `index.html`: etiquetas `canonical`, `og:url`, `og:image` y el bloque JSON-LD.
- `privacidad.html`: etiqueta `canonical`.
- `robots.txt` y `sitemap.xml`.

## Antes de publicar

- [ ] Completar los datos entre [corchetes] en `privacidad.html` (razón social, NIT, correo) y hacerla revisar.
- [ ] Confirmar precios leídos del menú: Heineken y Budweiser a $5.000, shot grande a $6.000.
- [ ] Confirmar ingredientes del Poseidón Azul (aguardiente o vodka).
- [ ] Confirmar el teléfono: los flyers dicen 322 286 0818 y el sitio usa 312 451 6239.
- [ ] Agregar el enlace de DiDi Food cuando esté listo.
- [ ] Activar la detección de formularios en Netlify.
- [ ] Probar el formulario una vez publicado.
