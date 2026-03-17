import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="fixed top-0 left-0 w-full z-50">
      <div className="w-full px-10 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="text-xl font-semibold text-foreground tracking-wide">Beepitt</div>

        {/* Links */}
        <div className="flex items-center gap-8 text-sm text-foreground/80">
          <a href="#" className="hover:text-foreground transition">
            Docs
          </a>
          <a href="#" className="hover:text-foreground transition">
            Pricing
          </a>
          <a href="#" className="hover:text-foreground transition">
            Dashboard
          </a>

          {/* CTA */}
          <Button
            variant={'default'}
            className="ml-4 px-5 py-2 rounded-xl text-background
            font-medium hover:opacity-90 transition"
            onClick={() => {
              navigate('/auth');
            }}
          >
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
