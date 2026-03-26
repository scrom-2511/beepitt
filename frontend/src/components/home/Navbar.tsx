import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';

const navItems = [
  { title: 'Docs', url: '/docs' },
  { title: 'Pricing', url: '/pricing' },
  { title: 'Dashboard', url: '/dashboard/unseen-incidents' },
];

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-background/0 backdrop-blur-md border-b">
      <div className="w-full px-10 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-semibold text-foreground tracking-wide">
          Beepitt
        </Link>

        {/* Links */}
        <div className="flex items-center gap-8 text-sm font-medium">
          {navItems.map((item) => (
            <Link key={item.title} to={item.url} className="text-foreground/80 hover:text-foreground transition-colors">
              {item.title}
            </Link>
          ))}

          {/* CTA */}
          <Button
            variant="default"
            className="ml-4 px-5 py-2 rounded-xl text-background font-medium hover:opacity-90 transition"
            onClick={() => navigate('/auth')}
          >
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
