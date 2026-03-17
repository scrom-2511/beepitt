import { useNavigate } from 'react-router-dom';

type Position = 'relative' | 'fixed' | 'static';

const NavigationBar = ({ position }: { position: Position }) => {
  const navigate = useNavigate();

  const buttons = [
    { key: 'DASHBOARD', navigate: 'dashboard' },
    { key: 'PRICING', navigate: 'pricing' },
    { key: 'DOCS', navigate: 'docs' },
    { key: 'SIGNIN', navigate: 'signin' },
  ];

  return (
    <div
      className="h-25 w-full pr-30 font-roboto font-bold flex justify-end items-center text-sm text-primary z-20 bg-background"
      style={{ position }}
    >
      <div className="flex items-center">
        {buttons.map((btn, index) => (
          <button key={index} className="button-navigation h-17.5" onClick={() => navigate(`/${btn.navigate}`)}>
            {btn.key}
          </button>
        ))}
        <button className="button-navigation h-17.5" onClick={() => navigate('/settings')}>
          <img src="/images/settings.png" alt="" className="h-6" />
        </button>
      </div>
    </div>
  );
};

export default NavigationBar;
