import { CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import ExportLogs from './ExportLogs';

const MoreSettingsSection = () => {
  const sections = [
    {
      title: 'Export Logs',
      description: 'Export logs to a CSV/JSON file',
      content: <ExportLogs />,
      display: true,
    },
  ];
  return (
    <section>
      {sections.map(
        (section, index) =>
          section.display && (
            <div key={section.title}>
              {index !== 0 && <Separator />}

              <div className="w-full h-auto rounded-2xl grid grid-rows-[100px_auto] mb-5">
                <div className="flex flex-col h-full w-full p-5 lg:p-10">
                  <h1 className="text-foreground text-xl mb-2 font-montserrat">{section.title}</h1>
                  <p className="text-muted-foreground text-sm">{section.description}</p>
                </div>

                <div>
                  <CardContent className="p-5 lg:p-10">{section.content}</CardContent>
                </div>
              </div>
            </div>
          ),
      )}
    </section>
  );
};

export default MoreSettingsSection;
