# FlashLingo privacidad, permisos y dependencias

Documento tecnico actualizado el 2026-06-27 a partir del estado actual del repositorio.
Sirve como base para documentacion publica, pagina web, ficha de tienda y politica de privacidad.
No reemplaza una revision legal final ni la documentacion vigente de terceros como Google Mobile Ads.

## Alcance del analisis

Se reviso el codigo y la configuracion del proyecto Flutter en:

- `lib/`, `test/`, `android/`, `ios/`, `macos/`, `web/`, `linux/`, `windows/`, `docs/` y metadata de assets.
- `pubspec.yaml`, `pubspec.lock` y el arbol resuelto con `dart pub deps --json`.
- Manifiestos fuente de Android, iOS, macOS y web.
- Manifiesto Android final fusionado de release generado por Gradle.
- Dependencias nativas Android de `releaseRuntimeClasspath`.
- Uso de APIs sensibles: almacenamiento local, seleccion de archivos, WebView, enlaces externos, compartir archivos, anuncios, preferencias y bases de datos.

## Resumen ejecutivo

FlashLingo es una app local-first para estudiar mazos de flashcards importados por el usuario. La app no implementa cuentas, login, backend propio, sincronizacion en la nube, analitica propia ni crash reporting propio.

La mayor parte de los datos de usuario se guarda localmente dentro del sandbox de la app: contenido de mazos, progreso de estudio, configuracion de mazos, sesiones, estadisticas y preferencias de idioma/tema/onboarding.

La app si integra Google Mobile Ads. Por eso el build Android release declara permisos de red, Advertising ID y permisos de Android AdServices/Privacy Sandbox. El codigo de la app actualiza consentimiento con UMP antes de inicializar anuncios y crea solicitudes con `AdRequest()` sin parametros personalizados cuando `canRequestAds` lo permite, pero el SDK de Google puede procesar identificadores publicitarios, datos de dispositivo/red y eventos de anuncios segun su propia politica.

La app permite exportar estadisticas a CSV/PDF y exportar backups de progreso por mazo en `.flashjp`, compartiendolos con el selector del sistema. Esas exportaciones ocurren por accion explicita del usuario. Los CSV/PDF pueden contener textos de tarjetas, identificadores de tarjetas, historial de estudio, tiempos y metricas de rendimiento. Los backups de progreso contienen el mazo completo restaurable, media local referenciada, configuracion, estado SRS, logs, sesiones, historial y estadisticas.

## SDK, runtime y build

| Area | Valor verificado |
| --- | --- |
| Framework | Flutter 3.38.9 stable |
| Dart | 3.10.8 |
| Restriccion Dart del proyecto | `^3.9.2` |
| DevTools | 2.51.1 |
| Android Gradle Plugin | 8.9.1 |
| Kotlin Android plugin | 2.1.0 |
| Gradle wrapper | 8.12 |
| Java usado para Android build | Android Studio JBR / OpenJDK 21.0.8 |
| Android SDK instalado | 36.1.0 |
| Android package / applicationId | `com.flashlingo.app` |
| Android namespace | `com.flashlingo.app` |
| Android minSdk release | 24 |
| Android targetSdk release | 36 |
| Version app actual | `1.0.0+1` |
| Target principal documentado | Android |
| Idiomas de interfaz soportados | `en`, `es`, `ro`, `de`, `fr`, `ja`, `zh` |

IDs de anuncios configurados:

| Contexto | ID |
| --- | --- |
| Android AdMob app id release fallback | `ca-app-pub-9344640998798252~6893857194` |
| Android banner estudio release | `ca-app-pub-9344640998798252/2573514404` |
| Android banner pantalla final release | `ca-app-pub-9344640998798252/7412731941` |
| Android debug | IDs sample de Google |
| Android profile/release | IDs de produccion anteriores, salvo overrides por build/env |
| iOS Info.plist | ID sample de Google: `ca-app-pub-3940256099942544~1458002511` |

## Permisos Android release

Estos permisos salen del manifiesto Android release fusionado, no solo del manifiesto fuente.

| Permiso | Origen observado | Uso/impacto de privacidad |
| --- | --- | --- |
| `android.permission.INTERNET` | `google_mobile_ads` | Permite trafico de red. Se usa para anuncios y tambien permite que WebView/otros SDKs carguen recursos de red si se les entrega contenido con URLs remotas. La app no tiene backend propio. |
| `android.permission.ACCESS_NETWORK_STATE` | `play-services-ads-api` | Permite al SDK consultar estado de conectividad para carga/medicion de anuncios. |
| `com.google.android.gms.permission.AD_ID` | `play-services-ads-api` | Permite acceso al Advertising ID de Google Play Services para publicidad/medicion cuando este disponible y permitido por el usuario/sistema. |
| `android.permission.ACCESS_ADSERVICES_AD_ID` | `play-services-ads-api` | Permiso Android AdServices para identificacion publicitaria en versiones modernas de Android. |
| `android.permission.ACCESS_ADSERVICES_ATTRIBUTION` | `play-services-ads-api` | Permiso Android AdServices para atribucion publicitaria. |
| `android.permission.ACCESS_ADSERVICES_TOPICS` | `play-services-ads-api` | Permiso Android AdServices para Topics API/publicidad basada en intereses, segun soporte del dispositivo y politica de Google. |
| `android.permission.POST_NOTIFICATIONS` | Manifiesto fuente de la app | Permiso runtime en Android 13+ para mostrar recordatorios de estudio. El codigo actual llama `requestNotificationsPermission` durante la inicializacion de `StudyReminderService` y tambien al mostrar preview de recordatorio. |
| `android.permission.RECEIVE_BOOT_COMPLETED` | Manifiesto fuente de la app | Permite reprogramar recordatorios de estudio despues de reiniciar el dispositivo. |
| `android.permission.WAKE_LOCK` | `play-services-measurement-sdk-api` | Permite mantener el CPU activo para tareas del SDK. No hay uso directo en el codigo de la app. |
| `android.permission.FOREGROUND_SERVICE` | `androidx.work:work-runtime` transitivo del stack de anuncios | Permite servicios en foreground para componentes de WorkManager/SDKs. No hay servicio foreground propio en `lib/` ni en el manifiesto fuente de la app. |
| `com.flashlingo.app.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION` | `androidx.core` | Permiso de firma declarado para receptores dinamicos no exportados. No es un permiso de usuario ni da acceso a datos personales. |

No se encontraron permisos Android peligrosos que pidan prompt de runtime al usuario para camara, microfono, ubicacion, contactos, calendario, SMS, telefono, bluetooth, sensores o lectura/escritura amplia de almacenamiento. `POST_NOTIFICATIONS` si esta presente y puede disparar prompt runtime en Android 13+.

### Permisos no presentes en release

No aparecen en el manifiesto Android release:

- Camara: `CAMERA`.
- Microfono/audio: `RECORD_AUDIO`.
- Ubicacion: `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION`, `ACCESS_BACKGROUND_LOCATION`.
- Contactos: `READ_CONTACTS`, `WRITE_CONTACTS`.
- Calendario: `READ_CALENDAR`, `WRITE_CALENDAR`.
- SMS: `READ_SMS`, `SEND_SMS`, `RECEIVE_SMS`.
- Telefono: `READ_PHONE_STATE`, `CALL_PHONE`.
- Fotos/media/almacenamiento amplio: `READ_EXTERNAL_STORAGE`, `WRITE_EXTERNAL_STORAGE`, `READ_MEDIA_IMAGES`, `READ_MEDIA_VIDEO`, `READ_MEDIA_AUDIO`.
- Nearby/Bluetooth: `BLUETOOTH_SCAN`, `BLUETOOTH_CONNECT`, `ACCESS_WIFI_STATE`.

### Visibilidad de intents Android (`queries`)

El manifiesto release incluye queries de paquetes/intents. Estas entradas no otorgan permiso para leer datos, pero permiten saber si existen apps capaces de resolver esos intents.

| Query | Origen/uso esperado |
| --- | --- |
| `android.intent.action.PROCESS_TEXT` con `text/plain` | Entrada generada por Flutter/app para acciones de procesamiento de texto. |
| `android.intent.action.GET_CONTENT` con `*/*` | `file_picker`, para abrir el selector de archivos del sistema. |
| `android.support.customtabs.action.CustomTabsService` | `flutter_inappwebview_android`/browser custom tabs. |
| `android.intent.action.VIEW` con esquema `https` | Stack de anuncios/MRAID y apertura de enlaces. |
| `android.intent.action.INSERT` con MIME `vnd.android.cursor.dir/event` | Stack de anuncios/MRAID para comprobar soporte de calendario. No hay permiso de calendario. |
| `android.intent.action.VIEW` con esquema `sms` | Stack de anuncios/MRAID para comprobar soporte de SMS. No hay permiso para leer/enviar SMS. |
| `android.intent.action.DIAL` con esquema `tel` | Stack de anuncios/MRAID para comprobar soporte de marcador telefonico. No hay permiso `CALL_PHONE`. |

### Componentes Android relevantes de terceros

| Componente | Paquete/origen | Impacto |
| --- | --- | --- |
| `io.flutter.plugins.share.ShareFileProvider` | `share_plus` | Provider no exportado con `grantUriPermissions` para compartir archivos exportados por accion del usuario. |
| `SharePlusPendingIntent` | `share_plus` | Receiver no exportado usado por el share sheet. |
| `com.google.android.gms.ads.MobileAdsInitProvider` | Google Mobile Ads | Inicializacion del SDK de anuncios. |
| `com.google.android.gms.ads.AdActivity`, `AdService`, handlers de notificacion/out-of-context | Google Mobile Ads | Renderizado/carga de anuncios. |
| WorkManager services/receivers | AndroidX/Google stack | Infraestructura transitiva del SDK. |
| InAppWebView activities/receivers | `flutter_inappwebview` | Renderizado WebView local de tarjetas. |
| `io.flutter.plugins.urllauncher.WebViewActivity` | `url_launcher_android` | Soporte de apertura web si se usa WebView interno. |
| `StudyReminderReceiver` | App propia | Receiver no exportado que muestra/abre recordatorios de estudio programados. |
| `StudyReminderBootReceiver` | App propia | Receiver no exportado que escucha boot/quick boot y reprograma recordatorios. |

### Diferencias debug/profile

Los manifiestos `debug` y `profile` declaran `android.permission.INTERNET` para tooling de Flutter/hot reload. En release, `INTERNET` igualmente aparece por Google Mobile Ads.

## Plataformas no Android

| Plataforma | Hallazgos de privacidad/permisos |
| --- | --- |
| iOS | `Info.plist` contiene display name `FlashLingo` y `GADApplicationIdentifier` sample de Google. No se encontraron usage descriptions para camara, microfono, fotos, ubicacion o contactos. |
| macOS | `Release.entitlements` declara app sandbox. `DebugProfile.entitlements` agrega JIT y `network.server` para desarrollo. |
| Web | `web/manifest.json` define PWA standalone, iconos, colores y orientacion. No declara permisos especiales de navegador. |
| Windows/Linux | Estructura generada de Flutter. No se encontraron permisos de privacidad especificos equivalentes a mobile. |

## Dependencias directas Dart/Flutter

Versiones resueltas desde `pubspec.lock`.

| Dependencia runtime directa | Version | Uso en la app |
| --- | --- | --- |
| `flutter` | SDK | Framework UI. |
| `flutter_localizations` | SDK | Localizacion. |
| `flutter_riverpod` | 3.1.0 | Estado y providers. |
| `riverpod_annotation` | 4.0.0 | Anotaciones/generacion Riverpod. |
| `isar_community` | 3.3.2 | Base de datos local Isar Community. |
| `isar_community_flutter_libs` | 3.3.2 | Librerias nativas de Isar Community, compatibles con Android 16 KB page size en el bundle auditado. |
| `sqflite` | 2.4.2 | Lectura del SQLite incluido dentro del payload de paquetes `.flashjp`. |
| `path_provider` | 2.1.5 | Directorios internos de documentos/soporte. |
| `path` | 1.9.1 | Manipulacion de rutas. |
| `file_picker` | 10.3.10 | Selector del sistema para importar archivos. |
| `archive` | 4.0.7 | Utilidades ZIP usadas por herramientas/tests de empaquetado. |
| `cryptography` | 2.9.0 | Verificacion Ed25519 y descifrado AES-256-GCM de paquetes `.flashjp`. |
| `cryptography_flutter` | 2.3.4 | AES-GCM nativo en Android/iOS/macOS para descifrar paquetes `.flashjp` v3 por chunks. |
| `crypto` | 3.0.7 | SHA-256 para validar hashes del contenedor `.flashjp`. |
| `shared_preferences` | 2.5.4 | Preferencias simples: idioma, tema, onboarding. |
| `flutter_inappwebview` | 6.1.5 | Renderizado local de tarjetas HTML. |
| `url_launcher` | 6.3.2 | Apertura de enlaces externos. |
| `share_plus` | 10.1.4 | Compartir CSV/PDF y backups `.flashjp` exportados por accion del usuario. |
| `cross_file` | 0.3.5+2 | Abstraccion de archivos para compartir. |
| `google_mobile_ads` | 8.0.0 | Banners AdMob. |
| `json_annotation` | 4.9.0 | Serializacion/anotaciones. |
| `uuid` | 4.5.2 | IDs/nombres unicos para media importada. |
| `cupertino_icons` | 1.0.8 | Iconos. |
| `pdf` | 3.12.0 | Generacion de reportes PDF. |
| `fl_chart` | 1.1.1 | Graficas de estadisticas. |
| `flutter_heatmap_calendar` | 1.0.5 | Heatmap/calendario de estudio. |
| `intl` | 0.20.2 | Formato/localizacion. |

## Dependencias directas de desarrollo

| Dependencia dev directa | Version | Uso |
| --- | --- | --- |
| `flutter_test` | SDK | Tests Flutter. |
| `analyzer` | 8.4.1 | Analisis estatico. |
| `flutter_launcher_icons` | 0.14.4 | Generacion de iconos. |
| `path_provider_platform_interface` | 2.1.2 | Tests/mocks de path provider. |
| `plugin_platform_interface` | 2.1.8 | Interfaces de plugins. |
| `sqflite_common_ffi` | 2.4.0+2 | SQLite FFI en tests/herramientas. |
| `build_runner` | 2.15.0 | Generacion de codigo. Con Dart 3.10 se ejecuta con `--force-jit` por build hooks transitivos. |
| `isar_community_generator` | 3.3.2 | Generacion Isar Community. |
| `riverpod_generator` | 4.0.0+1 | Generacion Riverpod. |
| `json_serializable` | 6.11.2 | Generacion JSON. |
| `flutter_lints` | 6.0.0 | Lints. |

## Paquetes Dart transitive resueltos

La lista completa de dependencias transitivas no se mantiene a mano en este
archivo para evitar desalineaciones. La fuente verificada es `pubspec.lock` y se
puede regenerar desde la raiz del repo con:

```bash
dart pub deps --style=list
```

En el estado auditado del 2026-06-26, los cambios transitivos relevantes de la
migracion a Isar Community son:

- `build` 4.0.6
- `build_config` 1.3.0
- `build_runner` 2.15.0
- `dart_style` 3.1.3
- `source_gen` 4.2.3
- `source_helper` 1.3.8
- `riverpod` 3.1.0
- `riverpod_analyzer_utils` 1.0.0-dev.8
- `state_notifier` 1.0.0, usado por los providers legacy de tema/idioma/tour
- `isar`, `isar_flutter_libs` e `isar_generator` ya no estan resueltos
- `isar_community`, `isar_community_flutter_libs` e
  `isar_community_generator` estan resueltos en 3.3.2

## Dependencias nativas Android release

Lista unica de coordenadas Maven observadas en `releaseRuntimeClasspath`.

```text
androidx.activity:activity:1.9.0
androidx.activity:activity-ktx:1.9.0
androidx.annotation:annotation:1.9.1
androidx.annotation:annotation-experimental:1.4.1
androidx.annotation:annotation-jvm:1.9.1
androidx.appcompat:appcompat:1.6.1
androidx.appcompat:appcompat-resources:1.6.1
androidx.arch.core:core-common:2.2.0
androidx.arch.core:core-runtime:2.2.0
androidx.asynclayoutinflater:asynclayoutinflater:1.0.0
androidx.browser:browser:1.9.0
androidx.collection:collection:1.4.2
androidx.collection:collection-jvm:1.4.2
androidx.collection:collection-ktx:1.4.2
androidx.concurrent:concurrent-futures:1.1.0
androidx.constraintlayout:constraintlayout:2.2.1
androidx.constraintlayout:constraintlayout-core:1.1.1
androidx.coordinatorlayout:coordinatorlayout:1.0.0
androidx.core:core:1.17.0
androidx.core:core-ktx:1.17.0
androidx.core:core-viewtree:1.0.0
androidx.cursoradapter:cursoradapter:1.0.0
androidx.customview:customview:1.1.0
androidx.datastore:datastore:1.1.7
androidx.datastore:datastore-android:1.1.7
androidx.datastore:datastore-core:1.1.7
androidx.datastore:datastore-core-android:1.1.7
androidx.datastore:datastore-core-okio:1.1.7
androidx.datastore:datastore-core-okio-jvm:1.1.7
androidx.datastore:datastore-preferences:1.1.7
androidx.datastore:datastore-preferences-android:1.1.7
androidx.datastore:datastore-preferences-core:1.1.7
androidx.datastore:datastore-preferences-core-android:1.1.7
androidx.datastore:datastore-preferences-external-protobuf:1.1.7
androidx.datastore:datastore-preferences-proto:1.1.7
androidx.documentfile:documentfile:1.0.0
androidx.drawerlayout:drawerlayout:1.0.0
androidx.emoji2:emoji2:1.2.0
androidx.emoji2:emoji2-views-helper:1.2.0
androidx.fragment:fragment:1.7.1
androidx.fragment:fragment-ktx:1.7.1
androidx.interpolator:interpolator:1.0.0
androidx.legacy:legacy-support-core-ui:1.0.0
androidx.legacy:legacy-support-core-utils:1.0.0
androidx.lifecycle:lifecycle-common:2.10.0
androidx.lifecycle:lifecycle-common-java8:2.10.0
androidx.lifecycle:lifecycle-common-jvm:2.10.0
androidx.lifecycle:lifecycle-livedata:2.10.0
androidx.lifecycle:lifecycle-livedata-core:2.10.0
androidx.lifecycle:lifecycle-livedata-core-ktx:2.10.0
androidx.lifecycle:lifecycle-process:2.10.0
androidx.lifecycle:lifecycle-runtime:2.10.0
androidx.lifecycle:lifecycle-runtime-android:2.10.0
androidx.lifecycle:lifecycle-runtime-ktx:2.10.0
androidx.lifecycle:lifecycle-runtime-ktx-android:2.10.0
androidx.lifecycle:lifecycle-service:2.10.0
androidx.lifecycle:lifecycle-viewmodel:2.10.0
androidx.lifecycle:lifecycle-viewmodel-android:2.10.0
androidx.lifecycle:lifecycle-viewmodel-ktx:2.10.0
androidx.lifecycle:lifecycle-viewmodel-savedstate:2.10.0
androidx.lifecycle:lifecycle-viewmodel-savedstate-android:2.10.0
androidx.loader:loader:1.0.0
androidx.localbroadcastmanager:localbroadcastmanager:1.0.0
androidx.preference:preference:1.2.1
androidx.print:print:1.0.0
androidx.privacysandbox.ads:ads-adservices:1.0.0-beta05
androidx.privacysandbox.ads:ads-adservices-java:1.0.0-beta05
androidx.profileinstaller:profileinstaller:1.4.0
androidx.recyclerview:recyclerview:1.0.0
androidx.resourceinspection:resourceinspection-annotation:1.0.1
androidx.room:room-common:2.2.5
androidx.room:room-runtime:2.2.5
androidx.savedstate:savedstate:1.4.0
androidx.savedstate:savedstate-android:1.4.0
androidx.savedstate:savedstate-ktx:1.4.0
androidx.slidingpanelayout:slidingpanelayout:1.2.0
androidx.sqlite:sqlite:2.1.0
androidx.sqlite:sqlite-framework:2.1.0
androidx.startup:startup-runtime:1.1.1
androidx.swiperefreshlayout:swiperefreshlayout:1.1.0
androidx.tracing:tracing:1.2.0
androidx.transition:transition:1.4.1
androidx.vectordrawable:vectordrawable:1.1.0
androidx.vectordrawable:vectordrawable-animated:1.1.0
androidx.versionedparcelable:versionedparcelable:1.1.1
androidx.viewpager:viewpager:1.0.0
androidx.webkit:webkit:1.15.0
androidx.window.extensions.core:core:1.0.0
androidx.window:window:1.2.0
androidx.window:window-java:1.2.0
androidx.work:work-runtime:2.7.0
com.getkeepsafe.relinker:relinker:1.4.5
com.google.android.gms:play-services-ads:25.1.0
com.google.android.gms:play-services-ads-api:25.1.0
com.google.android.gms:play-services-ads-identifier:18.0.0
com.google.android.gms:play-services-appset:16.0.1
com.google.android.gms:play-services-base:18.0.0
com.google.android.gms:play-services-basement:18.9.0
com.google.android.gms:play-services-measurement-base:20.1.2
com.google.android.gms:play-services-measurement-sdk-api:20.1.2
com.google.android.gms:play-services-tasks:18.2.0
com.google.android.ump:user-messaging-platform:4.0.0
com.google.code.findbugs:jsr305:3.0.2
com.google.errorprone:error_prone_annotations:2.48.0
com.google.guava:failureaccess:1.0.1
com.google.guava:guava:31.1-android
com.google.guava:listenablefuture:9999.0-empty-to-avoid-conflict-with-guava
com.google.j2objc:j2objc-annotations:1.3
com.squareup.okio:okio:3.4.0
com.squareup.okio:okio-jvm:3.4.0
commons-io:commons-io:2.20.0
io.flutter:arm64_v8a_release:1.0.0-587c18f873b8ab57330422bce09047420d9c7f42
io.flutter:armeabi_v7a_release:1.0.0-587c18f873b8ab57330422bce09047420d9c7f42
io.flutter:flutter_embedding_release:1.0.0-587c18f873b8ab57330422bce09047420d9c7f42
io.flutter:x86_64_release:1.0.0-587c18f873b8ab57330422bce09047420d9c7f42
org.apache.tika:tika-core:3.2.3
org.checkerframework:checker-qual:3.12.0
org.jetbrains.kotlin:kotlin-android-extensions-runtime:1.9.22
org.jetbrains.kotlin:kotlin-parcelize-runtime:1.9.22
org.jetbrains.kotlin:kotlin-stdlib:2.1.0
org.jetbrains.kotlin:kotlin-stdlib-jdk7:1.8.0
org.jetbrains.kotlin:kotlin-stdlib-jdk8:1.8.0
org.jetbrains.kotlinx:kotlinx-coroutines-android:1.9.0
org.jetbrains.kotlinx:kotlinx-coroutines-bom:1.9.0
org.jetbrains.kotlinx:kotlinx-coroutines-core:1.9.0
org.jetbrains.kotlinx:kotlinx-coroutines-core-jvm:1.9.0
org.jetbrains.kotlinx:kotlinx-serialization-bom:1.7.3
org.jetbrains.kotlinx:kotlinx-serialization-core:1.7.3
org.jetbrains.kotlinx:kotlinx-serialization-core-jvm:1.7.3
org.jetbrains:annotations:23.0.0
org.jspecify:jspecify:1.0.0
org.slf4j:slf4j-api:2.0.17
```

## Datos que la app almacena o procesa localmente

### Base local Isar Community

La base Isar Community se abre en el directorio de documentos de la app (`getApplicationDocumentsDirectory`). El inspector de Isar solo se habilita en debug.

| Coleccion/modelo | Datos guardados |
| --- | --- |
| `Flashcard` | ID interno, ID original importado, idioma/ISO, nombre del mazo, tipo de tarjeta, pregunta, respuesta, rutas de audio/imagen, oracion, traduccion, JSON extra, estado SRS, fechas de revision, prioridad, lapses, repeticiones, conteos de correctas/incorrectas y tiempo total de estudio. |
| `DeckSettings` | Nombre del mazo, icono, recordatorios de estudio, limites diarios, hora de corte, parametros SRS, pasos de aprendizaje, modo de mezcla, ajustes de write mode y undo. |
| `ReviewLog` | Nombre de mazo, timestamp, dia de estudio, ID de tarjeta, ID de sesion, tipo de tarjeta, resultado correcto/incorrecto, estado anterior/nuevo, fechas anterior/nueva, dias de atraso, rating, intervalo programado y duracion de respuesta. |
| `StudySession` | Sesion activa/resumible: mazo, ID de sesion, cola de IDs de tarjetas, indice actual, dia, inicio y ultima actualizacion. |
| `StudySessionHistory` | Historial de sesiones: ID, mazo, dia, inicio/fin, cantidad de respuestas, correctas, incorrectas, tarjetas unicas, tiempo total y tiempo promedio. |
| `DeckDailyStats` | Estadisticas diarias por mazo: revisiones, correctas, incorrectas, tarjetas unicas, tarjetas nuevas/en aprendizaje/en review, sesiones, tiempos totales/por estado, promedio de respuesta y 96 buckets de cuarto de hora. |
| `AppMeta` | Metadatos internos de migracion: clave, valores int/string y fecha de actualizacion. |

### Preferencias simples

Se guardan en `shared_preferences`.

| Clave | Dato |
| --- | --- |
| `app_theme_mode` | Tema elegido: `system`, `dark` o `light`. |
| `app_language_code` | Idioma de la app normalizado: `en`, `es`, `ro`, `de`, `fr`, `ja` o `zh`. |
| `onboarding_welcome_seen_v1` | Booleano de bienvenida vista. |
| `onboarding_tour_completed_v1` | Booleano de tour completado. |

La app lee el locale del sistema en el primer arranque para elegir idioma por defecto, pero no guarda el locale completo; solo guarda el codigo soportado si el usuario o el controlador lo persiste.

### Archivos locales

| Ubicacion/flujo | Datos |
| --- | --- |
| `media_assets` dentro de documentos de la app | Copias locales de imagenes/audios importados desde mazos. Los nombres se generan con UUID. |
| `flashlingo_imports/<sesion>` dentro de la cache temporal | Copia staged del `.flashjp` elegido con el selector del sistema. Conserva el nombre visible del archivo, se usa para preview/import y se elimina al terminar, cancelar o fallar el flujo. |
| `import_tmp` dentro de documentos de la app | ZIP descifrado y base SQLite temporal durante la importacion. Se limpia despues del import. |
| `starter_decks/FlashLingo.flashjp` | Copia local del mazo inicial incluido como asset. |
| `flashlingo_exports` dentro de application support | CSV/PDF generados por exportacion de estadisticas y backups de progreso por mazo generados por exportacion explicita del usuario. |

No se encontro cifrado propio de base de datos o archivos. La proteccion principal es el sandbox del sistema operativo. `android:allowBackup="false"` esta declarado en el manifiesto fuente y `android/app/src/main/res/xml/data_extraction_rules.xml` excluye respaldo en la nube y transferencia entre dispositivos, de modo que los datos locales sin cifrar no salen del dispositivo por mecanismos de backup del sistema. La migracion de datos entre dispositivos se hace con el backup `.flashjp` por mazo.

## Datos importados desde mazos

La app permite importar archivos `.flashjp` con el selector del sistema. Hay dos
perfiles aceptados: paquetes oficiales cifrados/firmados y backups de usuario
generados por la app con `flashlingo_user_backup_v1`. Los ZIP planos de mazos no
son aceptados como formato de importacion; un ZIP renombrado a `.flashjp` solo
se acepta si contiene un `backup_manifest.json` valido de backup de usuario. No
requiere permisos amplios de almacenamiento porque usa el file picker y copia el
archivo seleccionado a cache propia antes de que el importador lo lea. Este
staging evita depender de rutas directas de almacenamiento compartido, como
Downloads en Android 11+ con scoped storage.

Del `manifest.json` importado se leen:

- `language_id`
- `pack_name`
- `db_filename`
- `settings` con la configuracion aceptada del mazo
- alias de icono del mazo, por ejemplo `deck_icon`, `deckIcon`, `icon` o `iconPath`

De la tabla SQLite `flashcards` del paquete se procesan estos campos:

- `ID`
- `PALABRA`
- `SIGNIFICADO`
- `AUDIO_PALABRA`
- `AUDIO_ORACION`
- `IMAGEN`
- `ORACION`
- `TRADUCCION`
- `LECTURA_PALABRA`
- `LECTURA_ORACION`
- `FORMAS`

La app genera tarjetas de reconocimiento y produccion a partir de cada fila. Los archivos media referenciados por las tarjetas o el icono del mazo se copian a `media_assets` y se referencian mediante rutas locales `file://`.

Controles de seguridad del importador:

- Limite de 12000 archivos reales por paquete.
- Limite de 128 MiB por archivo extraido.
- Limite de 1024 MiB total extraido.
- Limite de 64 MiB por archivo media.
- Limite de 768 MiB total de media.
- Rechazo de rutas absolutas, `..`, `.` y segmentos con `:`.
- Lectura SQLite en modo read-only.
- Limpieza de media huerfana en borrado/actualizacion de mazos.

El resultado de importacion puede mostrar el nombre del archivo seleccionado y conteos de importacion durante la sesion de UI, pero los modelos persistidos son el contenido del mazo, settings, progreso y media local. La copia staged del paquete no se conserva como dato persistido.

Los backups de usuario restauran contenido y progreso desde `cards.json`,
`settings.json`, `progress.json` y `media/...`. Ante conflicto con un mazo
existente, la UI pregunta siempre si restaurar encima o crear una copia. En v1,
estos backups no tienen contrasena ni cifrado propio; quien tenga el archivo
puede inspeccionarlo o importarlo.

## Estudio, WebView y entrada del usuario

La pantalla de estudio renderiza tarjetas con `flutter_inappwebview` usando `initialData` generado localmente por `HtmlGenerator`. No se encontro carga directa de URLs remotas para las tarjetas desde el codigo de la app.

El HTML importado se sanea antes de renderizar:

- Elimina comentarios.
- Elimina tags `script`, `style`, `iframe`, `object`, `embed`, `link`, `meta` y `base`.
- Reconstruye los tags permitidos desde un parser de atributos propio en vez de
  confiar en sustituciones de texto.
- Elimina atributos inline `on...`, atributos no permitidos y atributos
  malformados, tanto si vienen con comillas como sin comillas.
- Permite `href` en `a` solo para anchors locales `#...`.
- Permite `src` en `img`, `audio` y `source` solo para URIs `file:`.
- Bloquea esquemas remotos o peligrosos en contenido importado, incluyendo
  `http:`, `https:`, `data:`, `javascript:` y variantes codificadas con
  entidades HTML.
- Sanea estilos inline eliminando declaraciones con funciones, escapes CSS,
  `expression`, `url`, `-moz-binding`, `@import` o esquemas
  `http:`, `https:`, `data:` y `javascript:`.

Puntos importantes de privacidad/seguridad:

- El WebView tiene JavaScript habilitado para la interaccion de tarjetas y write
  mode.
- La navegacion iniciada dentro del WebView de tarjetas se cancela con
  `shouldOverrideUrlLoading`, no se permiten ventanas emergentes y se desactiva
  la apertura automatica de ventanas por JavaScript.
- En Android, el WebView de tarjetas bloquea cargas de red e imagenes de red.
- Los links externos oficiales de FlashLingo se abren desde UI nativa mediante
  `url_launcher`, fuera del HTML importado por mazos.

En write mode, los campos nativos de texto desactivan autocorreccion, sugerencias, aprendizaje personalizado del teclado, smart dashes/quotes, spellcheck y autofill. Las respuestas escritas se comparan en memoria; no se guardan como texto en la base. Lo que si queda persistido es el resultado del estudio: correcto/incorrecto, rating, tiempos, estados e historiales.

## Exportacion y comparticion

La app genera reportes CSV/PDF y backups `.flashjp` por accion del usuario y los comparte con `share_plus` mediante el share sheet del sistema. El usuario elige la app destino; FlashLingo no controla que hace esa app con el archivo.

Directorio de exportacion local:

```text
getApplicationSupportDirectory()/flashlingo_exports/<pack_sanitizado>_<timestamp>
```

Directorio de backups de progreso:

```text
getApplicationSupportDirectory()/flashlingo_exports/deck_backups/<pack_sanitizado>_progress_<timestamp>.flashjp
```

Campos CSV exportados:

```text
summary.csv:
pack_name, exported_at, total_cards, new_available_today, learning_due_now,
review_due_now, overdue_cards, lifetime_reviews, lifetime_accuracy_percent,
accuracy_7d_percent, accuracy_30d_percent, reviews_per_day_7d,
reviews_per_day_30d, study_time_per_day_7d_minutes,
study_time_per_day_30d_minutes, avg_answer_time_ms, total_study_time_ms,
session_count_7d, session_count_30d

daily_stats.csv:
pack_name, study_day, review_count, correct_count, wrong_count,
accuracy_percent, unique_card_count, session_count, total_study_time_ms,
avg_answer_time_ms

problem_cards.csv:
pack_name, flashcard_id, card_type, state, question, overdue_days,
consecutive_lapses, lifetime_reviews, lifetime_correct, lifetime_wrong,
accuracy_percent, avg_answer_time_ms, difficulty_score, problem_tags,
last_review, next_review

sessions.csv:
pack_name, session_id, session_day, started_at, ended_at, answer_count,
correct_count, wrong_count, unique_card_count, total_study_time_ms,
avg_answer_time_ms

review_history.csv:
pack_name, timestamp, study_day, session_id, flashcard_id, card_original_id,
card_type, is_correct, previous_state, new_state, previous_next_review,
new_next_review, days_late, rating, scheduled_days, study_duration_ms
```

El PDF incluye nombre del mazo, fecha de exportacion, metricas generales, estado del mazo, tarjetas problematicas/dificiles, sesiones recientes y graficas. Puede incluir texto de preguntas de tarjetas y datos de rendimiento.

El backup `.flashjp` de progreso incluye:

- contenido completo de tarjetas y claves portables `originalId::cardType`
- media local referenciada por tarjetas e icono del mazo
- todos los `DeckSettings`, incluidos contadores diarios y recordatorios
- estado SRS por tarjeta, fechas, colas de aprendizaje y estadisticas lifetime
- `ReviewLog`, sesion activa, `StudySessionHistory` y `DeckDailyStats`

El backup incluye hashes SHA-256 y tamanos declarados para detectar corrupcion o
manipulacion, pero no esta cifrado ni protegido por contrasena en v1.

## Red, terceros y envio de datos fuera del dispositivo

### Google Mobile Ads

La app usa Google Mobile Ads en Android/iOS y solo solicita anuncios cuando el
flujo de consentimiento lo permite. Durante el arranque,
`initializeAppAds()` llama a `AdConsentService.updateConsentAndShowFormIfRequired()`,
que:

- solicita actualizacion de informacion de consentimiento UMP en cada arranque
  con `ConsentInformation.instance.requestConsentInfoUpdate()`;
- muestra el formulario necesario con
  `ConsentForm.loadAndShowConsentFormIfRequired()`;
- consulta `ConsentInformation.instance.canRequestAds()` antes de inicializar
  `MobileAds.instance.initialize()`;
- expone en ajustes las opciones de privacidad de anuncios cuando
  `getPrivacyOptionsRequirementStatus()` devuelve `required`.

Los slots de banner verifican `AppAds.canRequestAds` antes de cargar
`BannerAd`. El codigo sigue usando `AdRequest()` sin extras ni targeting propio
de la app.

Datos que puede procesar el SDK de anuncios, por su propia operacion:

- Advertising ID / identificadores publicitarios disponibles.
- App Set ID u otros identificadores del ecosistema Google Play Services, segun dispositivo/configuracion.
- Estado de red, direccion IP y datos tecnicos necesarios para cargar anuncios.
- Eventos de anuncios: carga, impresion, clics u otras metricas del SDK.
- Senales de Android AdServices/Privacy Sandbox cuando aplique.

La app no agrega email, nombre, contenido de tarjetas, respuestas escritas ni progreso de estudio a las solicitudes de anuncios.

Requisitos operativos antes de publicar con anuncios:

- Configurar en AdMob / Privacy & messaging los mensajes UMP aplicables a las
  regiones donde se sirvan anuncios.
- Usar una CMP certificada por Google para anuncios personalizados en EEA, UK y
  Suiza cuando corresponda.
- Mantener Play Console Data Safety alineado con la divulgacion oficial de
  Google Mobile Ads SDK: el SDK puede recopilar y compartir automaticamente
  direccion IP, interacciones de usuario con el producto, informacion de
  diagnostico e identificadores de dispositivo/cuenta para publicidad,
  analitica y prevencion de fraude.

Referencias tecnicas:

- https://developers.google.com/admob/flutter/privacy
- https://developers.google.com/admob/android/privacy/play-data-disclosure
- https://support.google.com/adsense/answer/13554116

La pantalla final de sesion incluye un anuncio medium rectangle y bloquea el
boton de continuar durante 5 segundos. Si se mantiene ese comportamiento, debe
validarse contra la politica de colocacion de anuncios y la experiencia de
salida de la pantalla antes de publicar.

### Enlaces externos

La app abre `https://flashlingo.github.io/` desde pantallas como home/settings/tour cuando el usuario toca enlaces de ayuda/descarga. La apertura se realiza con navegador externo o componentes de enlace.

### WebView local

El WebView se alimenta con HTML local generado por la app. El HTML importado no
puede conservar recursos remotos en `src` ni navegacion externa en `href`; las
imagenes/audio aceptados se sirven desde rutas locales `file:` preparadas por la
app. La navegacion dentro del WebView se cancela.

### Sin backend propio

No se encontro uso directo de:

- `package:http`, Dio u otro cliente HTTP propio.
- `HttpClient` propio.
- Sockets/WebSockets propios.
- APIs de login o cuentas.
- Analytics propios.
- Crash reporting propio.
- Cloud sync propio.

## Retencion y borrado

Los datos persisten localmente hasta que el usuario borra datos de la app, desinstala la app, borra/renombra mazos desde la UI o se ejecutan flujos internos de limpieza.

El borrado de mazo elimina:

- Flashcards del mazo.
- Review logs del mazo.
- Settings del mazo.
- Sesiones activas.
- Historial de sesiones.
- Estadisticas diarias.
- Media local que queda huerfana.

La actualizacion/importacion de mazos puede preservar progreso/configuracion segun la opcion de UI, y tambien puede limpiar media huerfana despues de reemplazar contenido.

Los archivos exportados CSV/PDF y backups `.flashjp` quedan en el directorio de soporte de la app hasta que el sistema o el usuario los elimine. Al compartirlos, una copia puede quedar en apps externas seleccionadas por el usuario.

## Datos que no recopila la app propia

Segun el codigo revisado, FlashLingo no recopila ni solicita directamente:

- Nombre real, email, telefono, cuenta, contrasena o perfil.
- Contactos.
- Ubicacion GPS o ubicacion aproximada solicitada por la app.
- Camara o microfono.
- Fotos/videos/audio del usuario mediante permisos de biblioteca.
- SMS o llamadas.
- Calendario.
- Datos de salud, financieros o pagos.
- Historial de navegacion del usuario.
- Texto escrito en write mode despues de la comparacion.
- Datos para un backend propio.

La integracion de anuncios si implica terceros y debe declararse aparte en tienda/politica de privacidad.

## Implicaciones para Play Console / politica de privacidad

Esta seccion es una guia tecnica, no una respuesta legal final.

Areas que probablemente deben declararse o revisarse:

- Publicidad de terceros: Google Mobile Ads.
- Identificadores: Advertising ID / device or other IDs por el SDK de anuncios
  cuando esten disponibles.
- Direccion IP y ubicacion aproximada inferida por el SDK de anuncios, segun la
  divulgacion oficial de Google Mobile Ads.
- Actividad en la app: interacciones con anuncios por el SDK; progreso de
  estudio almacenado localmente por la app.
- Contenido generado/importado por el usuario: mazos importados y media, almacenados localmente.
- Rendimiento/diagnostico de anuncios: eventos tecnicos, rendimiento del SDK y
  diagnosticos que Google Mobile Ads procese automaticamente.
- Comparticion iniciada por usuario: CSV/PDF y backups `.flashjp` exportados mediante share sheet.
- Permiso de notificaciones: `POST_NOTIFICATIONS` para recordatorios de estudio.
- Reprogramacion al reiniciar: `RECEIVE_BOOT_COMPLETED` para recordatorios.

Areas que el codigo propio no muestra como recopiladas para servidor propio:

- Ubicacion.
- Contactos.
- Informacion personal identificable de cuenta.
- Mensajes/SMS.
- Fotos/videos del usuario por permiso de galeria.
- Audio de microfono.
- Datos financieros.

Checklist antes de publicar:

- Verificar en la documentacion actual de Google Mobile Ads que categorias de
  Data Safety declara la version usada del SDK y completar Play Console con esas
  categorias.
- Configurar y probar los mensajes UMP/CMP en AdMob para las regiones donde sea
  obligatorio antes de servir anuncios personalizados.
- Probar que la entrada de opciones de privacidad de anuncios aparece en ajustes
  cuando UMP la marca como requerida.
- Mantener tests del saneador HTML para atributos sin comillas, entidades HTML,
  links peligrosos y recursos remotos.
- `android:allowBackup="false"` ya esta declarado, junto con reglas de extraccion de datos que excluyen respaldo en la nube y transferencia entre dispositivos. La migracion de datos se hace con el backup `.flashjp` por mazo.
- Alinear la politica publica con la exportacion CSV/PDF y backups `.flashjp`, porque esos archivos pueden contener textos de tarjetas, media y estadisticas de estudio.
- Alinear la politica publica con el permiso de notificaciones y el momento en
  que el codigo actual solicita ese permiso.

## Estado actual de publicacion Android

Este estado refleja el codigo y el build release auditado localmente, no una
respuesta final de Play Console.

- `flutter analyze`, `flutter test` y `flutter build appbundle --release`
  pasaron en la auditoria local.
- El bundle release generado queda en
  `build/app/outputs/bundle/release/app-release.aab`.
- El manifest release queda con `versionName="1.0.0"` y `versionCode="1"` para
  el primer release publico.
- El manifest release queda con `targetSdkVersion="36"`.
- El build incluye librerias de 64 bits (`arm64-v8a` y `x86_64`) y el
  `app-release.aab` auditado pasa la verificacion de page size de 16 KB:
  `libisar.so`, `libsqlite3.so`, `libdatastore_shared_counter.so`, `libapp.so`
  y `libflutter.so` tienen todos sus segmentos `LOAD` con `Align >= 0x4000`.
- Hay flujo UMP en `lib/features/ads/ad_consent_service.dart`: actualiza
  consentimiento al arrancar, muestra formulario si hace falta, bloquea la carga
  de anuncios hasta `canRequestAds` y expone opciones de privacidad de anuncios
  desde ajustes cuando UMP lo requiere.
- `android:allowBackup="false"` esta declarado explicitamente y las reglas de extraccion de datos (`res/xml/data_extraction_rules.xml`) excluyen respaldo en la nube y transferencia entre dispositivos.
- La documentacion publica y Play Console deben declarar anuncios, Advertising
  ID, permisos de notificacion, Data Safety y comportamiento de exportaciones.
