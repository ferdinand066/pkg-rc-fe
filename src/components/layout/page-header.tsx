type PageHeaderType = {
  pageName: string;
  action?: JSX.Element;
};

const PageHeader = ({ pageName, action }: PageHeaderType) => {
  return (
    <div className="flex items-center justify-between px-6 py-4 lg:py-8">
      <div className="flex-1 min-w-0">
        <h1 className="text-3xl font-medium leading-12 sm:truncate">
          {pageName}
        </h1>
      </div>
      {action}
    </div>
  );
};

export default PageHeader;
