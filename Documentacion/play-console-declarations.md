# Play Console declarations (FlashLingo)

Guía práctica para completar las declaraciones obligatorias de Play Console
antes de publicar FlashLingo. Cada sección indica dónde está en Play Console,
qué responder y por qué, según el comportamiento real verificado del código.

> Esto es una guía técnica, no asesoría legal. Confirma siempre contra la
> documentación vigente de Google Play y de Google Mobile Ads, que pueden
> cambiar. La fuente de verdad sobre el SDK de anuncios es la página oficial de
> divulgación de datos del SDK (ver enlaces al final).

Hechos base verificados en el repositorio:

- App local-first, sin cuentas, sin backend propio, sin sync en la nube, sin
  analytics ni crash reporting propios.
- Único tercero que procesa datos fuera del dispositivo: **Google Mobile Ads**
  (banners AdMob), con flujo de consentimiento **UMP** antes de inicializar.
- Permisos de release relevantes: `INTERNET`, `ACCESS_NETWORK_STATE`,
  `com.google.android.gms.permission.AD_ID`, permisos AdServices,
  `POST_NOTIFICATIONS`, `RECEIVE_BOOT_COMPLETED`.
- `android:allowBackup="false"` + reglas de extracción de datos que excluyen
  respaldo en la nube y transferencia entre dispositivos.
- Exportaciones CSV/PDF y backups `.flashjp`: se comparten **solo por acción del
  usuario** mediante el share sheet del sistema (no es recopilación automática).

---

## 1. App content → Ads ("Contiene anuncios")

**Ruta:** Play Console → tu app → Policy/App content → **Ads**.

- ¿La app contiene anuncios? → **Sí, mi app contiene anuncios.**

Motivo: la app integra Google Mobile Ads (banner en estudio y medium rectangle
en pantalla final). Al declarar "Sí", Play muestra la insignia "Contiene
anuncios" en la ficha.

---

## 2. App content → Advertising ID

**Ruta:** Play Console → App content → **Advertising ID**.

- ¿Tu app usa el advertising ID? → **Sí.**
- Motivo del uso → marcar **Publicidad o marketing** y **Analítica**
  (el SDK de Google Mobile Ads usa el advertising ID para publicidad y
  medición). No marques perfiles ni otros usos que la app no realiza.
- Confirma que el permiso `com.google.android.gms.permission.AD_ID` está en el
  manifiesto fusionado (lo añade `play-services-ads`). **Está presente**, así que
  esta declaración es obligatoria.

> Si no declaras el advertising ID estando el permiso `AD_ID` presente, Play
> rechaza la entrega. Mantener ambos en sync es obligatorio.

---

## 3. Data Safety (Seguridad de los datos)

**Ruta:** Play Console → App content → **Data safety**.

### 3.1. Pregunta inicial

- ¿Tu app recopila o comparte alguno de los tipos de datos requeridos? →
  **Sí.**

Aunque la app **propia** guarda todo localmente (eso NO cuenta como
"recopilación" para Play, porque no sale del dispositivo), el **SDK de Google
Mobile Ads sí recopila y comparte datos** automáticamente. Por eso la respuesta
es "Sí".

### 3.2. Qué NO se declara como recopilado

- Contenido de mazos, progreso SRS, estadísticas, sesiones, logs, preferencias:
  **se quedan en el dispositivo** → no es "collection".
- CSV/PDF y backups `.flashjp`: **transferencia iniciada por el usuario** vía
  share sheet → exenta de declararse como recopilación (es el usuario quien
  elige compartir). Sí conviene mencionarla en la política de privacidad.
- La app no recopila para servidor propio: nombre, email, ubicación GPS,
  contactos, cámara, micrófono, SMS, salud, finanzas. Nada de eso.

### 3.3. Tipos de datos a declarar (origen: Google Mobile Ads SDK)

Para cada tipo: marca **Recopilado = Sí** y **Compartido = Sí** (el SDK envía a
Google y socios), **cifrado en tránsito = Sí** (HTTPS), y la **finalidad**
indicada. Marca como **opcional** (el usuario puede limitar vía consentimiento
UMP y reseteo del advertising ID).

| Categoría Play | Tipo de dato | Recopilado | Compartido | Finalidades |
| --- | --- | --- | --- | --- |
| Location | Approximate location | Sí | Sí | Publicidad o marketing |
| App activity | App interactions | Sí | Sí | Publicidad o marketing; Analítica |
| App info and performance | Crash logs | Sí | No* | Analítica |
| App info and performance | Diagnostics | Sí | No* | Analítica |
| Device or other IDs | Device or other IDs | Sí | Sí | Publicidad o marketing; Prevención de fraude/seguridad |

\* Crash logs/diagnostics: confírmalo contra la divulgación oficial vigente del
SDK; si la versión usada los marca como compartidos, ajústalo.

Notas:

- "Approximate location" en AdMob deriva de la IP, no del GPS (la app no pide
  permisos de ubicación).
- "Device or other IDs" cubre el advertising ID y App Set ID.
- No declares datos que el SDK no use en tu configuración (la app crea
  `AdRequest()` sin extras ni targeting propio, y no añade contenido de usuario a
  las solicitudes de anuncios).

### 3.4. Preguntas de seguridad/manejo

- ¿Todos los datos recopilados se cifran en tránsito? → **Sí** (Google Mobile
  Ads usa HTTPS).
- ¿Proporcionas una forma de solicitar la eliminación de datos? →
  La app **no tiene cuentas** y los datos propios son locales (se borran al
  desinstalar, borrar datos de la app, o borrar el mazo). Para los datos del SDK
  de anuncios, el usuario puede **resetear/limitar el advertising ID** en
  Ajustes de Android y usar las **opciones de privacidad de anuncios** dentro de
  la app (UMP). Documenta esto en la política de privacidad.

### 3.5. Política de privacidad

- Debes enlazar una **política de privacidad pública y accesible** que cubra:
  Google Mobile Ads como tercero, identificadores publicitarios, IP/ubicación
  aproximada inferida, actividad de anuncios, permiso de notificaciones, y las
  exportaciones/backup iniciados por el usuario.
- **Pendiente crítico aparte:** las páginas `flashlingo.github.io/privacy.html`,
  `/terms.html` y `/legal.html` están actualmente **vacías**. Hay que publicar su
  contenido antes de subir la app (la propia app las enlaza desde Ajustes).

---

## 4. AdMob Privacy & messaging (CMP / UMP) por regiones

El **código ya está listo** (verificado en
`lib/features/ads/ad_consent_service.dart` y `lib/features/ads/app_ads.dart`):

- En el arranque refresca el consentimiento UMP
  (`requestConsentInfoUpdate`), muestra el formulario si hace falta
  (`loadAndShowConsentFormIfRequired`) y **solo inicializa Mobile Ads y carga
  banners cuando `canRequestAds` es true**.
- Expone el punto de entrada de **opciones de privacidad** en Ajustes generales
  cuando UMP devuelve `getPrivacyOptionsRequirementStatus() == required`.

Lo que falta es **configuración en consola**, no código:

1. En **AdMob → Privacy & messaging**:
   - Crea y **publica** un mensaje **GDPR** (EEE + Reino Unido + Suiza). AdMob
     UMP es una CMP certificada por Google, válida para anuncios personalizados
     en esas regiones.
   - Crea el mensaje de **opciones de privacidad** (para que el usuario pueda
     reconsentir/retirar). El botón en Ajustes de la app abre este formulario.
   - Si vas a servir a EE. UU., crea también el mensaje aplicable (p. ej. US
     states / regulación correspondiente).
   - Selecciona las **regiones** objetivo en cada mensaje.
2. Asocia los mensajes a la(s) app(s) y a los ad unit ids de producción.
3. **Prueba** antes de publicar:
   - En una región/configuración donde UMP exige consentimiento, confirma que el
     formulario aparece **antes** de cargar anuncios.
   - Confirma que la entrada de opciones de privacidad aparece en Ajustes y abre
     el formulario UMP.
   - Para forzar geografía de prueba puedes usar `ConsentDebugSettings` con un
     hash de dispositivo de test (no dejarlo en el build de producción; el código
     actual usa `ConsentRequestParameters()` sin debug settings, que es lo
     correcto para release).

---

## 5. Content rating (Clasificación de contenido / IARC)

**Ruta:** Play Console → App content → **Content ratings** → cuestionario IARC.

- Categoría de la app → **Referencia / Educación** (utilidad educativa de
  estudio de vocabulario).
- Violencia, sexo, lenguaje soez, drogas, apuestas, miedo/horror → **No** para
  todo. La app es una herramienta de estudio sin ese contenido.
- ¿Contiene anuncios? → **Sí** (coincide con la declaración de la sección 1).
- ¿Compras digitales? → **No** (la app no tiene compras in-app).
- ¿Comparte la ubicación del usuario? → **No** por parte de la app (no pide
  ubicación; la ubicación aproximada por IP del SDK de anuncios se declara en
  Data Safety, no es compartir la ubicación del usuario por la app).
- Interacción entre usuarios / contenido generado por usuarios:
  - La app **no** tiene chat, perfiles ni feed social.
  - El usuario importa sus propios mazos y puede exportar/compartir archivos por
    el share sheet del sistema, pero **no hay intercambio de contenido entre
    usuarios dentro de la app**. Responde según el cuestionario: no hay
    comunicación entre usuarios moderable dentro de la app.

Resultado esperado: clasificación apta para público general (p. ej. ESRB
Everyone / PEGI 3 / similar), con la insignia de "Contiene anuncios".

---

## 6. Target audience and content (Público objetivo y contenido)

**Ruta:** Play Console → App content → **Target audience and content**.

> Importante: la app usa Google Mobile Ads con `AD_ID` y publicidad que puede ser
> personalizada. El SDK de AdMob **no está certificado para el programa
> "Designed for Families"** en su configuración por defecto. Por eso **no debes
> dirigir la app a menores de 13 años**.

- Grupos de edad objetivo → selecciona **13+** como edad mínima (o 16+/18+ si lo
  prefieres). **No** incluyas grupos de menores de 13.
- ¿La app está diseñada para niños o atrae a niños? → **No**.
- **No** te inscribas en "Designed for Families".
- Confirma que la ficha (icono, screenshots, descripción) no apele
  específicamente a niños, para ser coherente con el público 13+.

Motivo: combinar publicidad con advertising ID y dirigirse a menores activaría la
Política de Familias y la normativa de privacidad infantil; mantener el público
en 13+ evita ese conflicto con la configuración actual de anuncios.

---

## 7. Checklist previo a subir el release

- [ ] Ads: declarado "Contiene anuncios" = Sí.
- [ ] Advertising ID: declarado Sí, finalidad Publicidad/Analítica.
- [ ] Data Safety: completado según la tabla, alineado con la divulgación
      oficial vigente del SDK de Google Mobile Ads.
- [ ] Política de privacidad **publicada y accesible** (arreglar las páginas
      vacías de `flashlingo.github.io`).
- [ ] AdMob Privacy & messaging: mensajes GDPR + opciones de privacidad creados,
      con regiones, **publicados y probados**.
- [ ] Content rating: cuestionario IARC enviado.
- [ ] Target audience: 13+ (sin menores), sin "Designed for Families".
- [ ] Coincidencia permiso↔declaración: `AD_ID` presente ↔ advertising ID
      declarado; `POST_NOTIFICATIONS` revisado.
- [ ] `android:allowBackup="false"` y reglas de extracción de datos presentes en
      el manifiesto fusionado del release.

---

## Referencias

- Divulgación Data Safety del SDK de Google Mobile Ads:
  https://developers.google.com/admob/android/privacy/play-data-disclosure
- Privacidad de AdMob (Flutter):
  https://developers.google.com/admob/flutter/privacy
- Advertising ID (Play):
  https://support.google.com/googleplay/android-developer/answer/6048248
- Data safety (Play):
  https://support.google.com/googleplay/android-developer/answer/10787469
- Anuncios y familias (Play):
  https://support.google.com/googleplay/android-developer/answer/9893335
- Clasificación de contenido:
  https://support.google.com/googleplay/android-developer/answer/9859655
