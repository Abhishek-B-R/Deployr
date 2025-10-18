import { render, screen } from "@testing-library/react"
import Hero from "@/components/Landing/Hero"

// Smoke test for landing hero render path
describe("Landing Hero", () => {
  it("renders heading and primary CTA", () => {
    render(<Hero isVisible={true} />)

    expect(screen.getByText(/Deploy your frontend/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Start quest/i })).toBeInTheDocument()
  })
})
