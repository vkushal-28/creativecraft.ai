// WriteArticle.test.jsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WriteArticle from "../pages/WriteArticle";
import api from "../utils/axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { vi } from "vitest";

// Mock axios
vi.mock("../utils/axios");
// Mock Clerk auth
vi.mock("@clerk/clerk-react", () => ({
  useAuth: vi.fn(),
}));
// Mock toast

vi.mock("react-hot-toast", () => ({
  default: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe("WriteArticle Page", () => {
  const mockGetToken = vi.fn();

  beforeEach(() => {
    useAuth.mockReturnValue({
      getToken: mockGetToken,
    });
    vi.clearAllMocks();
  });

  test("renders form and selects article length", async () => {
    render(<WriteArticle />);

    // Check textarea exists
    const textarea = screen.getByPlaceholderText(
      /The future of artifiaial intelligence is/i
    );
    expect(textarea).toBeInTheDocument();

    // Type in textarea
    await userEvent.type(textarea, "AI in healthcare");
    expect(textarea).toHaveValue("AI in healthcare");

    // Check default selected length
    const defaultLength = screen.getByText(/800-1000/i);
    expect(defaultLength).toHaveClass("bg-blue-50 text-indigo-600");

    // Click another length
    const newLength = screen.getByText(/1200-1500/i);
    await userEvent.click(newLength);
    expect(newLength).toHaveClass("bg-blue-50 text-indigo-600");
  });

  test("submits form and displays generated content", async () => {
    render(<WriteArticle />);

    const textarea = screen.getByPlaceholderText(/future/i);
    await userEvent.type(textarea, "AI testing");

    mockGetToken.mockResolvedValue("fake-token");

    // ⛔ create manual promise control
    let resolveRequest;
    const requestPromise = new Promise((resolve) => {
      resolveRequest = resolve;
    });

    api.post.mockReturnValue(requestPromise);

    const submitButton = screen.getByRole("button", {
      name: /generate article/i,
    });

    await userEvent.click(submitButton);

    // 🔴 NOW loading MUST appear
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });

    // ✅ finish API call
    resolveRequest({
      data: { success: true, content: "Generated article content" },
    });

    // wait for UI update
    expect(
      await screen.findByText("Generated article content")
    ).toBeInTheDocument();

    // button enabled again
    expect(submitButton).not.toBeDisabled();
  });

  test("shows toast error if API fails", async () => {
    render(<WriteArticle />);

    const textarea = screen.getByPlaceholderText(
      /The future of artifiaial intelligence is/i
    );
    await userEvent.type(textarea, "AI in healthcare");

    mockGetToken.mockResolvedValue("fake-token");
    api.post.mockRejectedValue(new Error("API failed"));

    const submitButton = screen.getByRole("button", {
      name: /generate article/i,
    });
    await userEvent.click(submitButton);

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("API failed"));
  });

  test("shows toast error if API returns success: false", async () => {
    render(<WriteArticle />);

    const textarea = screen.getByPlaceholderText(
      /The future of artifiaial intelligence is/i
    );
    await userEvent.type(textarea, "AI in healthcare");

    mockGetToken.mockResolvedValue("fake-token");
    api.post.mockResolvedValue({
      data: { success: false, message: "Something went wrong" },
    });

    const submitButton = screen.getByRole("button", {
      name: /generate article/i,
    });
    await userEvent.click(submitButton);

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Something went wrong")
    );
  });
});
