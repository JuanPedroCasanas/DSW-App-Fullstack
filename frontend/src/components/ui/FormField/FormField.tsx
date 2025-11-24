type FormFieldProps = {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
};

export function FormField({ label, htmlFor, children }: FormFieldProps) {
  return (
    <div className="grid gap-2">
      <label htmlFor={htmlFor} className="text-sm text-black/90">
        {label}
      </label>
      {children}
    </div>
  );
}
