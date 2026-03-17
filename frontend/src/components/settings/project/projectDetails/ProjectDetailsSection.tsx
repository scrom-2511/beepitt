import Fallback from '@/components/dashboard/Fallback';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  getProjectDetailsHandler,
  type ProjectDetails,
} from '@/requestHandler/settings/project/getProjectDetails.reqhandler';
import { useQuery } from '@tanstack/react-query';

const ProjectDetailsSection = () => {
  const projectId = window.location.href.split('/').at(-1);

  const {
    data: projectDetails,
    isLoading,
    isPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['projectDetails', projectId],
    queryFn: () => getProjectDetailsHandler(Number(projectId)),
  });

  if (isError || !projectDetails)
    return (
      <Fallback
        data={undefined}
        error={error}
        isError={isError}
        isLoading={isLoading}
        refetch={refetch}
        emptyTitle="Settings"
        loadingTitle="project details"
        addNew={false}
      />
    );
  const sections = [
    {
      title: 'Project Info',
      description: 'Basic details of the project',
      content: <ProjectInfo projectDetails={projectDetails} />,
    },
    {
      title: 'Contact Details',
      description: 'Your contact details for notifications',
      content: <ContactDetails projectDetails={projectDetails} />,
    },
  ];

  return (
    <section>
      {sections.map((section, index) => (
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
      ))}
    </section>
  );
};

export default ProjectDetailsSection;

interface ProjectInfoProps {
  projectDetails: ProjectDetails;
}

const ProjectInfo = ({ projectDetails }: ProjectInfoProps) => {
  return (
    <section className="flex flex-col gap-6 text-muted-foreground text-sm">
      <div className="flex w-full gap-5">
        <div className="flex-1">
          <Label htmlFor="projectName">Project Name</Label>
          <Input
            id="projectName"
            value={projectDetails.projectName}
            readOnly
            className="py-4 sm:py-6 text-foreground placeholder:text-xs sm:placeholder:text-sm mt-2"
          />
        </div>

        <div className="flex-1">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={projectDetails.projectDesc}
            readOnly
            className="py-4 sm:py-6 text-foreground placeholder:text-xs sm:placeholder:text-sm mt-2"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="identifierKey">Identifier Key</Label>
        <Input
          id="identifierKey"
          type="text"
          value={projectDetails.identifierKey}
          readOnly
          className="py-4 sm:py-6 text-foreground placeholder:text-xs sm:placeholder:text-sm mt-2"
        />
      </div>
    </section>
  );
};

const ContactDetails = ({ projectDetails }: ProjectInfoProps) => {
  return (
    <Accordion type="single" collapsible className="w-full text-foreground">
      <AccordionItem value="telegram" className="border-none">
        <AccordionTrigger className="text-foreground text-lg pl-3 mb-2 font-montserrat font-light">
          <div>
            <h1 className="text-foreground text- mb-2 font-montserrat">Telegram</h1>
            <p className="text-muted-foreground text-sm">All your telegram chat ids</p>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-3 py-1 text-base md:text-sm">
          <section className="flex flex-col gap-6 text-muted-foreground text-sm">
            {projectDetails.contactDetails.telegramChatIds.map((chatId, i) => (
              <div>
                <Label htmlFor="identifierKey">Chat Id {i}</Label>
                <Input
                  id="identifierKey"
                  type="text"
                  value={'hi there'}
                  readOnly
                  className="py-4 sm:py-6 text-foreground placeholder:text-xs sm:placeholder:text-sm mt-2"
                />
              </div>
            ))}
          </section>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="discord" className="border-none">
        <AccordionTrigger className="text-foreground text-lg pl-3 mb-2 font-montserrat font-light">
          <div>
            <h1 className="text-foreground text-xl mb-2 font-montserrat">Discord</h1>
            <p className="text-muted-foreground text-sm">All your Discord chat IDs</p>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-3 py-1 text-base md:text-sm">
          <section className="flex flex-col gap-6 text-muted-foreground text-sm">
            {projectDetails.contactDetails.discordChatIds.map((chatId, i) => (
              <div key={i}>
                <Label htmlFor={`discordChatId-${i}`}>Chat Id {i}</Label>
                <Input
                  id={`discordChatId-${i}`}
                  type="text"
                  value={chatId}
                  readOnly
                  className="py-4 sm:py-6 text-foreground placeholder:text-xs sm:placeholder:text-sm mt-2"
                />
              </div>
            ))}
          </section>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
