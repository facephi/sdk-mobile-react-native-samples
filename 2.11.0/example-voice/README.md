# Facephi Voice Example

App de ejemplo en React Native que integra los plugins de Facephi para abrir una sesión del SDK, iniciar una operación y ejecutar el flujo de verificación por voz en iOS y Android.

## Plugins

| Plugin | Versión | Uso en la app |
| --- | --- | --- |
| [`@facephi/sdk-core-react-native`](../2.10.0/sdk-core/README.md) | 2.10.0 | Sesión, operación y eventos de tracking |
| [`@facephi/sdk-voice-react-native`](../2.10.0/sdk-voice/README.md) | 2.10.0 | Captura de voz y resultado de la extracción |

En este repositorio se enlazan en local desde `package.json`:

```json
"@facephi/sdk-core-react-native": "../2.10.0/sdk-core",
"@facephi/sdk-voice-react-native": "../2.10.0/sdk-voice"
```

Los binarios nativos (`com.facephi.androidsdk` en Android y los pods `FPHISDK*` en iOS) se resuelven desde los repositorios privados de Facephi. El flujo managed de Expo no está soportado.

## Requisitos

- Entorno de [React Native](https://reactnative.dev/docs/set-up-your-environment) configurado.
- Node.js 18 o superior.
- React Native 0.83, con la nueva arquitectura y Hermes activados (`android/gradle.properties`).
- Android: `minSdk` 24.
- iOS: deployment target 13.0.
- Credenciales de Artifactory para Android y el repositorio CocoaPods `cocoa-pro-fphi` para iOS.
- Licencia y API keys de Facephi.

## Configuración

### Licencia

Edita `constants.tsx` antes de ejecutar la app:

| Constante | Uso |
| --- | --- |
| `CUSTOMER_ID` | Identificador de cliente que se envía en `initOperation` |
| `LICENSE_URL` | URL del servicio de licencias |
| `LICENSE_APIKEY_IOS` | API key de la licencia en iOS |
| `LICENSE_APIKEY_ANDROID` | API key de la licencia en Android |

`App.tsx` llama a `initSession` con `licenseUrl`, `licenseApiKey` y `enableTracking: true`. Si necesitas una licencia embebida, descomenta el campo `license` y rellena `LICENSE_IOS_NEW` o `LICENSE_ANDROID_NEW`.

### Android: Artifactory

`sdk-core` descarga los artefactos `com.facephi.androidsdk` desde JFrog. Exporta estas variables antes de compilar:

```sh
export USERNAME_ARTIFACTORY="<usuario>"
export TOKEN_ARTIFACTORY="<token>"
```

También se acepta `FPHI_USERNAME_ARTIFACTORY` en lugar de `USERNAME_ARTIFACTORY`.

### iOS: CocoaPods Art

El `Podfile` usa el plugin `cocoapods-art` con la fuente `cocoa-pro-fphi`, además de `https://cdn.cocoapods.org/`. El repositorio Art tiene que estar dado de alta en la máquina antes de `pod install`.

Los pods nativos que resuelven los plugins son:

- Core: `FPHISDKMainComponent`, `FPHISDKCoreComponent`, `FPHISDKTrackingComponent`, `FPHISDKTokenizeComponent`, `FPHISDKStatusComponent`
- Voice: `FPHISDKVoiceIDComponent` y `FPHISDKMainComponent`

## Instalación

Desde la raíz del ejemplo:

```sh
yarn
```

### iOS

```sh
bundle install
cd ios && bundle exec pod install && cd ..
yarn ios
```

`pod install` hace falta en el primer clon y cada vez que cambien dependencias nativas.

### Android

```sh
yarn android
```

Metro se puede arrancar aparte con `yarn start`.

## Flujo de la demo

Al abrir la app se ejecuta `initSession`. Después, los botones de la pantalla siguen este orden:

1. **Init Operation** — `initOperation` con `SdkOperationType.Onboarding` y `CUSTOMER_ID`.
2. **Voice** — `voice()` con la configuración de `getVoiceConfiguration()`.
3. **Close Session** — `closeSession()` y baja del listener de tracking.

**Init Session** vuelve a abrir la sesión. Si `finishStatus` es `SdkFinishStatus.Error`, el mensaje se muestra en `SdkWarning`.

Los errores de tracking llegan por el evento nativo `tracking.error.listener` (`TRACKING_ERROR_LISTENER` en `constants.tsx`), expuesto en iOS a través de `NativeModules.SdkMobileCore`.

### Configuración de voz

La captura de este ejemplo usa:

```ts
const sdkConfiguration: VoiceConfiguration = {
  phrases: 'hola que tal|hola que tal prueba',
  showTutorial: true,
  vibrationEnabled: true,
  returnAudios: true,
  returnTokenizedAudios: true,
};
```

`phrases` admite varias frases separadas. `returnAudios` y `returnTokenizedAudios` incluyen los audios en `VoiceResult`. El resto de campos (`extractionTimeout`, `showDiagnostic`, `showPreviousTip`, `enableQualityCheck`, `minSpeechLength`) está documentado en el README de `@facephi/sdk-voice-react-native`.

## Permisos y recursos nativos

- **iOS:** `NSMicrophoneUsageDescription` en `ios/Example/Info.plist`. Sin ese texto el sistema no concede el micrófono.
- **Android:** el plugin de voz registra `VoiceMainActivity`. La app declara `INTERNET` y los permisos de ubicación que usa el tracking del core.
- **Fuente:** `CircularStd-Bold` está registrada en iOS (`UIAppFonts`) y copiada en `android/app/src/main/assets/fonts/`. La usan `SdkButton` y `SdkTopBar`.

## Estructura

```text
App.tsx                         Flujo de sesión, operación y voz
constants.tsx                   Licencia, customer id y nombre del listener
components/commons/             Barra superior, botones, aviso de error y action sheet
```

## Solución de problemas

- **El paquete no está enlazado.** En iOS ejecuta `bundle exec pod install` dentro de `ios/` y recompila la app. En Android haz un clean build después de instalar o actualizar los plugins.
- **401 o artefacto de Facephi no encontrado en Android.** Revisa `USERNAME_ARTIFACTORY` (o `FPHI_USERNAME_ARTIFACTORY`) y `TOKEN_ARTIFACTORY`.
- **`pod install` no encuentra `FPHISDK*`.** El repo `cocoa-pro-fphi` no está configurado en CocoaPods Art.
- **La sesión termina en error.** Comprueba `LICENSE_URL` y la API key de la plataforma en `constants.tsx`. El tipo de error llega en `errorType`.
- **La captura de voz no arranca.** Confirma que la sesión y la operación se iniciaron antes, y que el micrófono está permitido.
