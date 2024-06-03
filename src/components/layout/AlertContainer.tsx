type AlertData = {
  message: string | JSX.Element;
};

const AlertContainer = ({ notification }: { notification: AlertData[] }) => {
  return notification.length > 0 ? (
    <div className="flex flex-col gap-4 mx-6 mb-6">
      {notification.map((notification, index) => (
        <div key={index} role="alert" className="alert shadow flex flex-row text-start">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-primary shrink-0 w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <div>{notification.message}</div>
        </div>
      ))}
    </div>
  ) : <></>;
};

export default AlertContainer;
