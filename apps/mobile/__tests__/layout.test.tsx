import { render, screen } from "@testing-library/react-native";
import RootLayout from "../app/_layout";
import { useAuthStore } from "../src/store/authStore";
import { useOnboardingStore } from "../src/store/onboardingStore";

const mockReplace = jest.fn();
const mockInitialize = jest.fn(() => jest.fn());

// The real SafeAreaProvider only renders children once it receives insets
// from the native bridge, which never fires under Jest, so its subtree
// stays permanently empty — use the library's own jest mock instead.
jest.mock(
  "react-native-safe-area-context",
  () => jest.requireActual("react-native-safe-area-context/jest/mock").default,
);

jest.mock("expo-router", () => ({
  useRouter: () => ({ replace: mockReplace, push: jest.fn() }),
  useSegments: () => ["(tabs)"],
  Stack: () => null,
}));

jest.mock("expo-splash-screen", () => ({
  preventAutoHideAsync: jest.fn().mockResolvedValue(undefined),
  hideAsync: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("../src/lib/supabase", () => ({
  supabase: { auth: { getSession: jest.fn(), onAuthStateChange: jest.fn() } },
}));

jest.mock("@expo-google-fonts/schibsted-grotesk", () => ({
  useFonts: () => [true],
  SchibstedGrotesk_400Regular: {},
  SchibstedGrotesk_500Medium: {},
  SchibstedGrotesk_600SemiBold: {},
  SchibstedGrotesk_700Bold: {},
}));

describe("RootLayout", () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockInitialize.mockClear();
    useAuthStore.setState({
      isAuthenticated: false,
      isInitializing: true,
      user: null,
      initialize: mockInitialize,
    });
    useOnboardingStore.setState({ hasOnboarded: false });
  });

  it("shows the session-restoration loading state while initializing", async () => {
    await render(<RootLayout />);
    expect(screen.getByLabelText("Restoring your session")).toBeTruthy();
  });

  it("does not route anywhere while still initializing", async () => {
    await render(<RootLayout />);
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("hides the loading state and routes once initialization resolves", async () => {
    useAuthStore.setState({ isInitializing: false, isAuthenticated: false });
    await render(<RootLayout />);

    expect(screen.queryByLabelText("Restoring your session")).toBeNull();
    expect(mockReplace).toHaveBeenCalledWith("/(auth)/welcome");
  });
});
