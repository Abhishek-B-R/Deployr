import { render, screen, fireEvent } from "@testing-library/react"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import NavBar from "@/components/NavBar"

describe("Toggles and a11y", () => {
  it("toggles theme and updates aria-pressed", async () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="light">
        <ThemeToggle />
      </ThemeProvider>
    )

    const btn = await screen.findByRole("button", { name: /toggle theme/i })
    expect(btn).toHaveAttribute("aria-pressed", "false")
    fireEvent.click(btn)
    expect(btn).toHaveAttribute("aria-pressed", "true")
  })

  it("opens mobile navigation menu", () => {
    render(<NavBar />)
    const toggle = screen.getByRole("button", { name: /open navigation menu/i })
    fireEvent.click(toggle)
    expect(screen.getByText(/Mission Control/i)).toBeInTheDocument()
  })
})
