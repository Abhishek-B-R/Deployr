import "@testing-library/jest-dom/vitest"
import { vi } from "vitest"

// Polyfill for Next.js app router components that may access `next/navigation` during tests
vi.mock("next/navigation", () => {
  return {
    useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  }
})

// Stub heavy 3D components for JSDOM
vi.mock("@react-three/fiber", () => {
  return {
    Canvas: () => null,
    useFrame: () => undefined,
  }
})

vi.mock("@react-three/drei", () => {
  return {
    Float: ({ children }: any) => children,
    Stars: () => null,
    PerspectiveCamera: () => null,
  }
})
