# 🏋️‍♀️ Kyndra SDK Integration Guide

This guide explains how to integrate the **Kyndra SDK** to track user workouts using Flutter. You'll learn how to:

* Set up the Kyndra SDK.
* Track reps and errors.
* Subscribe to lifecycle events.
* Enable persistent wake-lock for sessions.
* Integrate the Kyndra AI-powered workout session view.

---

## 📦 1. Install Dependencies

In your `pubspec.yaml`, add:

```yaml
dependencies:
    kyndra:
        git:
            url: https://github.com/ZiCenter/kyndra-flutter.git
            ref: main
```

Then run:

```bash
flutter pub get
```

---

## 🧠 2. Core Concepts

### `WorkflowController`

This manages the workout session lifecycle and streams rep counts, errors, and lifecycle events.

### `WorkflowWidget`

Embeds the workout experience (typically rendered in a `WebView`). Supports **2-way communication** for controlling
workout sessions remotely.

---

## 🛠️ 3. Integration Steps

### ✅ Step 1: Initialize SDK

Inside your widget’s `initState`, subscribe to reps, errors, and lifecycle streams from the `WorkflowController`.

```dart
final WorkflowController controller = WorkflowController();

@override
void initState() {
  super.initState();

  controller.reps.listen(handleRep);
  controller.errors.listen(handleError);
  controller.lifecycle.listen(handleLifecycleEvent);
}
```

### ✅ Step 2: Embed Workout UI

Use the `WorkflowWidget` to display the workout session, typically embedded inside a `Stack` for flexibility.

```dart
WorkflowWidget(
  workflow: _workflowController,
  url: "https://kyndra-web.vercel.app/session/<session_id>", // Replace with your session URL
)
```

---

## 📴 3. Clean Up

Unsubscribe streams in `dispose()` and dispose controller:

```dart
@override
void dispose() {
  controller.dispose();
  super.dispose();
}
```

---

## 📱 5. Recommended UX Enhancements

* **Keep screen awake**: Use `wakelock_plus` to prevent screen from sleeping during workouts.

```dart
@override
void initState() {
  super.initState();
  WakelockPlus.enable();
}

@override
void dispose() {
  WakelockPlus.disable();
  super.dispose();
}
```

* **Orientation lock**: Force portrait mode for consistent tracking (optional).
* **Error UI**: Display friendly messages if errors occur in the workflow.

---

# 📚 Kyndra SDK Event Catalog

This document lists **all events** exposed by the Kyndra SDK in Flutter, along with their payload types and contextual
purpose.

---

## 1️⃣ `Stream<CycleDetected> reps`

> Fired **only** when a rep is successfully detected

### ✅ Payload: `CycleDetected`

| **Field**       | **Type**           | **Description**                               |
|-----------------|--------------------|-----------------------------------------------|
| `caloriesBurnt` | `double`           | Estimated calories burned in this rep         |
| `stateScores`   | `List<StateMatch>` | Per-state breakdown for detected movement     |
| `score`         | `double`           | Overall confidence score for the detected rep |

#### 🔹 `StateMatch` (inside `stateScores`)

| **Field** | **Type** | **Description**                 |
|-----------|----------|---------------------------------|
| `state`   | `String` | Name of matched pose or posture |
| `score`   | `double` | Matching accuracy score         |

---

## 2️⃣ `Stream<Response> errors`

> Fired when there is an `error` during workflow execution.

### ✅ Possible Payloads (all implement `Response`)

#### 🔸 `KeypointsOufOfFrame`

| **Field**   | **Type**             | **Description**                                  |
|-------------|----------------------|--------------------------------------------------|
| `keypoints` | `List<KeypointName>` | List of body parts currently out of camera frame |

#### 🔸 `AlignmentAdjustment`

| **Field** | **Type** | **Description**                          |
|-----------|----------|------------------------------------------|
| `angle`   | `double` | Suggested angle correction for user pose |

##### Additional Payload

- `KeypointName` (Enum) <br>
  Includes values like: `nose`, `left_eye`, `right_knee`, `left_shoulder`, `right_wrist`, `left_ankle`, etc.

---

## 3️⃣ `Stream<KMessage> lifecycle`

> Captures **all non-result events** from the session and WebView backend.

---

### 🔌 A. **Connection Events**

> Signal connectivity state between the WebView and the backend engine.

| **Event**    | **Payload** | **Description**                                  |
|--------------|-------------|--------------------------------------------------|
| `connected`  | `null`      | WebView connected to the Kyndra engine           |
| `disconnect` | `null`      | Disconnected due to session end or network issue |

---

### 🧩 B. **Workflow Events**

> Represent events **within an individual workout unit**. These repeat for each workflow in a session.

| **Event**              | **Payload**       | **Description**                            |
|------------------------|-------------------|--------------------------------------------|
| `exercise-initialized` | `null`            | Workflow tracking is initialized and ready |
| `exercise-started`     | `ExercisePayload` | Workout workflow has begun                 |
| `exercise-aligned`     | `null`            | User pose is properly aligned to start     |
| `exercise-paused`      | `null`            | Workflow has been paused by user command   |
| `exercise-resumed`     | `null`            | Workflow has been resumed from pause       |
| `exercise-completed`   | `SessionSummary`  | Exercise has finished with summary data    |
| `exercise-destroyed`   | `null`            | Workflow ended, aborted, or transitioned   |
| `result`               | `WorkflowResult`  | Real-time workout analysis results         |

---

### 🧱 C. **Session Events**

> Represent the **overall workout session**, which may contain multiple workflows.

| **Event**                     | **Payload**        | **Description**                                    |
|-------------------------------|--------------------|----------------------------------------------------|
| `session-loaded`              | `null`             | WebView session page is fully loaded               |
| `session-next`                | `ExercisePayload`  | Signals transition to the next workflow in session |
| `session-skipped-to-next`     | `null`             | User manually skipped to next exercise             |
| `session-skipped-to-previous` | `null`             | User manually went back to previous exercise       |
| `session-completed`           | `SessionCompleted` | Final session outcome (completed or aborted)       |

---

#### 📦 `ExercisePayload` Payload

> **Note**: Used for `exercise-started` and `session-next` events. The `exercise-completed` event now uses
`SessionSummary` instead.

| **Field**  | **Type**           | **Description**                    |
|------------|--------------------|------------------------------------|
| `id`       | `String`           | Identifier for the exercise        |
| `name`     | `String`           | Name of the exercise               |
| `type`     | `'reps' \| 'time'` | Exercise type (reps or time-based) |
| `target`   | `number`           | Target reps or duration            |
| `rest`     | `number`           | Rest time after exercise           |
| `videoUrl` | `String`           | URL for exercise demonstration     |

---

#### 📦 `SessionCompleted` Payload

| **Field** | **Type**                   | **Description**                     |
|-----------|----------------------------|-------------------------------------|
| `summary` | `List<SessionSummary>`     | Summary per workflow                |
| `status`  | `'completed' \| 'aborted'` | Indicates how the session concluded |

---

#### 🔸 `SessionSummary`

> **Important**: This payload is now used for both `exercise-completed` events and within `SessionCompleted` summaries,
> providing consistent summary data across the application.

| **Field**  | **Type**                                        | **Description**                   |
|------------|-------------------------------------------------|-----------------------------------|
| `id`       | `String`                                        | ID of the individual workflow     |
| `reps`     | `List<{ score: number, states: StateMatch[] }>` | Per-rep breakdown within workflow |
| `time`     | `int`                                           | Duration of workflow (ms or sec)  |
| `calories` | `double`                                        | Total calories burned             |
| `accuracy` | `double` (0.0 - 1.0)                            | Average pose detection accuracy   |

---

## 🧠 Event Flow Summary

| **Stream**  | **Payload Type**                             |
|-------------|----------------------------------------------|
| `reps`      | `CycleDetected`                              |
| `errors`    | `KeypointsOufOfFrame`, `AlignmentAdjustment` |
| `lifecycle` | `KMessage` with optional typed `data`        |

---

# 🌐 WebView Inbound Commands

The Kyndra WebView now supports **inbound commands** that can be sent from Flutter to control workout sessions remotely.

## 📤 Available Inbound Commands

| **Command**        | **Description**                                 |
|--------------------|-------------------------------------------------|
| `command-pause`    | Pause the current exercise workflow             |
| `command-resume`   | Resume the paused exercise workflow             |
| `command-next`     | Skip to the next exercise in the session        |
| `command-previous` | Go back to the previous exercise in the session |

## 🔧 Sending Commands from Flutter

Use the `WorkflowController.sendCommand()` method to send these commands to the WebView:

```dart
// Send inbound commands to control the WebView
controller.sendCommand('command-pause');
```

These commands will trigger the corresponding actions in the WebView and generate appropriate response events in the
lifecycle stream.