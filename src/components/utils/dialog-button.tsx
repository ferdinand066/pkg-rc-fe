import React, { forwardRef } from "react";
import { classJoin } from "../../lib/functions";

type DialogButtonProps = {
  buttonValue: string | JSX.Element;
  onClick: React.MouseEventHandler<HTMLButtonElement>,
  children: React.ReactNode;
  className?: string;
};

const DialogButton = forwardRef<HTMLDialogElement, DialogButtonProps>(({ buttonValue, onClick, children }, ref) => {
  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          if (!buttonValue) return;
          if (onClick) {
            onClick(e);
          }
          return (ref as React.RefObject<HTMLDialogElement>).current?.showModal();
        }}
        className={classJoin(buttonValue ? "btn bg-base-100 hover:bg-gray-200 border-none h-10 max-h-10 text-sm" : "hidden")}
      >
        {buttonValue}
      </button>
      <dialog className="modal" ref={ref}>
        <div className="modal-box">
          {children}
        </div>
      </dialog>
    </>
  );
});

export default DialogButton;
