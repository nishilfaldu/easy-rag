import type { UrlObject } from "url";

import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

interface EmptyStateProps {
  message: string;
  imagePath: string;
  linkMessage: string;
  linkHref: UrlObject;
}

export default function EmptyState({
  imagePath,
  linkHref,
  linkMessage,
  message,
}: EmptyStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center space-y-1 w-full">
      <div
        aria-hidden="true"
        className="relative mb-4 h-60 w-60 text-muted-foreground"
      >
        <Image src={imagePath} fill alt={"empty state"} />
      </div>
      <div className="text-xl font-semibold">{message}</div>
      <Link
        // TODO: change this to maybe open up the modal
        href={linkHref}
        className={buttonVariants({
          variant: "link",
          size: "sm",
          className: "text-sm text-muted-foreground text-wrap text-center",
        })}
      >
        {linkMessage}
      </Link>
    </div>
  );
}
