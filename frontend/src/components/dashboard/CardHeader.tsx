import { CardDescription, CardHeader, CardTitle } from "../ui/card";

const CardHeaderComp = ({ title, desc }: { title: string; desc: string }) => {
  return (
    <CardHeader className="p-0">
      <CardTitle className="line-clamp-2">{title}</CardTitle>
      <CardDescription className="line-clamp-2">{desc}</CardDescription>
    </CardHeader>
  );
};

export default CardHeaderComp;
