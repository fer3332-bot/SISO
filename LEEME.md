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

## Despliegue diario de señalización

En **Registrar → Despliegue de señalización del día** anotas el frente de trabajo, el tramo (por ejemplo 12+300 a 12+900) y cada rótulo con su cantidad y estación. Usa **Duplicar el último** y cambia solo lo que se movió. El inventario de señalización toma el último despliegue para calcular *en uso* y *en plantel*, y cada rótulo muestra su historial de estaciones. Cada despliegue cuenta como inspección de señalización vial en el Control de riesgo.

## Marca de agua en las fotos

Cada foto se guarda con el logo, día y hora, clima, lugar, coordenadas GPS, el registro (con equipo, persona o estación) y el proyecto. La primera vez el teléfono pide permiso de ubicación: acéptalo. Sin señal salen fecha, hora, coordenadas y registro (el clima y el lugar necesitan internet). Se puede apagar en **Proyecto**.

## Descargar y compartir fotos

- **Toca cualquier foto** (dentro de un registro o en la galería) para verla en grande con dos botones: **Compartir** (abre WhatsApp y las demás apps) y **Descargar**. La foto sale con su marca de agua y con un nombre claro, por ejemplo `19-11-2026 Charla de seguridad - Ojos y mente en la tarea (1).jpg`.
- **Registros → Fotos del día** (o el enlace *Fotos de hoy* en Hoy) junta todas las fotos de una fecha. Marca varias con ✓ y usa **Compartir** para mandarlas juntas al grupo del informe diario.

## Firmas

Donde un documento lleva firma aparece el botón **Firmar**. Se abre una hoja en blanco a pantalla completa y en horizontal (si el teléfono no gira solo, la hoja ya viene girada: voltea el teléfono de lado). La persona firma sobre la línea y tocas **Listo**; la firma se guarda al tocar **Guardar** en el formulario.

## Fotos y firmas en el Excel

- La **firma** aparece como imagen dentro de su celda.
- Cada **foto** aparece como un enlace “Ver foto 1”, “Ver foto 2”… que abre o descarga la imagen. Los enlaces funcionan **1 año** desde que descargas el Excel; si necesitas uno más reciente, vuelve a descargarlo. Cualquier persona que tenga el Excel puede abrir esas fotos.
- Para generar el Excel con fotos y firmas necesitas señal.

## Botaderos de material excedente (ME)
Módulo **Botaderos de material excedente**: cada punto lleva número (P1, P2… automático), dueño del terreno, contacto, lugar, estación, distancia desde el frente (se calcula sola con la estación del punto y la del frente), coordenadas UTM (botón **📍 Tomar coordenadas aquí** las calcula con el GPS del teléfono, zona 16 N), nota, imagen de ubicación (captura de Google Earth con el punto marcado), fotos del sitio y firma del dueño como autorización. El estado puede ser Activo, En trámite o Lleno / cerrado.
El botón **Generar PDF** arma el informe "Puntos de Botaderos de ME": encabezado, datos del proyecto, tabla resumen de todos los puntos y una ficha por punto con su ubicación y fotos, más tu firma al final.

## Pruebas de alcoholemia (PRO-SISO-CORDON-001)
- **Lunes:** prueba fija; en el módulo salen todos los activos para tocar y registrar.
- **Jueves, viernes y sábado (o reincorporación):** botón **Sortear 15%** que escoge al azar; graba la pantalla al sortear para el video que pide SISO oficina central.
- El formulario pide hora, lugar, confirmación de no haber comido/chicle/enjuague 20 min antes, lectura (% en aliento), firma o N.Q.F. con dos testigos.
- Si la lectura es mayor a 0.00 marca Positivo, pide la segunda prueba (10–15 min) y calcula la medida disciplinaria según la tabla. También pide la razón del empleado, la versión y firma del testigo, el ingeniero notificado y la hora de envío a RRHH (alerta de 1 hora en Hoy). El PDF del registro sirve como reporte a RRHH con las fotos de las lecturas.
- **Hoja de control del día (Excel):** el formato CONTROL DE PRUEBAS DE ALCOHOLEMIA con todo el personal activo, puesto, hora, lectura, firma y observación (Habilitado / Positivo). Sin pruebas sirve para imprimir en blanco.

## Agenda sugerida de charlas
En **Charlas de seguridad** aparece la tarjeta **Agenda sugerida de charlas** (de martes a jueves, 10 minutos al cierre de la jornada; noviembre y diciembre 2026). Toca **Revisar y cargar**: puedes desmarcar las que no quieras, cambiar el tema (escribiendo o escogiendo de la lista, que incluye temas de la etapa de limpieza del derecho de vía) y fijar la hora. Se guardan como **Programadas** y salen en Hoy el día que toca. Después de darla, abre la charla, ponla como **Impartida** y anota los asistentes.

## Reporte diario SISO (PDF)
En la pantalla **Hoy** está la tarjeta **Reporte diario SISO**: escoge la fecha (por defecto hoy) y toca **Generar PDF**. El documento trae:
- Encabezado con el título REPORTE DIARIO SISO, el logo y el día.
- Datos del proyecto, contratista, responsable del informe y fecha y hora en que se generó.
- Una tabla resumen con cada tipo de actividad, cuántas se hicieron y su detalle con la hora.
- El detalle de cada actividad en orden de hora, con todos sus datos y sus fotos (tres por fila).
- La firma del responsable SISO (se guarda una sola vez en Proyecto → Firma del responsable SISO, o con el botón ✍️ Agregar mi firma de la tarjeta) y el número de página.

La hora de cada actividad es la que anotaste en el formulario (hora, hora de inicio) y, si no tiene, la hora en que se registró. Las fotos se bajan de la nube, así que genera el reporte con conexión.

## Inspección de vehículos y equipo
Es una inspección mensual por equipo, con el formato del proyecto (ya no hay preoperatorio diario ni auditoría):
- **Camiones** (volquetas, cabezales, tanques, low boy): 24 puntos.
- **Pick-ups**: 19 puntos.
- **Equipo amarillo**: los mismos puntos del camión, pero sin placa.

Arriba de la lista se ven los equipos que faltan este mes; tócalos para abrir el formulario con la placa y la persona asignada ya puestos. El Excel sale con una hoja por grupo (Camión, Pick-up, Equipo amarillo) y las columnas Mes, Fecha, Inventario, Placa, Asignado a, cada punto con ✓ o X, y Observaciones.

## Reporte de sucesos en Excel
Cada suceso se descarga con el botón **Reporte en Excel**, usando el formato de la empresa (FORMATO_REPORTE_DE_SUCESOS). El archivo tiene tres hojas:
- **REPORTE DE SUCESOS**: el formato completo de una hoja, con las casillas marcadas (tipo, clima, clasificación de causas, daños personales y materiales). Si una versión es muy larga, las filas se agrandan solas.
- **VERSIONES**: la hoja de versión de cada participante y la versión técnica, con su firma y la del inspector SISO.
- **RESPALDO FOTOGRÁFICO**: las fotos del suceso, tres por fila. Necesita conexión para bajarlas.

- **Procedimiento CHE:** las versiones son del *participante*, del *testigo* y la *opinión técnica*, en primera persona (el formulario recuerda las preguntas ¿Quién? ¿Qué? ¿Cómo? ¿Cuándo? ¿Dónde? ¿Por qué?). Si alguien no puede escribir, anota quién levantó la versión, su firma y una foto de la huella. Al generar el Excel la app avisa qué casillas faltan (incluye mínimo 2 fotos) y en Hoy aparece la alerta de envío a oficinas centrales dentro de 48 h hasta que pongas la fecha de envío.

En la clasificación de causas puedes marcar varias. Al escoger el nombre de cada participante se llenan solos el cargo y el número de identidad (si lo tiene registrado en Personal).

## Respaldo

En **Proyecto → Descargar respaldo** obtienes un `.json` con todo. Con **Importar respaldo** lo restauras.
Las fotos, firmas y PDF quedan en Supabase Storage (plan gratis: 1 GB, unas 5 000 fotos ya comprimidas por la app).

## Notas

- Sin señal: puedes ver todo y guardar registros. Las **fotos y firmas** necesitan señal para subirse.
- El aviso arriba a la derecha te dice si todo está **Sincronizado** o cuántos cambios faltan por enviar.
- Supabase pausa los proyectos gratis que pasan 7 días sin uso. Con uso diario no pasa. Si ocurre, entra a supabase.com y presiona **Restore**.
