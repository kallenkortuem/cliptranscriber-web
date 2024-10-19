import { useUser as mockUseUser } from "@auth0/nextjs-auth0/client";
import { fireEvent, render, screen } from "@testing-library/react";
import ProfileMenu from "../ProfileMenu";

jest.mock("@auth0/nextjs-auth0/client", () => {
  return {
    useUser: jest.fn(),
  };
});

const useUser = mockUseUser as jest.Mock;

describe("ProfileMenu", () => {
  describe("when authenticated", () => {
    beforeEach(() => {
      useUser.mockReturnValue({ user: { name: "test user" } });
    });

    it("renders without crashing", () => {
      render(<ProfileMenu />);

      expect(
        screen.getByRole("button", { name: "Profile Menu" })
      ).toBeInTheDocument();
    });

    it('should open the menu when the button is clicked', async () => {
      render(<ProfileMenu />);
      const button = screen.getByRole('button', { name: 'Profile Menu' });
      fireEvent.pointerDown(button);
      expect(screen.getByRole('menu')).toBeInTheDocument();
      expect(screen.getByRole('menuitem', { name: 'Profile' })).toHaveAttribute('href', '/profile');
      expect(screen.getByRole('menuitem', { name: 'Settings' })).toHaveAttribute('href', '/settings');
      expect(screen.getByRole('menuitem', { name: 'Logout' })).toHaveAttribute('href', '/api/auth/logout');
    });
  });
});
