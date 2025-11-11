import { Cloud, PlusCircle } from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  buttonText: string;
  href: string;
}
const EmptyState = ({
  title,
  description,
  href,
  buttonText,
}: EmptyStateProps) => {
  return (
    <>
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon" className="bg-primary/10">
            <Cloud className="size-5 text-primary" />
          </EmptyMedia>
          <EmptyTitle>{title}</EmptyTitle>
          <EmptyDescription>{description}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link href={href} className={buttonVariants()}>
            <PlusCircle />
            {buttonText}
          </Link>
        </EmptyContent>
      </Empty>
    </>
  );
};

export default EmptyState;
