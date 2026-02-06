import { getSeenIncidentsHandler } from "@/requestHandler/incidents/getIncidents/getSeenIncidents.reqhandler";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import CardHeaderComp from "../CardHeader";
import Fallback from "../Fallback";

export const SeenIncidents = () => {
  return (
    <>
      <IncidentCardsSection />
    </>
  );
};

const IncidentCardsSection = () => {
  const {
    data: incident_card_items,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["seenIncidents"],
    queryFn: getSeenIncidentsHandler,
  });

  if (isError || isLoading || incident_card_items?.length === 0) {
    return (
      <Fallback
        data={incident_card_items}
        error={error}
        isError={isError}
        isLoading={isLoading}
        refetch={refetch}
      />
    );
  }

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 p-5 gap-5">
      {incident_card_items?.map((item, i) => (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 * i, ease: "easeIn" }}
          className="cursor-pointer"
        >
          <Card className="bg-card p-5 sm:p-10">
            <CardHeaderComp
              title={item.incidentName}
              desc={item.incidentDesc}
            />
            <CardContent className="p-0 font-semibold text-sm flex flex-row gap-2 w-full my-5">
              <Button variant={"outline"} className="flex-1">
                Date
              </Button>
              <Button variant={"outline"} className="flex-1">
                Time
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </section>
  );
};
