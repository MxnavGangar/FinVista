type InputFieldProps = {
    label: string;
    type: string;
    placeholder: string;
    name?: string;
    value?: string;
    required?: boolean;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  };
  
  export default function InputField({
    label,
    type,
    placeholder,
    name,
    value,
    required,
    onChange,
  }: InputFieldProps) {
    return (
      <div>
        <label className="text-sm text-zinc-400 mb-2 block">
          {label}
        </label>
  
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          required={required}
          onChange={onChange}
          className="w-full bg-[#0A0A0B] border border-zinc-800 rounded-2xl px-4 py-3 outline-none focus:border-zinc-600 transition"
        />
      </div>
    );
  }
