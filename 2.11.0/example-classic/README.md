# Example Classic — Facephi SDK (React Native)

App de ejemplo que muestra cómo usar los plugins de **Facephi SDK 2.12.0** en un proyecto React Native bare (iOS y Android).

Los plugins se enlazan en local desde `../2.12.0/`:

| Plugin | Paquete | Qué hace en esta app |
|--------|---------|----------------------|
| Core | `@facephi/sdk-core-react-native` | Sesión, licencia, operación, extra data y flujo unificado |
| Selphi | `@facephi/sdk-selphi-react-native` | Captura facial (selfie) con liveness pasivo |
| SelphID | `@facephi/sdk-selphid-react-native` | Captura de documento de identidad |

La UI vive en `App.tsx`. Cada botón llama a un provider:

- `providers/core.tsx` — sesión, operación, extra data y flujo
- `providers/selphi.tsx` — widget Selphi
- `providers/selphid.tsx` — widget SelphID

Expo managed no está soportado: hace falta código nativo enlazado (`pod install` en iOS y rebuild en ambas plataformas).

## Puesta en marcha

Node `>= 22.11.0`. Completa antes la [guía de entorno de React Native](https://reactnative.dev/docs/set-up-your-environment).

```sh
npm install
npm start
```

En otra terminal:

```sh
# Android
npm run android

# iOS (primera vez, o tras cambiar dependencias nativas)
bundle install
bundle exec pod install
npm run ios
```

### Licencia

`initSession` usa licencia **online**. Los valores están en `constants.tsx`:

- `LICENSE_URL`
- `LICENSE_APIKEY_IOS` / `LICENSE_APIKEY_ANDROID` (se elige según `Platform.OS`)
- `CUSTOMER_ID`

Sin una licencia válida, `initSession` devuelve `SdkFinishStatus.Error` (`EMPTY_LICENSE`, `LICENSE_CHECKER_ERROR`, etc.).

### Permisos y recursos

- **iOS** (`ios/Example/Info.plist`): cámara (`NSCameraUsageDescription`) y localización en uso (`NSLocationWhenInUseUsageDescription`). El tracking está activo en la sesión.
- **Android** (`AndroidManifest.xml`): internet y localización (`ACCESS_COARSE_LOCATION`, `ACCESS_FINE_LOCATION`).
- Los widgets cargan los zips de recursos indicados en la configuración:
  - Selphi: `fphi-selphi-widget-resources-sdk.zip`
  - SelphID: `fphi-selphid-widget-resources-sdk.zip`

Esos archivos tienen que estar en el bundle nativo de la app. Si faltan, el widget falla con un error de recursos.

## Orden de uso

Al arrancar, `App.tsx` llama a `launchInitSession`. A partir de ahí hay dos caminos.

### Captura suelta (botones de la pantalla)

1. **Init Session** — abre la sesión con la licencia.
2. **Init Operation** — crea una operación de onboarding y guarda el `operationId`.
3. **Start Selphi** y/o **Start SelphID** — abren el widget y pintan las imágenes.
4. **ExtraData** — pide el tracking del Core y lo envía, junto con la plantilla facial, a la API de evaluación.
5. **Get SessionId Info** / **Get OperationId Info** — solo aparecen cuando ya hay `operationId`.
6. **Close Session** — cierra la sesión y limpia resultados e `operationId`.

### Flujo unificado

**Launch Flow** registra Selphi y SelphID en el flujo `FLOW_B` y lo arranca:

1. `initFlow({ flow: "FLOW_B", customerId })`
2. `setSelphiFlow()`
3. `setSelphidFlow()`
4. `startFlow()`

`startFlow()` resuelve cuando el nativo lanza el flujo. Los pasos intermedios llegan por el evento `core.flow` de `NativeModules.SdkMobileCore` (el listener está comentado en `App.tsx`).

## Core

Import desde `@facephi/sdk-core-react-native`. Todas las llamadas devuelven `Promise<CoreResult>`.

```ts
import {
  initSession,
  initOperation,
  closeSession,
  getExtraData,
  getSessionId,
  getOperationId,
  initFlow,
  startFlow,
  SdkFinishStatus,
  SdkOperationType,
  type InitSessionConfiguration,
  type InitOperationConfiguration,
  type CoreResult,
} from '@facephi/sdk-core-react-native';
```

`finishStatus` es `SdkFinishStatus.Ok` (`1`) o `SdkFinishStatus.Error` (`2`). En error, `drawError` muestra `errorType` en pantalla.

### Sesión

```ts
const config: InitSessionConfiguration = {
  licenseUrl: LICENSE_URL,
  licenseApiKey: Platform.OS === 'ios' ? LICENSE_APIKEY_IOS : LICENSE_APIKEY_ANDROID,
  enableTracking: true,
};

const result = await initSession(config);
```

Licencia offline (no usada aquí): campo `license` en lugar de `licenseUrl` + `licenseApiKey`.

### Operación

```ts
const config: InitOperationConfiguration = {
  customerId: CUSTOMER_ID,
  type: SdkOperationType.Onboarding, // alternativa: SdkOperationType.Authentication
};

const result = await initOperation(config);
// result.data es el operationId cuando finishStatus es Ok
```

`getSessionId()` y `getOperationId()` devuelven el id en `result.data`.

### Extra data

`getExtraData()` devuelve el payload de tracking en `result.data`. Si Selphi terminó bien, `callGetExtraData` hace dos `POST` a `https://external-selphid-sdk.facephi.dev` (`apiRest.tsx`):

| Endpoint | Cuerpo |
|----------|--------|
| `/v5/api/v1/selphid/passive-liveness/evaluate` | `extraData` + `image` (`selphiResult.bestImageTemplateRaw`) |
| `/v5/api/v1/selphid/authenticate-facial/document/face-image` | `documentTemplate` (`selphidResult.tokenFaceImage`), `extraData` e `image1` |

Hace falta una captura Selphi previa. El segundo call también usa el token facial de SelphID si existe.

### Cierre

```ts
await closeSession();
```

## Selphi

Import desde `@facephi/sdk-selphi-react-native`. `startSelphi` abre el widget con esta configuración (`providers/selphi.tsx`):

```ts
import {
  selphi,
  SdkCompressFormat,
  SdkLivenessMode,
  type SelphiConfiguration,
  type SelphiResult,
} from '@facephi/sdk-selphi-react-native';

const config: SelphiConfiguration = {
  fullscreen: true,
  livenessMode: SdkLivenessMode.PassiveMode,
  resourcesPath: 'fphi-selphi-widget-resources-sdk.zip',
  enableGenerateTemplateRaw: true,
  showResultAfterCapture: true,
  jpgQuality: 0.95,
  compressFormat: SdkCompressFormat.JPEG,
  showDiagnostic: true,
};

const result: SelphiResult = await selphi(config);
```

Si `finishStatus` es `Ok`, la pantalla muestra `bestImageCropped`. `bestImageTemplateRaw` se usa después en ExtraData. En error se muestra `errorType`.

Para el flujo unificado, Core llama a `setSelphiFlow()` antes de `startFlow()`.

## SelphID

Import desde `@facephi/sdk-selphid-react-native`. `startSelphid` abre el widget con esta configuración (`providers/selphid.tsx`):

```ts
import {
  selphid,
  SdkDocumentType,
  SdkScanMode,
  type SelphidConfiguration,
  type SelphidResult,
} from '@facephi/sdk-selphid-react-native';

const config: SelphidConfiguration = {
  showResultAfterCapture: true,
  showTutorial: false,
  scanMode: SdkScanMode.Search,
  specificData: 'AR|<ALL>',
  documentType: SdkDocumentType.IdCard,
  fullscreen: true,
  resourcesPath: 'fphi-selphid-widget-resources-sdk.zip',
  wizardMode: true,
};

const result: SelphidResult = await selphid(config);
```

`specificData: 'AR|<ALL>'` limita la búsqueda a documentos de Argentina. `documentType` es `IdCard` (también existen `Passport`, `DriversLicense`, `ForeignCard`, `CreditCard`, `Custom` y `Visa`).

Si la captura es correcta, la pantalla muestra:

- `frontDocumentImage` (frente)
- `backDocumentImage` (dorso)
- `faceImage` (rostro del documento)
- `documentData` (datos OCR, en el botón de alerta)

`tokenFaceImage` se reutiliza en la autenticación facial de ExtraData.

Para el flujo unificado, Core llama a `setSelphidFlow()` antes de `startFlow()`.

## Qué mirar en el resultado

| Campo | Origen | Uso en la app |
|-------|--------|----------------|
| `finishStatus` / `errorType` | Core, Selphi, SelphID | OK o mensaje de error |
| `data` | Core | operationId, sessionId o extraData |
| `bestImageCropped` | Selphi | preview de la selfie |
| `bestImageTemplateRaw` | Selphi | imagen enviada a liveness y autenticación |
| `frontDocumentImage` / `backDocumentImage` / `faceImage` | SelphID | previews del documento |
| `documentData` | SelphID | datos leídos del documento |
| `tokenFaceImage` | SelphID | plantilla facial del documento |

`errorType` es un string del nativo (`NO_ERROR`, `CANCEL_BY_USER`, `CAMERA_PERMISSION_DENIED`, `NETWORK_CONNECTION`, `TIMEOUT`, …). Compáralo como texto, no como número. El detalle de cada plugin está en:

- `../2.12.0/sdk-core/README.md`
- `../2.12.0/sdk-selphi/README.md`
- `../2.12.0/sdk-selphid/README.md`

## Problemas frecuentes

- **El paquete no está enlazado.** Ejecuta `pod install` en `ios` y recompila. Un reload de Metro no vuelve a enlazar nativo.
- **`initSession` termina en error.** Revisa URL, API key y que el `applicationId` / bundle id (`com.facephi.sdk.demo`) coincida con la licencia.
- **El widget no abre o falla por recursos.** Comprueba que los zips `fphi-selphi-widget-resources-sdk.zip` y `fphi-selphid-widget-resources-sdk.zip` estén en el proyecto nativo y que `resourcesPath` use ese nombre.
- **ExtraData no llama a la API.** Primero tiene que haber un Selphi con `finishStatus` OK. La autenticación facial también espera `tokenFaceImage` de SelphID.
- **Launch Flow no muestra capturas.** `startFlow()` solo confirma el arranque. Suscríbete a `core.flow` antes de lanzarlo.
