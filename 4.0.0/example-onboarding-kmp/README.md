# Example Classic KMP

React Native sample for the Facephi widgets. The app opens a session, captures a selfie (Selphi) and an identity document (SelphID), and can run the same widgets inside an orchestrated flow.

| Package | Role |
| --- | --- |
| `@facephi/sdk-core-react-native` | License, session, operation and flow |
| `@facephi/sdk-selphi-react-native` | Facial capture and liveness |
| `@facephi/sdk-selphid-react-native` | Document capture and OCR |

The calls live in `providers/core.tsx`, `providers/selphi.tsx` and `providers/selphid.tsx`. `App.tsx` wires them to the buttons.

## Requirements

- React Native environment: [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment)
- Node `>= 22.11.0`
- A Facephi license URL and API key for the platform you run (Android or iOS)

This example links the SDKs from the sibling `4.0.0` folders:

```json
"@facephi/sdk-core-react-native": "../4.0.0/sdk-core",
"@facephi/sdk-selphi-react-native": "../4.0.0/sdk-selphi",
"@facephi/sdk-selphid-react-native": "../4.0.0/sdk-selphid"
```

To consume published packages instead:

```sh
npm install @facephi/sdk-core-react-native @facephi/sdk-selphi-react-native @facephi/sdk-selphid-react-native
```

## Run the example

```sh
npm install
npm start
```

In another terminal:

```sh
# Android
npm run android

# iOS (first clone, or after a native dependency change)
bundle install
bundle exec pod install
npm run ios
```

Put the license in `constants.tsx` before launching a session. Do not commit real keys.

```ts
export const LICENSE_URL = 'https://license.identity-platform.io';
export const LICENSE_APIKEY_ANDROID = '<android-api-key>';
export const LICENSE_APIKEY_IOS = '<ios-api-key>';
export const CUSTOMER_ID = 'your-customer-id';
```

## Typical sequence

1. `initSession` with the license.
2. `initOperation` (`Onboarding` or `Authentication`).
3. `selphi` and/or `selphid`.
4. `getExtraData` if you need the tracking payload for a backend call.
5. `closeSession`.

`App.tsx` starts the session on mount. The buttons repeat each step on demand.

## Core

```ts
import { Platform } from 'react-native';
import {
  SdkFinishStatus,
  SdkOperationType,
  initSession,
  initOperation,
  closeSession,
  getExtraData,
  getOperationId,
  getSessionId,
  CoreResult,
} from '@facephi/sdk-core-react-native';

const session = await initSession({
  licenseUrl: LICENSE_URL,
  licenseApiKey: Platform.OS === 'ios' ? LICENSE_APIKEY_IOS : LICENSE_APIKEY_ANDROID,
  enableTracking: true,
});

if (session.finishStatus === SdkFinishStatus.Error) {
  console.log(session.errorType, session.errorMessage);
}

const operation = await initOperation({
  customerId: CUSTOMER_ID,
  type: SdkOperationType.Onboarding,
});

if (operation.finishStatus === SdkFinishStatus.Ok) {
  const operationId = operation.data;
}

const extraData: CoreResult = await getExtraData();
const operationInfo = await getOperationId();
const sessionInfo = await getSessionId();

await closeSession();
```

`SdkFinishStatus.Ok` is `1` and `SdkFinishStatus.Error` is `2`. On error, `errorType` is the diagnostic code (`TIMEOUT`, `CAMERA_PERMISSION_DENIED`, licensing errors, and so on).

## Selphi

Selfie and passive liveness. The configuration below is the one in `providers/selphi.tsx`.

```ts
import { SdkFinishStatus } from '@facephi/sdk-core-react-native';
import {
  SdkCompressFormat,
  SdkLivenessMode,
  selphi,
  SelphiResult,
} from '@facephi/sdk-selphi-react-native';

const result: SelphiResult = await selphi({
  livenessMode: SdkLivenessMode.PassiveMode,
  enableGenerateTemplateRaw: true,
  showResultAfterCapture: true,
  jpgQuality: 95,
  compressFormat: SdkCompressFormat.JPEG,
  showDiagnostic: true,
});

if (result.finishStatus === SdkFinishStatus.Ok) {
  const selfie = result.bestImageCropped;
  const template = result.bestImageTemplateRaw;
}
```

Useful result fields: `bestImage`, `bestImageCropped`, `bestImageTemplateRaw`, `templateRaw`, `livenessDiagnostic`, `qrData`.

Other entry points on the same package: `signatureSelphi`, `generateTemplateRaw` and `setSelphiFlow` (used by the orchestrated flow).

## SelphID

Document capture. The configuration below is the one in `providers/selphid.tsx`. `documentData` comes back as a JSON string; this example parses it in `SelphIDButtonAlert`.

```ts
import { SdkFinishStatus } from '@facephi/sdk-core-react-native';
import {
  SdkDocumentType,
  SdkScanMode,
  SdkTimeout,
  selphid,
  SelphidResult,
} from '@facephi/sdk-selphid-react-native';

const result: SelphidResult = await selphid({
  showResultAfterCapture: true,
  showTutorial: false,
  showDiagnostic: true,
  timeout: SdkTimeout.Medium,
  scanMode: SdkScanMode.Search,
  documentType: SdkDocumentType.IdCard,
});

if (result.finishStatus === SdkFinishStatus.Ok) {
  const front = result.frontDocumentImage;
  const back = result.backDocumentImage;
  const face = result.faceImage;
  const ocr = result.documentData ? JSON.parse(result.documentData) : null;
  const faceToken = result.tokenFaceImage;
}
```

`setSelphidFlow` registers the widget inside an orchestrated flow instead of opening it immediately.

## Orchestrated flow

`launchFlow` in `providers/core.tsx` initializes a named flow and then lets each widget contribute its step.

```ts
import { initFlow, startFlow } from '@facephi/sdk-core-react-native';
import { setSelphiFlow } from '@facephi/sdk-selphi-react-native';
import { setSelphidFlow } from '@facephi/sdk-selphid-react-native';

await initFlow({
  flow: 'FLOW_B',
  customerId: CUSTOMER_ID,
});

const selphiResult = await setSelphiFlow();
const selphidResult = await setSelphidFlow();

await startFlow();
```

## Extra data

After a successful Selphi capture, `callGetExtraData` sends the tracking blob together with the raw template. SelphID's face token is included when a document was captured.

```ts
const extra = await getExtraData();

if (extra.finishStatus === SdkFinishStatus.Ok && selphiResult) {
  const livenessBody = {
    extraData: extra.data,
    image: selphiResult.bestImageTemplateRaw,
  };

  const faceMatchBody = {
    documentTemplate: selphidResult?.tokenFaceImage,
    extraData: extra.data,
    image1: selphiResult.bestImageTemplateRaw,
  };
}
```

## Project map

| File | What it shows |
| --- | --- |
| `providers/core.tsx` | Session, operation, extra data, close session, flow |
| `providers/selphi.tsx` | Selphi configuration and result handling |
| `providers/selphid.tsx` | SelphID configuration and result handling |
| `App.tsx` | Buttons that call those providers |
| `constants.tsx` | License URL, API keys and customer id |
