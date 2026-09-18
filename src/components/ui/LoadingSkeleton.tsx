export const ProductCardSkeleton = () => (
  <div className="animate-pulse flex flex-col space-y-4">
    <div className="bg-borderSubtle w-full aspect-[3/4] rounded-none" />
    <div className="h-4 bg-borderSubtle w-3/4 rounded" />
    <div className="h-4 bg-borderSubtle w-1/2 rounded" />
  </div>
);

export const EmptyState = ({ title, message, action }: { title: string; message: string; action?: React.ReactNode }) => (
  <div className="py-20 text-center flex flex-col items-center justify-center px-4">
    <h3 className="font-serif text-2xl text-charcoal mb-2">{title}</h3>
    <p className="text-taupe text-sm max-w-md mb-8">{message}</p>
    {action}
  </div>
);