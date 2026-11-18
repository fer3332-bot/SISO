# Plataforma SISO · Yorito – Empalme RN-23 (PWA)

App instalable para llenar los formatos SISO desde el celular en campo y revisarlos en la computadora.
Los datos se guardan en **Supabase** (gratis) y se sincronizan solos entre los dispositivos.
Si te quedas sin señal, la app guarda los registros en el teléfono y los envía cuando vuelve la conexión.

## Contenido del ZIP

| Archivo | Para qué sirve |
|---|---|
| `index.html`, `app.js` | La aplicación |
| `config.js` | **Aquí pegas tus claves de Supabase** (paso 1) |
| `manifest.webmanifest`, `sw.js`, `icons/` | Lo que la hace instalable (PWA) y le permite abrir sin señal |
| `supabase.sql` | Crea la base de datos y el almacenamiento de fotos (paso 1) |
| `datos-iniciales.json` | Equipos, licencias, extintores, señalización (15 rótulos del Excel) y tus movimientos de EPP ya registrados |
| `render.yaml` | Configuración para publicarla en Render |

---

## Paso 1 · Crear la base de datos en Supabase (10 minutos, una sola vez)

1. Entra a <https://supabase.com>, crea una cuenta y un proyecto nuevo (nombre: `siso-yorito`, región: la más cercana, por ejemplo *East US*). Guarda la contraseña de la base de datos.
2. En el menú izquierdo abre **SQL Editor → New query**, pega todo el contenido de `supabase.sql` y presiona **Run**. Debe decir *Success*.
3. **Tu usuario:** ve a **Authentication → Users → Add user → Create new user**, escribe tu correo y una contraseña, y marca *Auto Confirm User*.
4. **Cierra el registro público:** en **Authentication → Sign In / Providers**, desactiva **Allow new users to sign up**. Así solo entran los usuarios que tú crees.
5. Ve a **Project Settings → API** y copia:
   - **Project URL** (algo como `https://abcdxyz.supabase.co`)
   - **anon public key** (una clave larga que empieza con `eyJ…`)
6. Abre `config.js` y reemplaza `https://TU-PROYECTO.supabase.co` y `PEGA-AQUI-TU-ANON-KEY` con esos dos valores.

> La *anon key* es pública por diseño: la seguridad la dan las reglas del paso 2 (solo usuarios con sesión) y el paso 4 (nadie puede registrarse solo). **Nunca** pegues la clave `service_role`.

## Paso 2 · Publicarla (igual que tus otras apps: GitHub + Render)

1. Crea un repositorio en GitHub (por ejemplo `siso-yorito`) y sube **todos** los archivos del ZIP, con `config.js` ya editado.
2. En Render: **New → Static Site**, conecta el repositorio.
   - Build Command: *(vacío)*
   - Publish Directory: `.`
3. Render te da una dirección `https://siso-yorito.onrender.com`. Esa es tu app.

Cada vez que subas un cambio a GitHub, Render la actualiza sola y la app instalada toma la versión nueva al abrirla con señal.

## Paso 3 · Primera entrada y datos iniciales

1. Abre la dirección de Render y entra con el correo y la contraseña del paso 1.3.
2. Como la base está vacía, aparece el botón **Cargar datos iniciales del proyecto**. Tócalo una sola vez.
3. Revisa **Registros → Inventario de EPP**: aparecen *Casco azul*, *Casco blanco* y *Chaleco normal* con sus movimientos.
   El **Casco blanco** queda en −4 porque tiene una entrega sin entrada: ábrelo y pon su **existencia inicial**.

## Paso 4 · Instalarla

- **Android (Chrome):** menú ⋮ → **Instalar aplicación** o **Agregar a pantalla principal**.
- **iPhone (Safari):** botón Compartir → **Agregar a inicio**.
- **Computadora (Chrome o Edge):** ícono de instalar ⊕ en la barra de direcciones.

Entra con el mismo usuario en todos. Lo que registras en el celular aparece en la computadora en segundos.

---

## Cómo funcionan los inventarios de EPP y botiquín

- Cada artículo (por ejemplo *Chaleco reflectivo*) es **una fila fija** del inventario, con: existencia inicial, entradas, salidas y **existencia real**.
- **+ Entrada** suma a la fila (compras o requisiciones). Cada **entrega al personal** o **baja** la resta automáticamente.
- Al escribir el artículo en una entrega, la app lo busca en el inventario aunque lo escribas en plural o sin tilde (“chalecos normales” = “Chaleco normal”). Si no existe, te avisa antes de crearlo, para no duplicar filas.
- Si una entrega deja un artículo en negativo, te avisa. También verás alertas en **Hoy** cuando un artículo llega a su **mínimo**, cuando queda en negativo o cuando un lote del botiquín está por vencer.
- Toca cualquier fila del inventario para ver su historial de entradas y salidas.

## Personal y equipos: autollenado

En **Registros → Personal del proyecto** registra a cada persona con su cargo, área y **unidad asignada**. Al llenar cualquier formato:
- si escribes el equipo (por ejemplo PS-764), la app pone sola el conductor asignado, la marca, el modelo y la placa;
- si escribes el nombre de una persona, pone su cargo y su unidad;
- en el checklist, el punto **Licencia de conducir vigente** se marca según el vencimiento registrado.

## Control de riesgo (medición de tu trabajo)

En **Informe → Control de riesgo** está la misma tabla de tu formato *Control de Riesgo 2026*, pero llena sola con lo que registras: cada mes cuenta los SOL, auditorías de equipo móvil y pesado, auditorías de EPP, pruebas de alcohol, inspecciones de extintores, escritorios, apartamentos, señalización vial y taller, reuniones y charlas. Compara cada mes contra el objetivo mensual y calcula el % acumulado contra la meta anual. Las metas se cambian con el botón **Metas**. En **Hoy** ves el avance del mes con barras.

## Excel con encabezado

Cada Excel que descargas lleva arriba el logo de la empresa, el título del proyecto, el nombre del documento, la fecha y el responsable. El título y el nombre del responsable se cambian en **Proyecto**. Para cambiar el logo, reemplaza `icons/logo-empresa.png` por otra imagen PNG con el mismo nombre.

## Respaldo

En **Proyecto → Descargar respaldo** obtienes un `.json` con todo. Con **Importar respaldo** lo restauras.
Las fotos, firmas y PDF quedan en Supabase Storage (plan gratis: 1 GB, unas 5 000 fotos ya comprimidas por la app).

## Notas

- Sin señal: puedes ver todo y guardar registros. Las **fotos y firmas** necesitan señal para subirse.
- El aviso arriba a la derecha te dice si todo está **Sincronizado** o cuántos cambios faltan por enviar.
- Supabase pausa los proyectos gratis que pasan 7 días sin uso. Con uso diario no pasa. Si ocurre, entra a supabase.com y presiona **Restore**.
