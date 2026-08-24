---
sidebar_position: 3
---

# Usage

To use **beepitt-client** in your application, call the **`beepitt`** function inside a `catch` block whenever an error occurs.

```ts
const func = async() => {
  try {
    //your code
  } catch (error) {
    await beepitt({
      err: error,
      filePath: __filename,
      incidentName: "Custom incident name",
      incidentDesc: "Custom incident description",
    });
  }
};
```
## Parameters

| Parameter      | Type     | Required | Description |
|---------------|----------|----------|-------------|
| `err`         | `Error`  | Yes      | The error object caught in the `catch` block. |
| `filePath`    | `string` | Yes      | The file path where the error occurred (for example, `__filename`). |
| `incidentName`| `string` | No      | A short, custom name used to identify the incident, if not provided, it will be taken from error object. |
| `incidentDesc`| `string` | No      | A detailed description providing context about the error, if not provided, it will be taken from error object. |
