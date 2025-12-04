import React from "react";
import { PrimaryButton } from "@/components/ui";

type Props = {
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
};
// backdrop-saturate-[1.1] backdrop-blur-[2px]
export const StickyCTA: React.FC<Props> = ({ disabled, onClick, children }) => {
  return (
    <div className="sticky bottom-0 z-10 pt-6 pb-4 from-transparent to-[var(--color-bg)] ">
      <PrimaryButton fullWidth onClick={onClick} disabled={disabled}>
        {children}
      </PrimaryButton>
    </div>
  );
};
