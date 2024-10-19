import { getSession as mockGetSession } from "@auth0/nextjs-auth0";
import { render, screen } from "@testing-library/react";
import Page from "./page";

jest.mock("@auth0/nextjs-auth0", () => ({
  getSession: jest.fn(),
}));
jest.mock('@/components/ProfileMenu', () => ({
  __esModule: true,
  default: () => <div>ProfileMenu</div>,
}));
const getSession = mockGetSession as jest.Mock;

describe("HomePage", () => {
  describe("when not authenticated", () => {
    beforeEach(() => {
      getSession.mockResolvedValue(undefined);
    });

    it("renders the app name", async () => {
      render(await Page());

      expect(
        screen.getByRole("heading", { name: /my app/i, level: 1 })
      ).toBeInTheDocument();
    });

    it("renders the login link", async () => {
      render(await Page());
      expect(screen.getByRole("link", { name: /login/i })).toHaveAttribute('href', '/api/auth/login');
    });

    it("does not render the logout link", async () => {
      render(await Page());
      expect(
        screen.queryByText('ProfileMenu')
      ).not.toBeInTheDocument();
    });
  });

  describe('when authenticated', () => {
    beforeEach(() => {
      getSession.mockResolvedValue({
        user: {
          name: 'test user',
          email: 'mock@email.com',
        },
      });
    });

    it('renders the app name', async () => {
      render(await Page());
      expect(screen.getByRole('heading', { name: /my app/i, level: 1 })).toBeInTheDocument();
    });

    it('renders the logout link', async () => {
      render(await Page());
      expect(screen.getByText('ProfileMenu')).toBeInTheDocument();
    });

    it('does not render the login link', async () => {
      render(await Page());
      expect(screen.queryByRole('link', { name: /login/i })).not.toBeInTheDocument();
    });
  });
});
