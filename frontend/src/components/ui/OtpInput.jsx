import React, {
  useState,
  useRef,
  useEffect,
} from "react";

export const OtpInput = ({
  length,
  onChange,
  error,
  autoFocus = true,
  disabled = false,
}) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRefs = useRef([]);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (element, index) => {
    const value = element.value.replace(/[^0-9]/g, "");
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    onChange(newOtp.join(""));

    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];
      if (otp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
        onChange(newOtp.join(""));
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/[^0-9]/g, "");
    if (!paste) return;

    const newOtp = [...otp];
    for (let i = 0; i < length; i++) {
      newOtp[i] = paste[i] || "";
    }
    setOtp(newOtp);
    onChange(newOtp.join(""));

    const lastIndex = Math.min(paste.length, length) - 1;
    if (lastIndex >= 0) inputRefs.current[lastIndex]?.focus();
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className="flex justify-center space-x-2 sm:space-x-4"
        onPaste={handlePaste}
      >
        {otp.map((value, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value}
            disabled={disabled}
            onChange={(e) => handleChange(e.target, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onFocus={(e) => e.target.select()}
            className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-semibold border rounded-md shadow-sm 
              transition-colors duration-200
              ${error
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300 focus:ring-primary-500 focus:border-primary-500"}
              bg-white text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed`}
          />
        ))}
      </div>
      {error && (
        <p className="mt-2 text-sm text-center text-red-600">{error}</p>
      )}
    </div>
  );
};
