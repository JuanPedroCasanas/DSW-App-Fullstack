import React from "react";
import { PrimaryButton } from "@/components/ui";

type Props = {
  countSelected: number;
  disabled?: boolean;
  onConfirm: () => void;
};

export const StickyRentBar: React.FC<Props> = ({ countSelected, disabled, onConfirm }) => {
  return (
    <div className="sticky bottom-0 z-10 pt-4 bg-gradient-to-t from-[var(--color-bg,white)] to-transparent">
      <PrimaryButton fullWidth disabled={disabled} onClick={onConfirm}>
        ALQUILAR ({countSelected})
      </PrimaryButton>
    </div>
  );
};
