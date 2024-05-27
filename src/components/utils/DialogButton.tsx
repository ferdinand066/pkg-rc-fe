import React, { forwardRef } from "react";
import { classJoin } from "../../lib/functions";

type DialogButtonProps = {
  buttonText: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>,
  children: React.ReactNode;
  className?: string;
};

const DialogButton = forwardRef<HTMLDialogElement, DialogButtonProps>(({ buttonText, onClick, children }, ref) => {
  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          if (!buttonText) return;
          if (onClick){
            onClick(e);
          }
          return (ref as React.RefObject<HTMLDialogElement>).current?.showModal();
        }}
        className={classJoin(buttonText ? "btn btn-primary h-10 max-h-10 text-sm" : "hidden")}
      >
        {buttonText}
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
