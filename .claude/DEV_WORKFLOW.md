# NegoSure — Mobile Dev Workflow Gotchas

## EAS development client (replaces the Expo Go SDK-pinning constraint)

The project is registered as `@argylle/negosure` on EAS (`apps/mobile/app.json`'s `extra.eas.projectId`, `apps/mobile/eas.json`). A development build (`eas build --profile development --platform android`) produces an installable APK with `expo-dev-client` baked in — once installed on a device, `expo start` connects to that client instead of the public Expo Go app, and the app's SDK version is no longer constrained by whatever SDK Expo Go's app-store build currently supports.

`android.package` / `ios.bundleIdentifier` are set to `com.argylle.negosure` — required by EAS for non-interactive builds; change together if ever renamed, they must stay in sync with what's registered on EAS.

To rebuild after a native dependency changes: `cd apps/mobile && npx eas-cli build --profile development --platform android --non-interactive`.

Real, repeatedly-hit issues running this project on Windows with Expo Go. Read this before spending time re-debugging the dev server — most of what looks like a new bug here already has a known cause.

## Starting the dev server

```
cd apps/mobile
npm run start        # expo start --offline (default — see "getNativeModuleVersionsAsync crash" below)
npm run start:clean  # same, plus --clear (wipes Metro cache — use after dependency changes)
```

`--offline` is the default in every script (`start`/`android`/`ios`/`web`). Only use `start:online` if you specifically need Expo's online dependency-version check.

## SDK version is pinned to 54, not "latest"

`expo`/`react-native`/etc. are pinned to SDK 54 (`apps/mobile/package.json`), not the current stable SDK. This is deliberate: **Expo Go's app-store build only supports one SDK version at a time**, and it tracks the SDK number in its own version string (e.g. Expo Go `54.0.8` → supports SDK 54 only). If Expo Go says "project requires a newer version of Expo Go" or vice versa, check `npm view expo dist-tags` for what's current, and re-pin with `npx expo install expo@<version>` followed by `npx expo install --fix` — never bump SDK version without confirming Expo Go on the actual test device supports it first.

This constraint goes away entirely with an EAS development client (a custom-built dev client, not the public Expo Go app) — ask before setting that up, since it needs an Expo account.

## Test files must never live under `app/`

Expo Router treats **every** file under `app/` as a route by default — including `*.test.tsx`. A `.test.tsx` file there gets bundled into the real app, pulling `@testing-library/react-native` (a devDependency that uses Node built-ins like `console` Metro can't resolve) into the client bundle, which crashes on-device with `UnableToResolveError`.

**Screen tests live in `apps/mobile/__tests__/`, mirroring `app/`'s structure** (e.g. `__tests__/auth/sign-in.test.tsx` imports from `../../app/(auth)/sign-in`). Component/store/lib tests can stay colocated under `src/` since Expo Router never scans that directory.

## Cold starts are slow — don't assume failure too early

After `--clear` or a dependency change, Metro rebuilds its cache from scratch, which can take 30–90+ seconds on Windows, especially with the monorepo's `node_modules` size. The CLI prints `Waiting on http://localhost:<port>` before the HTTP server may actually be ready to accept connections in some cases. If a connection check fails right after that line appears, wait and retry rather than restarting — a restart just resets the cold-start clock. Verify the port is genuinely listening with `netstat -ano | findstr :<port>` (look for `LISTENING`) if `curl`/`Invoke-WebRequest` checks are inconclusive.

## Killing a stuck server on Windows

`Ctrl+C` (or this session's task-stop equivalent) doesn't always kill the whole process tree — Metro/jest-worker child processes can linger and hold the port or contend for resources. Before restarting:

```powershell
Get-CimInstance Win32_Process -Filter "Name = 'node.exe'" | Select-Object ProcessId, CommandLine
# then Stop-Process -Id <id> -Force for anything expo/metro/jest-worker related
```

## A known, unrelated Expo CLI bug

`expo start` without `--offline` can crash outright on startup with `TypeError: Body is unusable: Body has already been read`, thrown from `getNativeModuleVersionsAsync`'s online dependency-version check (an `@expo/cli` bug, not anything in this project). `--offline` skips that check entirely — this is the main reason it's the default in every script above.

## Metro config on this Node/Windows combo

Do **not** add a custom `metro.config.js` (or `.cjs`) casually — on Node 24 + Windows, Metro's config loader has a bug (`ERR_UNSUPPORTED_ESM_URL_SCHEME`, "absolute paths must be valid file:// URLs") that crashes `expo start` outright when a project-level Metro config file exists at all, regardless of its contents or extension. If a Metro config is ever genuinely needed, expect to hit this and budget time to work around it (e.g. restructuring rather than patching Metro itself).
