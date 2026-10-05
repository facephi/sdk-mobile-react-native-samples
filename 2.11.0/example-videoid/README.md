# VideoId Example

Aplicación de ejemplo en React Native que integra los plugins de Facephi **SDK Core** y **VideoId** (`2.12.0`). Sirve para probar la captura de vídeo (rostro y/o documento) sobre una sesión licenciada.

| Plugin | Paquete | Rol |
|--------|---------|-----|
| Core | `@facephi/sdk-core-react-native` | Sesión, operación y eventos nativos |
| VideoId | `@facephi/sdk-videoid-react-native` | Captura de vídeo |

## Requisitos

- Node `>= 18`
- React Native `0.83`
- **iOS** 13.0+ (CocoaPods + plugin `cocoapods-art` con el source `cocoa-pro-fphi`)
- **Android** `minSdk` 24
- Los paquetes locales en `../2.12.0/sdk-core` y `../2.12.0/sdk-videoid` (ver `package.json`)
- Licencia online de Facephi (`licenseUrl` + API key por plataforma)

Este ejemplo no funciona con Expo managed workflow: los plugins requieren código nativo enlazado.

## Instalación

```sh
npm install
# o
yarn
```

### iOS

```sh
cd ios && bundle exec pod install && cd ..
```

El `Podfile` usa `cocoapods-art` contra el repositorio `cocoa-pro-fphi`.

### Android

Con autolinking no hace falta registrar los módulos a mano. Recompila la app después de instalar o actualizar los plugins.

## Configuración

Edita `constants.tsx` antes de lanzar la app:

| Constante | Uso |
|-----------|-----|
| `CUSTOMER_ID` | Identificador de cliente en `initOperation` |
| `LICENSE_URL` | Endpoint de licenciamiento online |
| `LICENSE_APIKEY_IOS` | API key de licencia en iOS |
| `LICENSE_APIKEY_ANDROID` | API key de licencia en Android |
| `TRACKING_ERROR_LISTENER` | Nombre del evento nativo de errores de tracking (`tracking.error.listener`) |

La sesión se abre con licencia **online** (`licenseUrl` + `licenseApiKey`). La licencia offline (`license`) está comentada en `App.tsx`.

## Cómo arrancar

```sh
npm start
```

En otra terminal:

```sh
npm run android
# o
npm run ios
```

Al abrir la app se llama a `initSession`. La pantalla muestra cuatro acciones:

| Botón | Qué hace |
|-------|----------|
| **VideoId** | Lanza la captura con `videoid()` |
| **Init Operation** | Abre una operación de onboarding |
| **Init Session** | Vuelve a inicializar la sesión |
| **Close Session** | Cierra la sesión y quita los listeners |

## Uso de los plugins

El flujo de esta demo está en `App.tsx`.

### 1. Imports

```ts
import {
  SdkFinishStatus,
  SdkOperationType,
  closeSession,
  initOperation,
  initSession,
  type CoreResult,
  type InitOperationConfiguration,
  type InitSessionConfiguration,
} from '@facephi/sdk-core-react-native';

import {
  VideoMode,
  videoid,
  type VideoIdConfiguration,
  type VideoIdResult,
} from '@facephi/sdk-videoid-react-native';
```

### 2. Eventos nativos

Suscríbete a `NativeModules.SdkMobileCore` mientras la sesión esté abierta. En esta app se registran al montar y se eliminan en `closeSession`.

```ts
import { NativeEventEmitter, NativeModules } from 'react-native';
import { TRACKING_ERROR_LISTENER } from './constants';

const emitter = new NativeEventEmitter(NativeModules.SdkMobileCore);

const trackingListener = emitter.addListener(TRACKING_ERROR_LISTENER, (res) => {
  console.log('TRACKING_ERROR_LISTENER', res);
});

const flowListener = emitter.addListener('core.flow', (res) => {
  console.log('FLOW_LISTENER', res);
});
```

| Evento | Cuándo |
|--------|--------|
| `core.flow` | Resultado de cada paso de un flujo del Core |
| `tracking.error.listener` | Error de tracking (con `enableTracking: true`) |

### 3. Iniciar sesión

Se ejecuta en el `useEffect` inicial y también desde el botón **Init Session**.

```ts
const config: InitSessionConfiguration = {
  licenseUrl: LICENSE_URL,
  licenseApiKey: Platform.OS === 'ios' ? LICENSE_APIKEY_IOS : LICENSE_APIKEY_ANDROID,
  enableTracking: true,
};

const result: CoreResult = await initSession(config);

if (result.finishStatus === SdkFinishStatus.Error) {
  // result.errorType, por ejemplo EMPTY_LICENSE o LICENSE_CHECKER_ERROR
}
```

`SdkFinishStatus.Ok` vale `1` y `SdkFinishStatus.Error` vale `2`. El detalle va en `errorType` (string).

### 4. Iniciar operación

El botón **Init Operation** abre una operación de onboarding. Hazlo después de una sesión correcta y antes de tratar el resultado como parte de un onboarding.

```ts
const config: InitOperationConfiguration = {
  customerId: CUSTOMER_ID,
  type: SdkOperationType.Onboarding, // o SdkOperationType.Authentication
};

const result = await initOperation(config);
```

### 5. Lanzar VideoId

El botón **VideoId** usa el modo solo rostro, con tutorial y detección automática. Los tiempos están en milisegundos.

```ts
const config: VideoIdConfiguration = {
  sectionTime: 10000,
  sectionTimeout: 12000,
  mode: VideoMode.ONLY_FACE,
  showTutorial: true,
  autoFaceDetection: true,
};

const result: VideoIdResult = await videoid(config);

if (result.finishStatus === SdkFinishStatus.Error) {
  // result.errorType
}
```

Otros modos disponibles en `VideoMode`:

| Valor | Captura |
|-------|---------|
| `ONLY_FACE` | Solo rostro (el que usa este ejemplo) |
| `FACE_DOCUMENT_FRONT` | Rostro + anverso del documento |
| `FACE_DOCUMENT_FRONT_BACK` | Rostro + anverso y reverso |
| `DOCUMENT_FRONT` | Solo anverso |
| `DOCUMENT_FRONT_BACK` | Anverso y reverso |

Campos útiles de `VideoIdResult`: `finishStatus`, `errorType`, `errorMessage`, `faceImage` (base64), `documentType`, `personalData`, `frontDocumentData`, `backDocumentData`.

Otras propiedades de `VideoIdConfiguration` que puedes activar: `cameraPreferred` (`CameraPreferred.FRONT` / `BACK`), `vibrationEnabled`, `speechText`, `timeoutFaceDetection`, `maxRetries`, `countryFilter`, `documentFilter`, `ocrValidations`, `debug`.

### 6. Cerrar sesión

El botón **Close Session** cierra la sesión y elimina los listeners.

```ts
const result = await closeSession();
trackingListener.remove();
flowListener.remove();
```

## Permisos

La captura pide cámara (y micrófono si el flujo usa voz). Esta app ya declara:

- **iOS** (`ios/Example/Info.plist`): `NSCameraUsageDescription`, `NSMicrophoneUsageDescription`, `NSLocationWhenInUseUsageDescription`
- **Android** (`AndroidManifest.xml`): `INTERNET`, `ACCESS_COARSE_LOCATION`, `ACCESS_FINE_LOCATION`

Si `errorType` es `CAMERA_PERMISSION_DENIED`, `MIC_PERMISSION_DENIED` o `LOCATION_PERMISSION_DENIED`, concede el permiso en el dispositivo y vuelve a lanzar el flujo.

## Solución de problemas

**El paquete no está enlazado** (`sdk-core` o `sdk-videoid`). En iOS ejecuta `pod install` y recompila. Un reload de Metro no enlaza código nativo.

**`initSession` termina en error.** Revisa `errorType`. Con licencia online hacen falta `LICENSE_URL` y la API key de la plataforma en `constants.tsx`.

**VideoId no arranca tras un refresh.** Reconstruye la app nativa si acabas de cambiar la versión de los plugins en `../2.12.0`.
