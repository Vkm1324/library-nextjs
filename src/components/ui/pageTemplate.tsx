
import { Suspense } from "react";
import Search from "./landingPage/search";
import Pagination from "./landingPage/pagination";

interface PageTemplateProps {
  children: React.ReactNode; // Content to be wrapped in Suspense
  totalPages: number;
  fallback: React.ReactNode; // Fallback content for Suspense
  suspenseKey: string | number; // Unique key for Suspense
  children1?: React.ReactNode;
}

export const PageTemplate: React.FC<PageTemplateProps> = ({
  totalPages,
  children,
  fallback,
  suspenseKey,
    children1,
}) => {
  return (
    <section className="w-full">
      <div className="container px-4 md:px-7">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="mt-4 px-0 flex-row  flex-wrap items-center justify-between gap-4 md:gap-10 md:mt-2 ">
            <Search placeholder="Search..." />
            {children1 && (
              <span>
                {children1} {/* Render children1 beside Search */}
              </span>
            )}
          </div>
          <Suspense key={suspenseKey} fallback={fallback}>
            {children}
          </Suspense>
          <div className="mt-5 flex w-full justify-center">
            <Pagination totalPages={totalPages} />
          </div>
        </div>
      </div>
    </section>
  );
};
 
     