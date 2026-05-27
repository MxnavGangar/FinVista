type InputFieldProps = {
    label: string;
    type: string;
    placeholder: string;
  };
  
  export default function InputField({
    label,
    type,
    placeholder,
  }: InputFieldProps) {
    return (
      <div>
        <label className="text-sm text-zinc-400 mb-2 block">
          {label}
        </label>
  
        <input
          type={type}
          placeholder={placeholder}
          className="w-full bg-[#0A0A0B] border border-zinc-800 rounded-2xl px-4 py-3 outline-none focus:border-zinc-600 transition"
        />
      </div>
    );
  }