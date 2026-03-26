import Fallback from '@/components/dashboard/Fallback';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  getProjectDetailsHandler,
  type ProjectDetails,
} from '@/requestHandler/settings/project/getProjectDetails.reqhandler';
import { updateContactDetailsHandler } from '@/requestHandler/settings/project/updateContactDetails.reqhandler';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

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
  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success('Identifier key copied to clipboard');
  };
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

      <div className="cursor-pointer" onClick={() => copyToClipboard(projectDetails.identifierKey)}>
        <Label htmlFor="identifierKey" className="cursor-pointer">
          Identifier Key
        </Label>
        <Input
          id="identifierKey"
          type="text"
          value={projectDetails.identifierKey}
          readOnly
          className="py-4 sm:py-6 text-foreground placeholder:text-xs sm:placeholder:text-sm mt-2 cursor-pointer"
        />
      </div>

      {localStorage.getItem('userSubscriptionTier') === 'PRO' && (
        <div className="cursor-pointer" onClick={() => copyToClipboard(projectDetails.identifierKey2 || '')}>
          <Label htmlFor="identifierKey" className="cursor-pointer">
            Identifier Key 2
          </Label>
          <Input
            id="identifierKey"
            type="text"
            value={projectDetails.identifierKey2}
            readOnly
            className="py-4 sm:py-6 text-foreground placeholder:text-xs sm:placeholder:text-sm mt-2 cursor-pointer"
          />
        </div>
      )}
    </section>
  );
};

const ContactDetails = ({ projectDetails }: ProjectInfoProps) => {
  const queryClient = useQueryClient();
  const projectId = Number(window.location.href.split('/').at(-1));
  const [emailIds, setEmailIds] = useState<string[]>(projectDetails.contactDetails.emailIds);
  const [telegramChatIds, setTelegramChatIds] = useState<string[]>(projectDetails.contactDetails.telegramChatIds);
  const [discordChatIds, setDiscordChatIds] = useState<string[]>(projectDetails.contactDetails.discordChatIds);
  const [emailIds2, setEmailIds2] = useState<string[]>(projectDetails.contactDetails.emailIds2);
  const [telegramChatIds2, setTelegramChatIds2] = useState<string[]>(projectDetails.contactDetails.telegramChatIds2);
  const [discordChatIds2, setDiscordChatIds2] = useState<string[]>(projectDetails.contactDetails.discordChatIds2);
  const [newEmail, setNewEmail] = useState('');

  const userSubscriptionTier = localStorage.getItem('userSubscriptionTier');

  const { mutate: updateContactDetails } = useMutation({
    mutationFn: (payload: { emailIds?: string[]; telegramChatIds?: string[]; discordChatIds?: string[] }) =>
      updateContactDetailsHandler({ projectId, ...payload }),
    onSuccess: () => {
      toast.success('Contact details updated successfully');
      queryClient.invalidateQueries({ queryKey: ['projectDetails', String(projectId)] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update contact details');
    },
  });

  const handleAddEmail = () => {
    if (!newEmail) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      toast.error('Invalid email format');
      return;
    }
    if (emailIds.includes(newEmail)) {
      toast.error('Email already exists');
      return;
    }
    const updatedEmails = [...emailIds, newEmail];
    updateContactDetails({ emailIds: updatedEmails });
    setEmailIds(updatedEmails);
    setNewEmail('');
  };
  const handleEmailChange = (index: number, value: string) => {
    const updatedEmails = [...emailIds];
    updatedEmails[index] = value;
    setEmailIds(updatedEmails);
  };

  const handleRemoveEmail = (index: number) => {
    const updatedEmails = emailIds.filter((_, i) => i !== index);
    setEmailIds(updatedEmails);
    updateContactDetails({ emailIds: updatedEmails });
  };

  const handleRemoveTelegram = (index: number) => {
    const updatedTelegram = telegramChatIds.filter((_, i) => i !== index);
    setTelegramChatIds(updatedTelegram);
    updateContactDetails({ telegramChatIds: updatedTelegram });
  };

  const handleRemoveDiscord = (index: number) => {
    const updatedDiscord = discordChatIds.filter((_, i) => i !== index);
    setDiscordChatIds(updatedDiscord);
    updateContactDetails({ discordChatIds: updatedDiscord });
  };

  if (userSubscriptionTier === 'pro') {
    return (
      <>
        <Label className="text-muted-foreground text-md">Incident contact details</Label>
        <Accordion type="single" collapsible className="w-full text-foreground">
          <AccordionItem value="telegram" className="border-none">
            <AccordionTrigger className="text-foreground text-lg pl-3 mb-2 font-montserrat font-light">
              <div>
                <h1 className="text-foreground text-xl mb-2 font-montserrat">Telegram</h1>
                <p className="text-muted-foreground text-sm">All your telegram chat ids</p>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-3 py-1 text-base md:text-sm">
              <section className="flex flex-col gap-6 text-muted-foreground text-sm">
                {telegramChatIds.map((chatId, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor={`telegramChatId-${i + 1}`}>Chat Id {i + 1}</Label>
                      <Trash2
                        className="w-4 h-4 text-red-500 cursor-pointer hover:text-red-700 transition-colors"
                        onClick={() => handleRemoveTelegram(i)}
                      />
                    </div>
                    <Input
                      id={`telegramChatId-${i + 1}`}
                      type="text"
                      value={chatId}
                      readOnly
                      className="py-4 sm:py-6 text-foreground placeholder:text-xs sm:placeholder:text-sm"
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
                {discordChatIds.map((chatId, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor={`discordChatId-${i + 1}`}>Chat Id {i + 1}</Label>
                      <Trash2
                        className="w-4 h-4 text-red-500 cursor-pointer hover:text-red-700 transition-colors"
                        onClick={() => handleRemoveDiscord(i)}
                      />
                    </div>
                    <Input
                      id={`discordChatId-${i + 1}`}
                      type="text"
                      value={chatId}
                      readOnly
                      className="py-4 sm:py-6 text-foreground placeholder:text-xs sm:placeholder:text-sm"
                    />
                  </div>
                ))}
              </section>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="email" className="border-none">
            <AccordionTrigger className="text-foreground text-lg pl-3 mb-2 font-montserrat font-light">
              <div>
                <h1 className="text-foreground text-xl mb-2 font-montserrat">Email</h1>
                <p className="text-muted-foreground text-sm">All your Email IDs</p>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-3 py-1 text-base md:text-sm">
              <section className="flex flex-col gap-4 text-muted-foreground text-sm">
                {emailIds.map((emailId, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor={`emailId-${i + 1}`}>Email Id {i + 1}</Label>
                      <Trash2
                        className="w-4 h-4 text-red-500 cursor-pointer hover:text-red-700 transition-colors"
                        onClick={() => handleRemoveEmail(i)}
                      />
                    </div>
                    <Input
                      id={`emailId-${i + 1}`}
                      type="email"
                      value={emailId}
                      onChange={(e) => handleEmailChange(i, e.target.value)}
                      className="py-4 sm:py-6 text-foreground placeholder:text-xs sm:placeholder:text-sm"
                    />
                  </div>
                ))}

                <div className="mt-4 flex flex-col gap-2">
                  <Label htmlFor="new-email">Add New Email</Label>
                  <div className="flex gap-2">
                    <Input
                      id="new-email"
                      type="email"
                      placeholder="Enter new email id"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="py-4 sm:py-6 text-foreground placeholder:text-xs sm:placeholder:text-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddEmail();
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleAddEmail}
                      className="h-auto aspect-square border-dashed border-2 hover:bg-muted"
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </section>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Label className="text-muted-foreground text-md mt-10">Issue contact details</Label>
        <Accordion type="single" collapsible className="w-full text-foreground">
          <AccordionItem value="telegram" className="border-none">
            <AccordionTrigger className="text-foreground text-lg pl-3 mb-2 font-montserrat font-light">
              <div>
                <h1 className="text-foreground text-xl mb-2 font-montserrat">Telegram</h1>
                <p className="text-muted-foreground text-sm">All your telegram chat ids</p>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-3 py-1 text-base md:text-sm">
              <section className="flex flex-col gap-6 text-muted-foreground text-sm">
                {telegramChatIds2.map((chatId, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor={`telegramChatId-${i + 1}`}>Chat Id {i + 1}</Label>
                      <Trash2
                        className="w-4 h-4 text-red-500 cursor-pointer hover:text-red-700 transition-colors"
                        onClick={() => handleRemoveTelegram(i)}
                      />
                    </div>
                    <Input
                      id={`telegramChatId-${i + 1}`}
                      type="text"
                      value={chatId}
                      readOnly
                      className="py-4 sm:py-6 text-foreground placeholder:text-xs sm:placeholder:text-sm"
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
                {discordChatIds2.map((chatId, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor={`discordChatId-${i + 1}`}>Chat Id {i + 1}</Label>
                      <Trash2
                        className="w-4 h-4 text-red-500 cursor-pointer hover:text-red-700 transition-colors"
                        onClick={() => handleRemoveDiscord(i)}
                      />
                    </div>
                    <Input
                      id={`discordChatId-${i + 1}`}
                      type="text"
                      value={chatId}
                      readOnly
                      className="py-4 sm:py-6 text-foreground placeholder:text-xs sm:placeholder:text-sm"
                    />
                  </div>
                ))}
              </section>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="email" className="border-none">
            <AccordionTrigger className="text-foreground text-lg pl-3 mb-2 font-montserrat font-light">
              <div>
                <h1 className="text-foreground text-xl mb-2 font-montserrat">Email</h1>
                <p className="text-muted-foreground text-sm">All your Email IDs</p>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-3 py-1 text-base md:text-sm">
              <section className="flex flex-col gap-4 text-muted-foreground text-sm">
                {emailIds2.map((emailId, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor={`emailId-${i + 1}`}>Email Id {i + 1}</Label>
                      <Trash2
                        className="w-4 h-4 text-red-500 cursor-pointer hover:text-red-700 transition-colors"
                        onClick={() => handleRemoveEmail(i)}
                      />
                    </div>
                    <Input
                      id={`emailId-${i + 1}`}
                      type="email"
                      value={emailId}
                      onChange={(e) => handleEmailChange(i, e.target.value)}
                      className="py-4 sm:py-6 text-foreground placeholder:text-xs sm:placeholder:text-sm"
                    />
                  </div>
                ))}

                <div className="mt-4 flex flex-col gap-2">
                  <Label htmlFor="new-email">Add New Email</Label>
                  <div className="flex gap-2">
                    <Input
                      id="new-email"
                      type="email"
                      placeholder="Enter new email id"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="py-4 sm:py-6 text-foreground placeholder:text-xs sm:placeholder:text-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddEmail();
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleAddEmail}
                      className="h-auto aspect-square border-dashed border-2 hover:bg-muted"
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </section>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full text-foreground">
      <AccordionItem value="telegram" className="border-none">
        <AccordionTrigger className="text-foreground text-lg pl-3 mb-2 font-montserrat font-light">
          <div>
            <h1 className="text-foreground text-xl mb-2 font-montserrat">Telegram</h1>
            <p className="text-muted-foreground text-sm">All your telegram chat ids</p>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-3 py-1 text-base md:text-sm">
          <section className="flex flex-col gap-6 text-muted-foreground text-sm">
            {telegramChatIds.map((chatId, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor={`telegramChatId-${i + 1}`}>Chat Id {i + 1}</Label>
                  <Trash2
                    className="w-4 h-4 text-red-500 cursor-pointer hover:text-red-700 transition-colors"
                    onClick={() => handleRemoveTelegram(i)}
                  />
                </div>
                <Input
                  id={`telegramChatId-${i + 1}`}
                  type="text"
                  value={chatId}
                  readOnly
                  className="py-4 sm:py-6 text-foreground placeholder:text-xs sm:placeholder:text-sm"
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
            {discordChatIds.map((chatId, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor={`discordChatId-${i + 1}`}>Chat Id {i + 1}</Label>
                  <Trash2
                    className="w-4 h-4 text-red-500 cursor-pointer hover:text-red-700 transition-colors"
                    onClick={() => handleRemoveDiscord(i)}
                  />
                </div>
                <Input
                  id={`discordChatId-${i + 1}`}
                  type="text"
                  value={chatId}
                  readOnly
                  className="py-4 sm:py-6 text-foreground placeholder:text-xs sm:placeholder:text-sm"
                />
              </div>
            ))}
          </section>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="email" className="border-none">
        <AccordionTrigger className="text-foreground text-lg pl-3 mb-2 font-montserrat font-light">
          <div>
            <h1 className="text-foreground text-xl mb-2 font-montserrat">Email</h1>
            <p className="text-muted-foreground text-sm">All your Email IDs</p>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-3 py-1 text-base md:text-sm">
          <section className="flex flex-col gap-4 text-muted-foreground text-sm">
            {emailIds.map((emailId, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor={`emailId-${i + 1}`}>Email Id {i + 1}</Label>
                  <Trash2
                    className="w-4 h-4 text-red-500 cursor-pointer hover:text-red-700 transition-colors"
                    onClick={() => handleRemoveEmail(i)}
                  />
                </div>
                <Input
                  id={`emailId-${i + 1}`}
                  type="email"
                  value={emailId}
                  onChange={(e) => handleEmailChange(i, e.target.value)}
                  className="py-4 sm:py-6 text-foreground placeholder:text-xs sm:placeholder:text-sm"
                />
              </div>
            ))}

            <div className="mt-4 flex flex-col gap-2">
              <Label htmlFor="new-email">Add New Email</Label>
              <div className="flex gap-2">
                <Input
                  id="new-email"
                  type="email"
                  placeholder="Enter new email id"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="py-4 sm:py-6 text-foreground placeholder:text-xs sm:placeholder:text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddEmail();
                    }
                  }}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleAddEmail}
                  className="h-auto aspect-square border-dashed border-2 hover:bg-muted"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </section>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
