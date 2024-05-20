import { useEffect } from "react";
import styles from "@/styles/auth.module.css";

export default function useAuthFormEvent(){
  useEffect(() => {
    const timer = setTimeout(() => {
      const signUpButton = document.querySelectorAll('.signUp');
      const signInButton = document.querySelectorAll('.signIn');
      const container = document.getElementById('container');
      const mobileContainer = document.getElementById('mobile-container');

      if ((!container && !mobileContainer) || !signUpButton || !signInButton) return;

      const addPanelEvent = () => {
        container!.classList.add(styles["right-panel-active"]);
        mobileContainer!.classList.add(styles["right-panel-active"]);
      }

      const removePanelEvent = () => {
        container!.classList.remove(styles["right-panel-active"]);
        mobileContainer!.classList.remove(styles["right-panel-active"]);
      }
      
      signUpButton.forEach((button) => button.addEventListener('click', addPanelEvent));
      signInButton.forEach((button) => button.addEventListener('click', removePanelEvent));
    }, 1000);

    () => {
      clearTimeout(timer);
      // if (!container || !signUpButton || !signInButton) return;
      // signUpButton.forEach((button) => button.removeEventListener('click', addPanelEvent));
      // signInButton.forEach((button) => button.removeEventListener('click', removePanelEvent));
    }
  }, []);
}