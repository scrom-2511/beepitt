import type { Issue } from "@/requestHandler/issues/getIssues/getOpenIssues.reqhandler";
import { getOpenIssuesHandler } from "@/requestHandler/issues/getIssues/getOpenIssues.reqhandler";
import { updateIssuePriorityHandler } from "@/requestHandler/issues/updateIssues/updateIssuePriority.reqhandler";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CircleX } from "lucide-react";
import { useCallback, useState } from "react";
import ButtonComp from "../../ButtonComp";
import { Button } from "../../ui/button";
import { Card, CardContent, CardFooter } from "../../ui/card";
import CardHeaderComp from "../CardHeader";
import Fallback from "../Fallback";

export const OpenIssues = () => {
  return (
    <>
      <FilterSection />
      <IssueCardsSection />
    </>
  );
};

const filters_items = [
  { title: "Critical", color: "bg-red-600" },
  { title: "High", color: "bg-red-500" },
  { title: "Low", color: "bg-yellow-600" },
];

const FilterSection = () => {
  const [selected, setSelected] = useState<string>();
  return (
    <section className="w-full flex">
      <div className="w-130 flex gap-2 p-5">
        {filters_items.map((item) => (
          <ButtonComp
            variant={"outline"}
            className={`flex-1 text-foreground w-full cursor-pointer p-0 h-8 ${
              item.title === selected ? "w-48" : ""
            }`}
            onClick={() =>
              setSelected((prev) => (item.title === prev ? "" : item.title))
            }
          >
            <div className={`h-2 w-2 rounded-full ${item.color}`}></div>
            {item.title}
            {selected === item.title && (
              <CircleX
                className="ml-2 size-3.5"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected("");
                }}
              />
            )}
          </ButtonComp>
        ))}
      </div>
    </section>
  );
};

const IssueCardsSection = () => {
  const {
    data: issue_card_items,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["openIssues"],
    queryFn: getOpenIssuesHandler,
  });
  const queryClient = useQueryClient();

  const { mutate: updateIssuePriority } = useMutation({
    mutationFn: updateIssuePriorityHandler,
    onSuccess: (_, variables) => {
      queryClient.setQueryData(["openIssues"], (oldData: Issue[]) => {
        return oldData.filter((issue) => issue.id !== variables.issueId);
      });
    },
  });

  const onClickToUpdatePriority = useCallback(
    (issueId: number) => {
      updateIssuePriority({ newPriority: "Closed", issueId });
    },
    [updateIssuePriority],
  );

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
      {issue_card_items?.map((item, index) => (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: index * 0.1, ease: "easeIn" }}
          className="cursor-pointer"
          key={item.id}
        >
          <Card key={item.id} className="bg-card p-10">
            <CardHeaderComp title={item.issueName} desc={item.issueDesc} />
            <CardContent className="p-0 font-semibold text-sm flex flex-row gap-2 w-full my-5">
              <Button variant={"outline"} className="flex-1">
                {item.issueDateAndTime.toString()}
              </Button>
              <Button variant={"outline"} className="flex-1">
                {item.issueDateAndTime.toString()}
              </Button>
            </CardContent>
            <CardFooter className="p-0 flex flex-col items-start gap-5">
              <div className="flex flex-row items-center">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    boxShadow: [
                      "0 0px 2px rgba(255, 0, 0, 0.2)",
                      "0 0px 8px rgba(255, 0, 0, 0.6)",
                      "0 0px 2px rgba(255, 0, 0, 0.2)",
                    ],
                  }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className={`h-2.5 w-2.5  mr-3 rounded-full ${
                    item.issuePriority === "Critical"
                      ? "bg-red-600"
                      : item.issuePriority === "High"
                        ? "bg-red-500"
                        : "bg-yellow-600"
                  }`}
                ></motion.div>
                {item.issuePriority}
              </div>
              <ButtonComp
                className="h-10 w-full font-semibold cursor-pointer"
                onClick={() => onClickToUpdatePriority(item.id)}
              >
                Mark As Fixed
              </ButtonComp>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </section>
  );
};
