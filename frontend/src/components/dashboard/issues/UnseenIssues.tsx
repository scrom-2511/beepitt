import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getUnseenIssuesHandler,
  type Issue,
} from "@/requestHandler/issues/getIssues/getUnseenIssues.reqhandler";
import {
  updateIssuePriorityHandler,
  type UpdateIssuePriorityEnum,
} from "@/requestHandler/issues/updateIssues/updateIssuePriority.reqhandler";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import ButtonComp from "../../ButtonComp";
import { Button } from "../../ui/button";
import { Card, CardContent, CardFooter } from "../../ui/card";
import CardHeaderComp from "../CardHeader";
import Fallback from "../Fallback";

export const UnseenIssues = () => {
  return (
    <>
      <IssueCardsSection />
    </>
  );
};

const IssueCardsSection = () => {
  const [priorities, setPriorities] = useState<
    Record<string, UpdateIssuePriorityEnum>
  >({});

  const {
    data: issue_card_items,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["unseenIssues"],
    queryFn: getUnseenIssuesHandler,
  });

  const queryClient = useQueryClient();

  const { mutate: updateIssuePriority } = useMutation({
    mutationFn: updateIssuePriorityHandler,
    onSuccess: (_, variables) => {
      queryClient.setQueryData(["unseenIssues"], (oldData: Issue[]) => {
        return oldData.filter((issue) => issue.id !== variables.issueId);
      });
    },
  });

  const onSumitSetPriority = (issueId: number) => {
    const priority = priorities[issueId];
    if (!priority) return;
    updateIssuePriority({ newPriority: priority, issueId });
  };

  if (isError || isLoading || issue_card_items?.length === 0) {
    return (
      <Fallback
        data={issue_card_items}
        error={error}
        isError={isError}
        isLoading={isLoading}
        refetch={refetch}
      />
    );
  }

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 p-5 gap-5">
      {issue_card_items?.map((item, i) => (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 * i, ease: "easeIn" }}
          className="cursor-pointer"
        >
          <Card className="bg-card p-5 sm:p-10">
            <CardHeaderComp title={item.issueName} desc={item.issueDesc} />
            <CardContent className="p-0 font-semibold text-sm flex flex-row gap-2 w-full my-5">
              <Button variant={"outline"} className="flex-1">
                Date
              </Button>
              <Button variant={"outline"} className="flex-1">
                Time
              </Button>
            </CardContent>
            <CardFooter className="p-0 flex flex-col items-start gap-5">
              <Select
                value={priorities[item.id]}
                onValueChange={(value) =>
                  setPriorities((prev) => ({
                    ...prev,
                    [item.id]: value as UpdateIssuePriorityEnum,
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <ButtonComp
                className="h-10 w-full font-semibold cursor-pointer"
                onClick={() => onSumitSetPriority(item.id)}
              >
                Set Priority
              </ButtonComp>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </section>
  );
};
