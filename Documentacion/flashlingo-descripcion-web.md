# FlashLingo: descripcion completa para pagina web

Este documento describe FlashLingo desde cero para servir como base de una
pagina web, landing page, ficha de producto o material de Play Store.

## Resumen Corto

FlashLingo es una app Android de flashcards para estudiar vocabulario con
repeticion espaciada. Importa mazos `.flashjp`, funciona de forma local-first,
guarda el progreso en el dispositivo y ofrece estadisticas detalladas,
exportaciones CSV/PDF, backup manual de progreso por mazo, modo escritura y
configuracion avanzada por mazo.

## Propuesta De Valor

FlashLingo esta pensada para estudiantes que quieren estudiar vocabulario sin
cuentas, sin sincronizacion obligatoria y sin depender de una plataforma externa
para guardar su progreso. El usuario importa un mazo, estudia tarjetas de
reconocimiento y produccion, y la app programa los repasos segun su desempeno.

Mensajes principales para web:

- "Estudia vocabulario con mazos locales y repeticion espaciada."
- "Importa, estudia y analiza tu progreso sin crear una cuenta."
- "Flashcards con audio, imagenes, escritura y estadisticas exportables."
- "Tu progreso se queda en tu dispositivo."

## Publico Objetivo

- Estudiantes de idiomas que usan mazos preparados.
- Creadores de mazos que quieren distribuir paquetes con SQLite, audio e
  imagenes.
- Usuarios que prefieren control local de datos.
- Estudiantes avanzados que quieren ajustar limites, algoritmos y pasos de
  aprendizaje.
- Personas que quieren ver estadisticas reales de estudio, no solo una racha.

## Plataforma Y Alcance

- Plataforma principal: Android.
- Distribucion prevista: Play Store.
- App id: `com.flashlingo.app`.
- Idiomas de interfaz activos en v1: ingles, espanol, rumano, aleman, frances,
  japones y chino.
- Datos: locales en el dispositivo mediante Isar Community.
- No hay cuentas.
- No hay nube ni sincronizacion.
- No hay descargas remotas de mazos desde la app en el scope actual.
- La app contiene metadatos Flutter para web/desktop, pero el producto activo
  documentado es Android.

## Flujo Principal Del Usuario

1. El usuario abre la app.
2. La app muestra una bienvenida y ofrece un tour guiado.
3. El usuario importa un mazo oficial `.flashjp` o restaura un backup
   `.flashjp` de usuario.
4. La app analiza el paquete, muestra progreso de importacion y presenta un
   resumen.
5. El usuario estudia tarjetas del mazo.
6. La app guarda respuestas, tiempos, sesiones y programacion SRS.
7. El usuario revisa estadisticas, detecta tarjetas problematicas y exporta
   reportes o un backup de progreso si lo necesita.

## Home Y Gestion De Mazos

La pantalla principal muestra los mazos importados con contadores utiles:

- nuevas disponibles hoy
- learning/relearning vencidas
- reviews disponibles hoy
- tarjetas atrasadas
- precision de los ultimos 7 dias cuando existe actividad reciente

Acciones por mazo:

- empezar estudio
- abrir configuracion del mazo
- navegar tarjetas
- abrir estadisticas
- exportar progreso del mazo
- traer repasos futuros a hoy
- renombrar
- eliminar

El borrado elimina tarjetas, settings, logs, sesiones, historiales, estadisticas
diarias y despues limpia media sin referencias.

## Importacion De Mazos

FlashLingo acepta archivos:

- `.flashjp`

Hay dos perfiles `.flashjp` aceptados:

- paquete oficial cifrado con AES-256-GCM y firmado con Ed25519
- backup de usuario generado por la app con `flashlingo_user_backup_v1`

El paquete oficial no es un ZIP plano. El formato generado actual es v3 por
chunks; v2 queda como compatibilidad para mazos antiguos. Despues de
verificarlo y descifrarlo a un archivo temporal, contiene un ZIP interno con:

- `manifest.json`
- base SQLite referenciada por `db_filename`
- archivos opcionales de audio, imagenes e icono

La importacion soporta:

- seleccion desde el file picker del sistema sin permisos amplios de
  almacenamiento; el archivo elegido se copia a cache propia antes de leerlo
- paquetes planos
- paquetes envueltos en un unico directorio raiz
- preview antes de importar
- preview e importacion de mazos grandes sin descartar el estado del importador
  durante descifrados prolongados
- barra de progreso por fase
- deteccion de conflictos de nombre
- resumen final de tarjetas, settings, media y diagnosticos
- actualizacion de mazos existentes sin resetear progreso
- preview e importacion diferenciada de backups de usuario

### Conflictos De Nombre

Si el `pack_name` de un paquete oficial ya existe, el usuario puede:

- actualizar el mazo existente
- crear un nuevo mazo con otro nombre

Si el backup de usuario corresponde a un mazo que ya existe, la app pregunta
siempre si restaurar encima o crear una copia.

El nombre `FlashLingo` esta reservado para el mazo de inicio del tour, por lo
que un paquete normal con ese nombre debe guardarse con otro nombre.

### Actualizar Sin Perder Progreso

Al actualizar un mazo desde la UI, la app conserva:

- estado SRS de cada tarjeta
- `nextReview`
- `lastReview`
- repetition count
- lifetime review/correct/wrong counts
- tiempo acumulado de estudio
- review logs
- sesiones actuales
- historial de sesiones
- estadisticas diarias
- settings modificados por el usuario

La app refresca:

- pregunta
- respuesta
- oracion
- traduccion
- audio
- audio de oracion
- imagen
- datos extra
- icono del mazo si el paquete trae uno valido

## Formato De Tarjetas

Cada fila SQLite produce dos tarjetas:

- reconocimiento: `{language_id}_recog`
- produccion: `{language_id}_prod`

Mapeo de reconocimiento:

- pregunta: `PALABRA`
- respuesta: `SIGNIFICADO`
- oracion: `ORACION`
- traduccion: `TRADUCCION`
- lectura/formas desde `LECTURA_PALABRA`, `LECTURA_ORACION`, `FORMAS`

Mapeo de produccion:

- pregunta: `SIGNIFICADO`
- respuesta: `PALABRA`
- oracion: `TRADUCCION`
- traduccion: `ORACION`
- lectura objetivo y lectura de oracion desde los datos extra

Esto permite estudiar tanto reconocer una palabra como producirla desde su
significado.

## Sesion De Estudio

La pantalla de estudio muestra:

- contador de progreso de la sesion
- franja de color segun tipo/estado de tarjeta
- tarjeta HTML con contenido enriquecido
- audio de palabra y oracion cuando existe
- imagen cuando existe
- boton para mostrar respuesta
- boton Bad
- boton Good
- deshacer si esta habilitado

La app renderiza tarjetas con HTML sanitizado dentro de `InAppWebView`. El HTML
permite texto enriquecido, listas, tablas simples, ruby, imagenes, audio y
estilos seguros.

### Tarjetas De Reconocimiento

El usuario ve la palabra y la oracion. Si hay lectura adicional real, primero
puede revelar la lectura antes de mostrar la respuesta. Al mostrar la respuesta,
la app ensena significado, formas, traduccion y multimedia.

### Tarjetas De Produccion

El usuario ve el significado y debe recordar/producir la palabra. La respuesta
muestra la palabra objetivo, lectura, formas, frase y traduccion.

## Modo Escritura

El modo escritura se activa por mazo y solo aplica a tarjetas de produccion.

Funciones:

- campos de texto nativos para escribir respuestas
- comparacion por palabras/caracteres
- resaltado de coincidencias y errores
- puntuacion porcentual
- umbral minimo para habilitar Good
- limite opcional de repeticiones por tarjeta para dejar de mostrar escritura

Configuraciones:

- activar/desactivar write mode
- porcentaje minimo requerido
- maximo de reps antes de apagar write mode para esa tarjeta

## Algoritmo SRS

Estados de tarjeta:

- `newCard`
- `learning`
- `review`
- `relearning`

La app combina:

- fase inicial intra-dia para tarjetas nuevas
- pasos fijos de aprendizaje en dias
- formula tipo Ebbinghaus para reviews
- tolerancia de lapses
- intervalo fijo opcional tras fallo
- day cutoff configurable

Formula base de intervalo en review:

```text
tStar = (-ln(P_min) / nt) - offset
```

Donde:

- `nt` es la tasa actual de olvido (`decayRate`)
- al acertar: `nt = nt * (1 - alpha)`
- al fallar: `nt = nt * (1 + beta)`
- el intervalo final en review se fuerza a minimo 1 dia

Cuando una tarjeta nueva falla, vuelve pronto usando
`newCardIntraDayMinutes`. Cuando una tarjeta de review falla, puede repetir en
el mismo dia si el intervalo fijo de lapse es menor a 1 dia.

## Configuracion Por Mazo

Cada mazo tiene configuracion independiente:

- nuevas por dia
- max reviews por dia
- ocultar nuevas cuando hay overflow de reviews
- recordatorios de estudio por mazo
- hora/minuto de inicio del dia de estudio
- orden de estudio:
  - nuevas primero
  - reviews primero
  - intercalar reviews y nuevas
  - intercalar nuevas y reviews
- tamano de bloques al intercalar
- pasos fijos de aprendizaje
- aciertos minimos iniciales para nuevas
- minutos intra-dia para nuevas
- `pMin`
- `alpha`
- `beta`
- `offset`
- `initialNt`
- tolerancia de lapses
- uso de intervalo fijo en lapse
- intervalo fijo de lapse
- write mode
- undo

## Limites Diarios Y Cola De Estudio

FlashLingo calcula el dia de estudio con un cutoff configurable, por defecto
04:00. Esto evita que sesiones de madrugada se mezclen con el dia calendario
equivocado.

La app:

- resetea el contador de nuevas por dia segun study day
- limita reviews diarias
- difiere overflow de reviews a dias futuros
- mantiene prioridad de tarjetas atrasadas
- permite overrides manuales para traer reviews futuras a hoy
- mezcla reviews con una randomizacion ligera
- evita tarjetas hermanas reconocimiento/produccion adyacentes cuando es posible

## Deshacer

El undo es de un nivel y puede desactivarse por mazo.

Al deshacer, la app revierte:

- estado SRS de la tarjeta
- proxima fecha de review
- tasa de olvido
- learning step y cola fija
- contadores lifetime
- tiempo de estudio acumulado
- review log recien creado
- contador diario de nuevas si se incremento
- repeticion reinsertada en la cola si existia
- estadisticas diarias afectadas

## Recordatorios De Estudio

FlashLingo programa recordatorios de estudio locales por mazo, sin servidor ni
notificaciones push remotas. Se activan y ajustan desde la configuracion de cada
mazo:

- activar o desactivar recordatorios por mazo (`study_reminders_enabled`)
- intervalo minimo entre recordatorios en horas
  (`study_reminder_interval_hours`, rango `1..168`)

Comportamiento:

- Solo se notifica cuando el mazo tiene tarjetas pendientes ese dia de estudio;
  si no quedan pendientes, no se envia recordatorio.
- Ademas del recordatorio periodico, hay avisos de cierre de dia que recuerdan
  terminar las tarjetas pendientes antes de que termine el dia.
- La notificacion muestra el icono del mazo y un mensaje localizado; al tocarla
  abre directamente ese mazo.
- Los textos de notificacion estan localizados en los siete idiomas de la app.
- Hay un boton de vista previa para probar la notificacion del mazo.
- Tras reiniciar el dispositivo, un receptor de arranque reprograma los
  recordatorios pendientes.

Detalles tecnicos:

- En Android 13+ la app solicita el permiso runtime `POST_NOTIFICATIONS`.
- Usa `RECEIVE_BOOT_COMPLETED` para reprogramar tras reinicio.
- La programacion usa `AlarmManager` con alarmas inexactas, por lo que no
  requiere permiso de alarmas exactas.
- El puente nativo vive en `StudyReminderScheduler` (`com.flashlingo.app`) y se
  comunica con Dart por un method channel desde `lib/features/notifications`.

## Persistencia Local

La app usa Isar Community para datos locales.

Modelos principales:

- `Flashcard`
- `DeckSettings`
- `ReviewLog`
- `StudySession`
- `StudySessionHistory`
- `DeckDailyStats`
- `AppMeta`

Tambien ejecuta migraciones/backfills para:

- completar lifetime stats antiguas
- completar campos faltantes en review logs
- reconstruir daily stats cuando hace falta

## Estadisticas

La pantalla de estadisticas muestra:

- total de tarjetas
- nuevas disponibles hoy
- learning/relearning ahora
- reviews ahora
- atrasadas
- precision lifetime
- precision 7 dias
- precision 30 dias
- reviews por dia
- tiempo de estudio por dia
- sesiones por dia
- dias activos
- distribucion del mazo por estado
- actividad historica
- tiempo de estudio
- forecast futuro
- histograma de intervalos
- distribucion horaria
- prediccion vs realidad
- tarjetas problematicas
- sesiones recientes
- tarjetas mas dificiles

Tarjetas problematicas se detectan por:

- atrasadas
- baja precision
- lapses consecutivos o relearning
- tiempo medio alto de respuesta
- score de dificultad calculado

Acciones desde problem cards:

- abrir tarjeta en browser
- ver historial
- marcar para revisar hoy si esta en el futuro

## Exportaciones

### CSV

La exportacion CSV genera varios archivos:

- `summary.csv`
- `daily_stats.csv`
- `problem_cards.csv`
- `sessions.csv`
- `review_history.csv`

Despues abre el share sheet de Android.

### PDF

El PDF incluye:

- resumen del mazo
- estado actual
- problem cards
- hardest cards
- sesiones recientes
- daily stats ultimos 30 study days
- graficos exportados desde la pantalla de stats:
  - heatmap
  - study time
  - distribucion
  - forecast
  - interval histogram
  - hourly distribution
  - prediction repetitions
  - prediction time

El PDF usa fuentes embebidas para soportar texto multilingue.

### Backup `.flashjp`

La exportacion de progreso genera un `.flashjp` de usuario para un mazo
concreto. Incluye contenido restaurable del mazo, media local referenciada,
configuracion, estado SRS, logs, sesion activa, historial de sesiones y
estadisticas diarias. Durante la exportacion se muestra una barra de progreso
con porcentaje (recopilacion, hashing de media, compresion del ZIP) y al
terminar abre el share sheet de Android.

En v1 el backup no tiene contrasena ni cifrado propio. Quien tenga el archivo
puede importarlo o inspeccionarlo.

## Browser De Tarjetas

El browser permite:

- buscar por pregunta, respuesta, oracion o traduccion
- filtrar recognition / production
- filtrar por estado SRS
- ordenar por:
  - original
  - hardest
  - overdue
  - next review
  - last review
- destacar una tarjeta al abrir desde stats
- expandir una tarjeta para ver respuesta, multimedia disponible, proxima review,
  ultima review, lifetime stats y review history

## Onboarding Y Starter Deck

La app incluye un mazo starter en:

```text
lib/assets/starter/FlashLingo.flashjp
```

El tour guiado cubre:

- bienvenida
- ajustes generales
- importacion del starter deck
- resumen de importacion
- menu del mazo
- configuracion del mazo
- study session
- stats
- borrado del mazo guiado
- mensaje final

El paquete starter se copia a documentos locales al arrancar si hace falta.

## Ajustes Generales

La pantalla de settings globales permite:

- cambiar apariencia: system, light, dark
- cambiar idioma: English, Espanol, Romana, Deutsch, Francais, Japones y Chino
- reiniciar tour
- abrir enlace externo de descarga/ayuda configurado en strings
- abrir politica de privacidad: `https://flashlingo.github.io/privacy.html`
- abrir terminos y condiciones: `https://flashlingo.github.io/terms.html`
- abrir aviso legal: `https://flashlingo.github.io/legal.html`
- abrir la pagina oficial para sugerencias, dudas o reportes:
  `https://flashlingo.github.io`
- abrir opciones de privacidad de anuncios cuando UMP indica que son requeridas
- usar Time Machine en debug para pruebas de fechas

## Ads

FlashLingo usa Google Mobile Ads en plataformas moviles soportadas.

Areas:

- banner en sesion de estudio
- banner medium rectangle en pantalla final de sesion
- bloqueo breve de continuar al final de la sesion (`5` segundos)

Debug usa ids de prueba de Google. Release/profile usan ids de produccion o
valores override por build/env.

El arranque de la app actualiza el estado de consentimiento con UMP, muestra el
formulario requerido cuando corresponde e inicializa Google Mobile Ads solo si
`canRequestAds` es verdadero. Los banners verifican ese estado antes de cargar.

El codigo solicita anuncios con `AdRequest()` sin parametros de targeting
propios. La configuracion de AdMob Privacy & messaging / CMP debe estar
preparada y probada fuera del codigo antes de servir anuncios en regiones donde
sea obligatorio.

## Diseno Visual

Identidad:

- minimalista
- amigable
- colores pastel
- turquesa como marca
- soporte claro/oscuro

Colores clave:

- primary: `#40C0CC`
- mint: `#8EDFD4`
- blue: `#8CCBFF`
- peach: `#FFC19E`
- lavender: `#CDB7F0`
- success: `#4FB477`
- danger: `#F66B6B`

Para la pagina web conviene mostrar:

- logo/icono FlashLingo
- pantalla home con contadores de mazos
- tarjeta de estudio con audio/imagen
- modo escritura con comparacion
- panel de estadisticas con graficos
- resumen de exportacion CSV/PDF y backup de progreso

## Privacidad Y Datos

Puntos importantes para comunicar:

- No requiere cuenta.
- El progreso se guarda localmente en el dispositivo.
- Los mazos importados y sus medios se copian a almacenamiento local de la app.
- No hay sincronizacion cloud en el scope actual.
- El respaldo del sistema esta desactivado (`android:allowBackup="false"` y reglas
  de extraccion de datos que excluyen respaldo en la nube y transferencia entre
  dispositivos), por lo que los datos locales sin cifrar no salen del dispositivo
  por mecanismos de backup del sistema; la migracion se hace con el backup
  `.flashjp` por mazo.
- Hay backup manual por mazo mediante archivo `.flashjp` exportado por accion
  del usuario.
- No hay descarga remota de mazos desde la app.
- La app contiene ads en builds moviles soportados.
- La app declara `POST_NOTIFICATIONS` para recordatorios de estudio y
  `RECEIVE_BOOT_COMPLETED` para reprogramarlos despues de reiniciar el
  dispositivo.
- La app no tiene backend propio ni analitica propia, pero Google Mobile Ads y
  los enlaces externos abiertos por accion del usuario pueden implicar trafico
  de red.
- El WebView de tarjetas renderiza HTML local saneado; el contenido importado no
  conserva links externos ni recursos remotos en `href`/`src`.

## Diferenciadores Para Marketing

- Local-first y sin cuenta.
- Importacion de paquetes con SQLite, audio, imagen y configuracion.
- Actualizacion de mazos sin perder progreso.
- Dos tarjetas por entrada: reconocimiento y produccion.
- Modo escritura con comparacion visual.
- SRS configurable, no una caja negra simple.
- Estadisticas avanzadas y exportables.
- Backup/restauracion manual de progreso por mazo.
- Tour guiado con mazo inicial.
- Buen soporte de estudio offline.

## Limitaciones Actuales Que No Deben Prometerse

- No prometer sincronizacion en la nube.
- No prometer cuenta web.
- No prometer marketplace de mazos dentro de la app.
- No prometer edicion manual de tarjetas dentro de la app.
- No prometer soporte activo de escritorio/web como producto final.
- No prometer que la app esta libre de red en builds con anuncios habilitados.
- No presentar el cifrado `.flashjp` como DRM o secreto contra ingenieria
  inversa: la app incluye la clave de descifrado para poder importar mazos
  oficiales offline. La firma Ed25519 es la proteccion de autenticidad.

## Especificaciones Tecnicas

- Framework: Flutter.
- Lenguaje: Dart.
- Estado: Riverpod.
- Base local: Isar Community.
- Importacion SQLite: `sqflite`.
- Payload ZIP interno: `archive`.
- Backups de usuario: JSON versionado, hashes SHA-256 y media dentro de ZIP
  `.flashjp`.
- WebView de tarjetas: `flutter_inappwebview`.
- Export/share: `share_plus`.
- PDF: paquete `pdf`.
- Charts: `fl_chart`, `flutter_heatmap_calendar` y widgets PDF propios.
- Ads: `google_mobile_ads`.
- Persistencia de preferencias: `shared_preferences`.

## Estructura Del Repositorio

- `lib/data`: modelos y persistencia local.
- `lib/features/home`: pantalla principal y acciones de mazo.
- `lib/features/backup`: exportacion/restauracion de backups de progreso.
- `lib/features/importer`: importador `.flashjp`.
- `lib/features/library`: configuracion, browser y overview de mazo.
- `lib/features/study_session`: estudio, SRS, HTML y undo.
- `lib/features/notifications`: recordatorios de estudio locales y puente nativo.
- `lib/features/stats`: estadisticas, graficos, exportaciones.
- `lib/features/settings`: ajustes globales.
- `lib/features/onboarding`: tour y starter deck.
- `lib/features/ads`: banners AdMob.
- `lib/theme`: paleta, tema y layout responsive.
- `lib/l10n`: strings de interfaz activos.
- `test`: pruebas unitarias/widget de los comportamientos principales.

## Ideas De Secciones Para La Web

1. Hero: "FlashLingo" + frase corta sobre estudiar vocabulario local-first.
2. Beneficios: local, offline, importable, SRS, estadisticas.
3. Como funciona: importa, estudia, repasa, analiza.
4. Funciones principales:
   - paquetes `.flashjp`
   - reconocimiento/produccion
   - write mode
   - configuracion por mazo
   - stats/export
   - backup manual de progreso
5. Privacidad: sin cuenta, progreso local.
6. Screenshots o mockups: home, study, write mode, stats, import summary.
7. Para creadores de mazos: SQLite + manifest + media.
8. CTA: descargar Android / Play Store cuando este disponible.

## Copy Corto Sugerido

Titulo:

```text
FlashLingo
```

Subtitulo:

```text
Flashcards de vocabulario con repeticion espaciada, mazos locales y
estadisticas exportables.
```

Descripcion corta:

```text
Importa mazos `.flashjp`, estudia recognition y production cards, activa modo
escritura y revisa tu progreso con graficos, CSV, PDF y backup manual por
mazo. Sin cuenta y con datos guardados localmente en tu dispositivo.
```

Bullets:

- Importa mazos con audio, imagenes y frases.
- Actualiza contenido sin perder progreso.
- Ajusta limites diarios, lapses, learning steps y modo escritura.
- Analiza precision, tiempo, sesiones, forecast y tarjetas dificiles.
- Exporta estadisticas en CSV y PDF.
- Exporta y restaura progreso por mazo con un archivo `.flashjp`.
