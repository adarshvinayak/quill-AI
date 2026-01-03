interface BrutalInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  error?: string;
  disabled?: boolean;
}

export default function BrutalInput({
  value,
  onChange,
  placeholder,
  type = 'text',
  className = '',
  error,
  disabled = false,
}: BrutalInputProps) {
  return (
    <div className="w-full">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full px-4 py-3
          brutal-border brutal-shadow-sm
          bg-white
          text-lg
          focus:outline-none focus:brutal-shadow
          transition-none
          ${error ? 'border-cyberPink' : ''}
          ${className}
        `}
      />
      {error && (
        <p className="mt-2 text-cyberPink font-bold text-sm">{error}</p>
      )}
    </div>
  );
}
