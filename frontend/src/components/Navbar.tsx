import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrentUserSession } from "@/hooks/user.hooks";
import { authenticateUser, signOutUser } from "@/utils/UserSession";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const userSession = useCurrentUserSession();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-background border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-28">
          <div className="flex items-center flex-shrink-0">
            <img
              src="https://icon-graphica.com/wp-content/uploads/crystal_ball01.png"
              alt="Yosoku Logo"
              className="h-8 w-8 mr-2"
            />

            <a href="/" className="text-2xl font-bold text-primary">
              Yosoku.app
            </a>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavButton>
                <a href="/">Home</a>
              </NavButton>
              {!userSession.isUserSignedIn() && (
                <NavButton>
                  <button type="button" onClick={authenticateUser}>
                    Connect Wallet
                  </button>
                </NavButton>
              )}
              {userSession.isUserSignedIn() && (
                <NavButton>
                  <button type="button" onClick={signOutUser}>
                    Disconnect Wallet
                  </button>
                </NavButton>
              )}
            </div>
          </div>
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <NavButton mobile>
            <a href="/">Home</a>
          </NavButton>
          {!userSession.isUserSignedIn() && (
            <NavButton mobile>
              <button type="button" onClick={authenticateUser}>
                Connect Wallet
              </button>
            </NavButton>
          )}
          {userSession.isUserSignedIn() && (
            <NavButton mobile>
              <button type="button" onClick={signOutUser}>
                Disconnect Wallet
              </button>
            </NavButton>
          )}
        </div>
      </div>
    </nav>
  );
}

const NavButton = ({
  children,
  mobile = false,
}: {
  children: React.ReactNode;
  mobile?: boolean;
}) => {
  return (
    <Button
      variant="ghost"
      asChild
      className={`${
        mobile ? "w-full justify-center" : ""
      } text-secondary-foreground hover:text-primary hover:bg-accent transition-colors duration-200`}
    >
      {children}
    </Button>
  );
};
