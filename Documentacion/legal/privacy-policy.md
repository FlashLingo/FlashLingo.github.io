# FlashLingo — Política de Privacidad / Privacy Policy

> **BORRADOR / DRAFT.** Contenido redactado a partir del comportamiento técnico
> verificado de la app (ver `docs/flashlingo-privacidad-permisos-dependencias.md`).
> No es asesoría legal. Antes de publicarlo, revísalo con un profesional legal y
> completa los datos marcados con `[ ]`.
>
> Destino de publicación: `https://flashlingo.github.io/privacy.html`

- **Responsable / Data controller:** Javier Ponce (FlashLingo)
- **Contacto / Contact:** jponcelunapizarro@gmail.com
- **Aplicación / App:** FlashLingo (`com.flashlingo.app`)
- **Última actualización / Last updated:** 2026-06-28
- **Jurisdicción aplicable / Governing jurisdiction:** `[país / country]`

---

## Español

### 1. Introducción

FlashLingo es una aplicación Android para estudiar vocabulario con tarjetas
(flashcards) y repetición espaciada. Está diseñada como **local-first**: tu
contenido y tu progreso se guardan en tu dispositivo. Esta política explica qué
datos se tratan, por quién y con qué finalidad.

### 2. Resumen rápido

- No necesitas crear una cuenta. No pedimos nombre, correo ni contraseña.
- No tenemos servidor propio, ni sincronización en la nube, ni analítica propia,
  ni informes de fallos propios.
- Tu progreso, tus mazos y tus estadísticas se guardan **localmente** en tu
  dispositivo.
- La app muestra anuncios mediante **Google AdMob**, que es un tercero y trata
  ciertos datos según su propia política.
- El respaldo automático del sistema está **desactivado**
  (`android:allowBackup="false"`).

### 3. Datos que se guardan en tu dispositivo

Estos datos **no se envían a nosotros**; permanecen en el almacenamiento privado
de la app:

- Mazos importados y su contenido (palabras, significados, frases, lecturas).
- Archivos multimedia importados (audio, imágenes) copiados localmente.
- Progreso de estudio: estado de repetición espaciada, fechas de repaso,
  aciertos/fallos, tiempos, sesiones e historial.
- Estadísticas diarias por mazo.
- Preferencias: idioma de la app, tema (claro/oscuro/sistema) y estado del tour.

### 4. Anuncios y terceros (Google AdMob)

La app integra el SDK de Google Mobile Ads (AdMob) para mostrar banners. AdMob
es un servicio de Google y, según su propia documentación, puede recopilar y
tratar:

- Identificadores publicitarios (Advertising ID) y otros identificadores de
  dispositivo.
- Dirección IP y ubicación aproximada derivada de ella.
- Interacciones con los anuncios (cargas, impresiones, clics) y datos de
  diagnóstico/rendimiento del SDK.

Estos datos los trata Google con fines de publicidad, medición y prevención de
fraude. Más información en la política de privacidad de Google:
`https://policies.google.com/privacy` y en
`https://developers.google.com/admob/android/privacy`.

La app **no añade** tu nombre, correo, contenido de tarjetas ni progreso de
estudio a las solicitudes de anuncios.

#### Consentimiento (UMP / CMP)

Al iniciar, la app actualiza tu estado de consentimiento con la plataforma de
mensajería de usuario de Google (UMP) y muestra el formulario de consentimiento
cuando es necesario (por ejemplo, en el EEE, Reino Unido y Suiza). Los anuncios
solo se cargan cuando el consentimiento lo permite. Puedes volver a abrir tus
opciones de privacidad de anuncios desde **Ajustes** dentro de la app cuando
esa opción esté disponible en tu región.

### 5. Permisos

- **Notificaciones (`POST_NOTIFICATIONS`, Android 13+):** para mostrar
  recordatorios de estudio locales de los mazos que tú actives. Puedes
  concederlo o denegarlo y cambiarlo en los ajustes del sistema.
- **`RECEIVE_BOOT_COMPLETED`:** para reprogramar tus recordatorios después de
  reiniciar el dispositivo.
- **Internet / estado de red / Advertising ID / AdServices:** los requiere el
  SDK de anuncios. La app no tiene servidor propio.

La app **no** solicita cámara, micrófono, ubicación GPS, contactos, calendario,
SMS, teléfono ni acceso amplio al almacenamiento.

### 6. Exportaciones y compartición iniciadas por ti

Puedes exportar estadísticas (CSV/PDF) y copias de progreso por mazo (`.flashjp`)
y compartirlas mediante el selector del sistema. Esa compartición la inicias tú
y eliges la app de destino. Estos archivos pueden contener textos de tarjetas,
multimedia y métricas de estudio. En su versión 1, las copias `.flashjp` **no
están cifradas ni protegidas con contraseña**: quien reciba el archivo puede
abrirlo o importarlo.

### 7. Almacenamiento, seguridad y respaldo

Los datos se guardan en el espacio privado (sandbox) de la app del sistema
operativo. El respaldo automático del sistema y la transferencia entre
dispositivos están **desactivados**, por lo que tus datos locales no salen del
dispositivo por mecanismos de backup del sistema. La migración de datos se hace
manualmente con la copia `.flashjp` por mazo.

### 8. Menores

FlashLingo no está dirigida a menores de 13 años y no recopila a sabiendas datos
de menores. Por el uso de publicidad con identificador publicitario, el público
objetivo es de 13 años o más.

### 9. Conservación y eliminación

Tus datos permanecen en tu dispositivo hasta que: desinstalas la app, borras los
datos de la app desde los ajustes del sistema, o eliminas/renombras un mazo
dentro de la app (lo que borra sus tarjetas, ajustes, registros, sesiones,
estadísticas y multimedia huérfana). Respecto a la publicidad, puedes
restablecer o limitar tu Advertising ID en los ajustes de Android y cambiar tu
consentimiento desde las opciones de privacidad de anuncios.

### 10. Tus derechos

Según tu jurisdicción (por ejemplo, RGPD en la UE o CCPA en California), puedes
tener derechos de acceso, rectificación, eliminación u oposición. Como no
mantenemos datos personales en un servidor propio, esos derechos respecto a la
app se ejercen principalmente desde tu dispositivo. Para datos tratados por
Google AdMob, consulta la política de Google. Para consultas, escríbenos a
jponcelunapizarro@gmail.com.

### 11. Cambios

Podemos actualizar esta política. Publicaremos la versión vigente en esta misma
dirección con su fecha de actualización.

### 12. Contacto

jponcelunapizarro@gmail.com

---

## English

### 1. Introduction

FlashLingo is an Android app for studying vocabulary with flashcards and spaced
repetition. It is designed to be **local-first**: your content and progress stay
on your device. This policy explains what data is processed, by whom, and why.

### 2. Quick summary

- No account is required. We do not ask for your name, email, or password.
- We have no server of our own, no cloud sync, no first-party analytics, and no
  first-party crash reporting.
- Your progress, decks, and statistics are stored **locally** on your device.
- The app shows ads through **Google AdMob**, a third party that processes some
  data under its own policy.
- System auto-backup is **disabled** (`android:allowBackup="false"`).

### 3. Data stored on your device

This data is **not sent to us**; it stays in the app's private storage:

- Imported decks and their content (words, meanings, sentences, readings).
- Imported media (audio, images) copied locally.
- Study progress: spaced-repetition state, review dates, correct/incorrect
  results, timings, sessions, and history.
- Per-deck daily statistics.
- Preferences: app language, theme (light/dark/system), and onboarding state.

### 4. Advertising and third parties (Google AdMob)

The app integrates the Google Mobile Ads (AdMob) SDK to show banners. AdMob is a
Google service and, per its documentation, may collect and process:

- Advertising ID and other device identifiers.
- IP address and approximate location derived from it.
- Ad interactions (loads, impressions, clicks) and SDK diagnostic/performance
  data.

Google processes this data for advertising, measurement, and fraud prevention.
See Google's privacy policy at `https://policies.google.com/privacy` and
`https://developers.google.com/admob/android/privacy`.

The app does **not** add your name, email, card content, or study progress to ad
requests.

#### Consent (UMP / CMP)

On startup, the app refreshes your consent status with Google's User Messaging
Platform (UMP) and shows the consent form when required (for example, in the
EEA, the UK, and Switzerland). Ads load only when consent allows it. You can
reopen your ad privacy options from **Settings** inside the app where that option
is available in your region.

### 5. Permissions

- **Notifications (`POST_NOTIFICATIONS`, Android 13+):** to show local study
  reminders for the decks you enable. You may grant or deny it and change it in
  system settings.
- **`RECEIVE_BOOT_COMPLETED`:** to reschedule your reminders after a device
  restart.
- **Internet / network state / Advertising ID / AdServices:** required by the
  ads SDK. The app has no server of its own.

The app does **not** request camera, microphone, GPS location, contacts,
calendar, SMS, phone, or broad storage access.

### 6. User-initiated export and sharing

You can export statistics (CSV/PDF) and per-deck progress backups (`.flashjp`)
and share them through the system share sheet. You initiate this sharing and
choose the destination app. These files may contain card text, media, and study
metrics. In version 1, `.flashjp` backups are **not encrypted or password
protected**: anyone who receives the file can open or import it.

### 7. Storage, security, and backup

Data is stored in the operating system's private app sandbox. System auto-backup
and device-to-device transfer are **disabled**, so your local data does not leave
the device through system backup mechanisms. Data migration is done manually with
the per-deck `.flashjp` backup.

### 8. Children

FlashLingo is not directed to children under 13 and does not knowingly collect
data from children. Because of advertising with an advertising identifier, the
target audience is 13 years or older.

### 9. Retention and deletion

Your data remains on your device until you: uninstall the app, clear the app's
data from system settings, or delete/rename a deck inside the app (which removes
its cards, settings, logs, sessions, statistics, and orphaned media). For
advertising, you can reset or limit your Advertising ID in Android settings and
change your consent from the ad privacy options.

### 10. Your rights

Depending on your jurisdiction (for example, GDPR in the EU or CCPA in
California), you may have rights of access, rectification, deletion, or
objection. Because we keep no personal data on a server of our own, those rights
regarding the app are exercised mainly from your device. For data processed by
Google AdMob, see Google's policy. For inquiries, contact us at
jponcelunapizarro@gmail.com.

### 11. Changes

We may update this policy. We will publish the current version at this same
address with its update date.

### 12. Contact

jponcelunapizarro@gmail.com
