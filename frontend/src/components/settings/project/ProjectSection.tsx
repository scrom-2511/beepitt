import ButtonComp from '@/components/ButtonComp';
import CardAnimation from '@/components/dashboard/CardAnimation';
import CardHeaderComp from '@/components/dashboard/CardHeader';
import Fallback from '@/components/dashboard/Fallback';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { createProjectHandler } from '@/requestHandler/settings/project/createProject.reqhandler';
import { getAllProjects } from '@/requestHandler/settings/project/getAllProjects.reqhandler';
import { DialogClose } from '@radix-ui/react-dialog';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const ProjectSection = () => {
  return (
    <div className="relative w-full">
      <ProjectCardsSection />
      <AddButton />
    </div>
  );
};

export default ProjectSection;

const AddButton = () => {
  const [open, setOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const queryClient = useQueryClient();

  const { mutate: createProject, isPending } = useMutation({
    mutationFn: createProjectHandler,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allProjects'] });
      toast.success('Project created successfully');
      setProjectName('');
      setProjectDesc('');
      setOpen(false);
    },
    onError: (error) => {
      setOpen(false);
      console.log(error);
      toast.error(error.message);
    },
  });

  return (
    <div className="fixed bottom-20 right-20 min-[2000px]:right-[clamp(80px,calc(80px+((100vw-2000px)*0.5)),5000px)]">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <ButtonComp className="px-10 py-7 font-semibold">+ Add</ButtonComp>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-accent-foreground">Create Project</DialogTitle>
            <DialogDescription>Enter new project name:</DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="text-foreground"
          />
          <Input
            placeholder="Project Description"
            value={projectDesc}
            onChange={(e) => setProjectDesc(e.target.value)}
            className="text-foreground"
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="text-muted-foreground">
                Cancel
              </Button>
            </DialogClose>
            <Button
              disabled={isPending}
              onClick={() => {
                if (!projectName || projectName.length === 0 || !projectDesc || projectDesc.length === 0) {
                  toast.error('Add a project name');
                  return;
                }
                createProject({ projectName, projectDesc });
              }}
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const ProjectCardsSection = () => {
  const navigate = useNavigate();
  const {
    data: projects,
    isPending,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['allProjects'],
    queryFn: getAllProjects,
  });

  console.log('projects are: ');
  console.log(projects);

  if (isError || isLoading || projects?.allUserProjects.length === 0) {
    return (
      <Fallback
        data={projects?.allUserProjects}
        error={error}
        isError={isError}
        isLoading={isLoading}
        refetch={refetch}
        emptyTitle="Settings"
        loadingTitle="Projects"
        addNew={true}
      />
    );
  }
  return (
    <AnimatePresence>
      <section className="flex flex-col gap-7 p-10">
        {projects?.allUserProjects?.map((item, i) => (
          <CardAnimation i={i} key={item.id}>
            <Card
              className="bg-card w-full h-32 p-5 flex flex-col justify-center sm:p-10 cursor-pointer hover:shadow-lg transition"
              onClick={() => navigate(`${item.id}`)}
            >
              <CardHeaderComp title={item.projectName} desc={item.projectDesc} />
            </Card>
          </CardAnimation>
        ))}
      </section>
    </AnimatePresence>
  );
};
