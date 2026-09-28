# TECHNICAL VERIFICATION — KnockUI

Date: 2026-09-28

## Purpose

This audit separates product intent from platform feasibility. Each verified cell may contain a `verification` object with:
- `state`;
- `date`;
- `confidence`;
- `summary`;
- `sources`;
- `next_step`.

Verification states:
- `verified-supported` — platform capability is directly supported;
- `verified-constrained` — supported, but with material platform constraints;
- `blocked-as-specified` — the current product formulation conflicts with documented platform/API rules;
- `requires-prototype` — documentation does not settle product performance/UX; empirical prototype required;
- `non-technical` — question belongs to market/legal/business research, not technical platform verification.

## Critical findings

### Android — global Quad Tap is the main blocker

Android API 34 AccessibilityService.onMotionEvent can observe selected generic MotionEvent sources, but the official API states that MotionEvents from those requested sources are not sent to the rest of the system. TouchInteractionController requires touch-exploration mode; that mode changes touch semantics and controls/delegates the input pipeline.

Therefore the original requirement — passively detect four taps anywhere over other apps while preserving ordinary touch behavior — is not supported by the cited public AccessibilityService paths as specified.

Result:
- new cell `android-global-trigger-limitation`;
- direct `android-integration → android-quad-tap` flow removed;
- blocker represented explicitly as constraint relations;
- Android activation must be redesigned before MVP implementation.

### Android — overlay is real, but it does not solve activation

`TYPE_APPLICATION_OVERLAY` is supported with `SYSTEM_ALERT_WINDOW` and explicit user approval through overlay settings. A non-touchable overlay cannot receive touch itself. A localized touchable canvas is therefore viable after activation, but it does not create a passive global trigger.

### Android — active/empty-zone test cannot be universal

AccessibilityNodeInfo supplies bounds/clickable semantics when apps expose them, but the accessibility tree need not map one-to-one to rendered UI and custom views must provide their own accessibility semantics. Therefore «this screen coordinate is definitely inactive» can only be heuristic across arbitrary third-party apps.

### Android — app/deep-link actions are viable with constraints

Android deep links/intents are supported. Background activity starts are restricted; current Android documentation lists user-granted `SYSTEM_ALERT_WINDOW` among exceptions. Final behavior still requires target-SDK/device testing and resolver handling.

### Android — Google Play compliance

AccessibilityService is not categorically reserved for disability apps, but only disability-primary products may claim `isAccessibilityTool=true`. Other uses require Play declaration plus prominent disclosure and affirmative consent. There is no automatic «Productivity certification» that exempts the product from policy review.

Installed-app discovery is also sensitive: broad `QUERY_ALL_PACKAGES` visibility is restricted and must be justified as core functionality; targeted visibility is preferred.

### Android — recognizer and battery target

The $1 Recognizer is a legitimate MVP candidate for unistroke prototyping, but its published results do not validate KnockUI's 36-symbol finger-input alphabet. A dedicated confusion-matrix benchmark is required.

The '<1% battery/hour' number is an engineering target. It requires a defined workload and physical-device measurements using current Android profiling methods.

## iOS — keyboard is possible; Android-style launcher behavior is not

Apple documents Custom Keyboard Extensions, but they are not available everywhere:
- secure text fields use the system keyboard;
- phonePad/namePhonePad use the system keyboard;
- host apps may disable third-party keyboards.

More critically, App Review Guideline 4.4.1 states that keyboard extensions must not launch other apps besides Settings. Therefore an iOS keyboard can be a KnockUI input surface, but it cannot simply copy Android's «XY → launch arbitrary app/deep link» action model.

The iOS action/dispatch branch must be redesigned around keyboard-native output, shared state/containing-app workflows, or another iOS-native entry/execution mechanism.

## WeChat — contained implementation is feasible

Tencent/WeChat ecosystem documentation confirms touch-event handling inside Mini Programs and supports contained gesture recognition. Navigation and web-view actions are platform controlled; cross-Mini-Program navigation requires user interaction/confirmation in the referenced Tencent documentation, and web-view has business-domain/account restrictions.

Confidence is marked medium where this audit could not directly retrieve the canonical developers.weixin.qq.com page. Final implementation should be checked in current WeChat DevTools and official Mini Program documentation.

## WhatsApp — chat transport is technically valid

Meta's official WhatsApp Business Platform collections confirm:
- Cloud API as the official business messaging API;
- inbound text messages delivered through webhook payloads;
- webhook-driven backend integration;
- structured WhatsApp Flows.

Thus the WhatsApp branch works as a command/response transport, not as an operating-system launcher.

## Non-technical items

The India channel thesis, China acquisition channels, and Android/iOS market/ARPU ratios are not technical platform questions. They remain separate market/legal verification work.

## Architecture consequence

KnockUI should now be read as:
- one shared command language / registry model;
- multiple platform-specific entry and execution models;
- Android global passive Quad Tap and iOS arbitrary app launch are not currently feasible as originally specified.

The next engineering decision is the replacement Android activation mechanism; that decision affects the MVP more than any other verified issue.
