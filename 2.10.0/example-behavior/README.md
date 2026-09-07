# Mobile 360 – Behavior Widget (React Native Sample)

This is a **React Native** sample app that demonstrates how to integrate the **Facephi Widget Behavior** ([`@fip360/widget-behavior-react-native`](../../widget-behavior-react-native)) into a mobile app. The Behavior widget performs continuous, passive **behavioral biometrics and fraud detection** in the background — analyzing how the user touches, types, moves and navigates the app — without adding any extra step to the UX.

## Contents

- [What the plugin does](#what-the-plugin-does)
- [What the sample demonstrates](#what-the-sample-demonstrates)
- [Project structure](#project-structure)
- [Requirements](#requirements)
- [Installation](#installation)
  - [Android](#android)
  - [iOS](#ios)
- [Configuration](#configuration)
  - [License keys](#license-keys)
  - [Platform permissions](#platform-permissions)
- [Running the sample](#running-the-sample)
- [How the sample uses the SDK](#how-the-sample-uses-the-sdk)
  - [App flow](#app-flow)
  - [Backend session bootstrap](#backend-session-bootstrap)
- [API reference](#api-reference)
  - [`initialize(config)`](#initializeconfig)
  - [`setUserId(value)`](#setuseridvalue)
  - [`setSessionId(value)`](#setsessionidvalue)
  - [`setPosition(value)`](#setpositionvalue)
  - [`setAutoLogoutAction()`](#setautologoutaction)
  - [`clearSessionData()`](#clearsessiondata)
  - [`destroy()`](#destroy)
  - [`recordTouchEvent()`](#recordtouchevent)
  - [`handleTypingEvent(fieldType, onChangeText?)`](#handletypingeventfieldtype-onchangetext)
  - [Native events](#native-events)
- [Result and type reference](#result-and-type-reference)
- [Troubleshooting](#troubleshooting)

## What the plugin does

The Behavior widget is a native SDK (iOS + Android) wrapped for React Native that:

- **Initializes** with a license key and starts collecting behavioral signals (touch dynamics, typing patterns, device motion/network/location signals) for fraud analysis.
- Ties collected signals to a **user** (`setUserId`), a **backend session** (`setSessionId`) and a **screen/position** (`setPosition`) so the analysis can be correlated server-side.
- Lets the host app **feed it UI events explicitly**: raw touches via `recordTouchEvent()` and keystroke/paste/copy events on text fields via `handleTypingEvent()`.
- Can trigger an **auto-logout** decision (`setAutoLogoutAction`) which is reported back to JS as a native event, letting the app react (e.g. force logout) when the SDK detects anomalous behavior.
- Exposes `clearSessionData()` / `destroy()` to reset or tear down the widget (logout, screen unmount, etc).

Every call resolves a `BehaviorResult` promise so the app can branch on success/error without native exceptions.

## What the sample demonstrates

This app is a minimal "demo bank" shell (Login → Home → Dashboard) that exercises the whole SDK lifecycle:

- **Initialize** the widget on app start with a license key ([`App.tsx`](App.tsx)).
- **Bootstrap a session id** from a demo backend, or fall back to a locally generated UUID ([`apiRest.tsx`](apiRest.tsx)).
- **Track user identity** and **screen/position** as the user navigates between Login, Home and Dashboard.
- **Register an auto-logout listener** and log every event the native SDK emits.
- **Monitor a text field** (the login "User" input) with `handleTypingEvent`, reporting keystrokes/paste to the SDK while still driving local React state.
- **Surface SDK errors** inline in the UI via a shared `SdkWarning` banner.
- Provide a **light/dark theme switch** through the top-bar action sheet, unrelated to the SDK but useful to see the widget alongside a themed UI.

## Project structure

```
App.tsx                        # App shell: init, navigation state, event listener, theming
apiRest.tsx                    # Demo backend call to obtain a sessionId (+ UUID fallback)
constants.tsx                  # License keys and demo user id
styles.ts                      # Shared styles/colors (light/dark aware)
providers/
  behavior.tsx                 # Thin wrappers around the SDK calls used by the screens
screens/
  LoginScreen.tsx               # Initialize / Login / Clear Session actions + monitored input
  HomeScreen.tsx                # Navigation to Dashboard / Logout
  DashboardScreen.tsx           # setPosition('Dashboard') target screen
components/commons/
  SdkTopBar.tsx                 # Top bar with the settings action sheet trigger
  CustomActionSheet.tsx         # Bottom sheet (e.g. theme toggle)
  SdkWarning.tsx                 # Inline error/status banner
  SdkButton.tsx                  # Shared button
```

## Requirements

- Node **>= 22.11**
- React Native **0.85** toolchain (Xcode, Android Studio / SDK set up per the [environment guide](https://reactnative.dev/docs/set-up-your-environment))
- iOS **10.0+**, CocoaPods
- Android `minSdkVersion` **24**, `compileSdkVersion`/`targetSdkVersion` **36** (see [`android/build.gradle`](android/build.gradle))
- A valid **Behavior license key** per platform (see [License keys](#license-keys))

## Installation

```sh
npm install
# or
yarn
```

The widget is consumed as a local dependency (`@fip360/widget-behavior-react-native` → `../../widget-behavior-react-native`), so it must exist as a sibling package before installing.

### Android

Nothing else is required beyond a normal Gradle sync — React Native autolinking wires up the native module. Permissions still need to be declared, see [Platform permissions](#platform-permissions).

### iOS

```sh
bundle install          # first time only
cd ios && bundle exec pod install
```

Re-run `pod install` any time the widget or its native dependencies change.

## Configuration

### License keys

The widget requires a **license key per platform**, set in [`constants.tsx`](constants.tsx) and consumed by [`providers/behavior.tsx`](providers/behavior.tsx):

```ts
export const USER_ID                = "reactnative@facephi.com";
export const LICENSE_APIKEY_ANDROID = "<your-android-license-key>";
export const LICENSE_APIKEY_IOS     = "<your-ios-license-key>";
```

Replace both keys with the ones issued for your app/bundle id before shipping. The sample selects the right key at runtime with `Platform.OS`.

### Platform permissions

The Behavior SDK needs **network, location and device-signal** permissions to perform its analysis. Missing them can make `initialize` fail at runtime, or cause the SDK to run with reduced detection quality.

**Android** — declared in [`android/app/src/main/AndroidManifest.xml`](android/app/src/main/AndroidManifest.xml):

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
<uses-permission android:name="android.permission.QUERY_ALL_PACKAGES" />
<uses-permission android:name="android.permission.CHANGE_WIFI_STATE" />
<uses-permission android:name="android.permission.READ_PHONE_STATE" />
<uses-permission android:name="android.permission.BLUETOOTH_SCAN" />
<uses-permission android:name="android.permission.DETECT_SCREEN_RECORDING" />
```

`ACCESS_FINE_LOCATION` and `QUERY_ALL_PACKAGES` are the most sensitive to justify with Google Play — omitting them is possible but reduces fraud-detection quality. On Android 6+ (API 23+), runtime permissions (location, phone state) must still be requested from the user before/around `initialize`, the manifest entry alone is not enough.

**iOS** — declared in [`ios/Example/Info.plist`](ios/Example/Info.plist):

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>Behavior analysis and fraud prevention while you use the app</string>
```

Fill in a real usage description (the sample ships an empty string) — App Store review requires it. Add `NSLocationAlwaysAndWhenInUseUsageDescription` too if your flow needs always-on location.

## Running the sample

```sh
# start Metro
npm start

# in another terminal
npm run android
# or
npm run ios
```

## How the sample uses the SDK

### App flow

1. **App start** ([`App.tsx`](App.tsx)) — on mount, `launchInitialize` calls `initialize({ licenseKey, enableSupportLogs })`. On success it immediately fetches/generates a session id and calls `setSessionId`, then `setAutoLogoutAction`. A `NativeEventEmitter` listener for `behavior.events.listener` is registered to log every event the SDK emits (e.g. an auto-logout trigger).
2. **Login screen** ([`screens/LoginScreen.tsx`](screens/LoginScreen.tsx)) — the "User" `TextInput` is wired to `handleTypingEvent('user', setUser)`, so every keystroke/paste is reported to the SDK while `setUser` keeps driving the local input value. Submitting calls `onLogin(user)`.
3. **On login** ([`App.tsx`](App.tsx) `handleLogin`) — the app calls `setUserId(user)` and `setPosition('Home')`, then shows the Home screen.
4. **Navigating** to Dashboard/Home/Logout calls `setPosition('Dashboard' | 'Home' | 'Login')` respectively, so the SDK always knows which screen the signals came from.
5. **Clear Session** (Login screen button) calls `clearSessionData()` and resets the local session state, letting the user re-initialize.

### Backend session bootstrap

[`apiRest.tsx`](apiRest.tsx) calls a demo backend (`POST https://demobank.fip360.com/api/init`) to obtain a `sessionId`. If the call fails or returns nothing, [`providers/behavior.tsx`](providers/behavior.tsx) (`launchSetSessionId`) falls back to a locally generated UUID (`getUUID()`), so `setSessionId` always receives a value. In a real integration, replace this with your own backend session-bootstrap call.

## API reference

All calls below are exported by `@fip360/widget-behavior-react-native` and wrapped in this sample by [`providers/behavior.tsx`](providers/behavior.tsx) (`launch*` helpers that also drive the UI error banner).

### `initialize(config)`

```ts
initialize(config: BehaviorConfiguration): Promise<BehaviorResult>
```

Starts the widget. Must be called before any other SDK method.

| Param | Type | Description |
|---|---|---|
| `config.licenseKey` | `string` | Platform-specific license key |
| `config.enableSupportLogs` | `boolean` | Verbose native logs for support/debugging |

### `setUserId(value)`

```ts
setUserId(value: string): Promise<BehaviorResult>
```

Associates the collected behavioral signals with a user identifier. Call after `initialize`, typically right after login.

### `setSessionId(value)`

```ts
setSessionId(value: string): Promise<BehaviorResult>
```

Associates the signals with a backend session id (ideally the same id used by your backend session/transaction). See [Backend session bootstrap](#backend-session-bootstrap).

### `setPosition(value)`

```ts
setPosition(value: string): Promise<BehaviorResult>
```

Tags subsequent signals with a free-form screen/position label (e.g. `'Login'`, `'Home'`, `'Dashboard'`). Call it on every screen change.

### `setAutoLogoutAction()`

```ts
setAutoLogoutAction(): Promise<BehaviorResult>
```

Arms the SDK's auto-logout decision. When triggered, the native side emits a `behavior.events.listener` event (see [Native events](#native-events)) — **subscribe to that event before or right after calling this**, otherwise the notification is missed.

### `clearSessionData()`

```ts
clearSessionData(): Promise<BehaviorResult>
```

Clears the current user/session data (e.g. on logout), without destroying the widget instance.

### `destroy()`

```ts
destroy(): Promise<BehaviorResult>
```

Releases native resources. Call when the widget is no longer needed (e.g. app teardown). Not currently called by this sample, since the widget stays active for the whole app lifetime.

### `recordTouchEvent()`

```ts
recordTouchEvent(): RecordTouchEventHandlers
```

Returns `onTouchStart` / `onTouchEnd` / `onTouchCancel` / `onTouchMove` handlers to spread onto a root `View` (there's no `document.body` in React Native):

```tsx
<View style={{ flex: 1 }} {...recordTouchEvent()}>
  {children}
</View>
```

Each touch is forwarded to native as `TouchEventData` (`{ x, y, pressure, type, time }`). This sample does not wire it up on a root view yet — add it if you need raw gesture capture beyond text-field typing.

### `handleTypingEvent(fieldType, onChangeText?)`

```ts
handleTypingEvent(fieldType: string, onChangeText?: (value: string) => void): RegisterFieldResult
```

Monitors a `TextInput`: reports keystrokes, paste and (via `reportCopy`) copy events to native while still updating local state through `onChangeText`.

| Param | Type | Description |
|---|---|---|
| `fieldType` | `string` | Logical field name reported to the SDK (e.g. `'user'`, `'email'`) |
| `onChangeText` | `(value: string) => void` (optional) | Your own state setter; called after the SDK is notified |

Returns:

```ts
type RegisterFieldResult = {
  textInputProps: {
    onChangeText: (value: string) => void;
    onSelectionChange: (event) => void;
  };
  reportCopy: (value: string) => void; // RN has no `copy` event on TextInput — call manually if you detect one
};
```

Used in this sample on the Login screen's "User" field:

```tsx
const userField = useMemo(() => handleTypingEvent('user', setUser), []);
<TextInput value={user} {...userField.textInputProps} />
```

### Native events

Subscribe via `NativeEventEmitter` to receive SDK-driven notifications (currently used for the auto-logout decision armed by `setAutoLogoutAction`):

```ts
const eventsEmitter = new NativeEventEmitter(NativeModules.WgtBehavior);
const eventsListener = eventsEmitter.addListener(
  'behavior.events.listener',
  (res: BehaviorResult) => console.log('WGT_BEHAVIOR_EVENTS', res)
);
// ...
eventsListener.remove();
```

The sample registers this listener once in [`App.tsx`](App.tsx) and only logs the payload — in a real app, branch on `res.finishStatus` to force a logout or show a warning.

## Result and type reference

### `BehaviorResult`

Every SDK call (except `recordTouchEvent`/`handleTypingEvent`, which are synchronous helpers) resolves this object:

| Field | Type | Description |
|---|---|---|
| `finishStatus` | `WgtFinishStatus` | `Ok` (`1`) or `Error` (`2`) — the overall outcome of the call |
| `finishStatusDescription` | `string?` | Human-readable description of `finishStatus` |
| `errorType` | `string` | Error code (e.g. `NO_ERROR`, or a specific error identifier) |
| `errorMessage` | `string?` | Extra error detail, shown in this sample's `SdkWarning` banner |
| `data` | `any?` | Optional payload, call-dependent |

This sample's pattern for every call ([`providers/behavior.tsx`](providers/behavior.tsx)):

```ts
switch (result.finishStatus) {
  case WgtFinishStatus.Ok:
    setShowError(false);
    break;
  case WgtFinishStatus.Error:
    setMessage(result.errorMessage || 'Unknown error');
    setTextColorMessage('red');
    break;
}
```

### `BehaviorConfiguration`

| Field | Type | Description |
|---|---|---|
| `licenseKey` | `string` | License key for the current platform |
| `enableSupportLogs` | `boolean` | Enables verbose native SDK logs |

### `WgtFinishStatus`

| Value | Meaning |
|---|---|
| `Ok = 1` | Call succeeded |
| `Error = 2` | Call failed — inspect `errorType` / `errorMessage` |

### Other types

| Type | Used by | Shape |
|---|---|---|
| `TouchEventData` | `recordTouchEvent` | `{ x, y, pressure, type, time }` |
| `TypingEventData` | `handleTypingEvent` | `{ id, v, f, t, p?, c? }` (`id`: `0` input, `1` paste, `2` copy) |
| `RecordTouchEventHandlers` | `recordTouchEvent` | `{ onTouchStart, onTouchEnd, onTouchCancel, onTouchMove }` |
| `RegisterFieldResult` | `handleTypingEvent` | `{ textInputProps, reportCopy }` |

## Troubleshooting

**"The package 'widget-behavior-react-native' doesn't seem to be linked"**

1. iOS: run `pod install` under `ios/` and do a clean build.
2. Rebuild the app after installing/updating the widget (JS-only reload isn't enough for native module changes).
3. Expo managed workflow isn't supported — this sample assumes a bare/autolinked RN project.

**`initialize` fails or the SDK reports reduced detection quality**

Double-check the [platform permissions](#platform-permissions) are declared and, on Android 6+, actually granted at runtime.

**No auto-logout events are received**

Make sure the `behavior.events.listener` listener (see [Native events](#native-events)) is registered before or immediately after `setAutoLogoutAction()`, and not removed prematurely.

---

For the full API surface of the underlying package (installation as a standalone dependency, package-level development scripts, etc.), see the [widget-behavior-react-native README](../../widget-behavior-react-native/README.md).
