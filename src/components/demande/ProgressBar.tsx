interface ProgressBarProps {
  currentStep: number;
}

const steps = [
  { number: 1, label: "Soins" },
  { number: 2, label: "Ordonnance" },
  { number: 3, label: "Disponibilités" },
  { number: 4, label: "Patient" },
];

export function ProgressBar({ currentStep }: ProgressBarProps) {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-center space-x-2">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step.number < currentStep
                    ? "bg-green-600 text-white"
                    : step.number === currentStep
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 text-gray-500"
                }`}
              >
                {step.number < currentStep ? "✓" : step.number}
              </div>
              <span
                className={`ml-2 text-sm font-medium ${
                  step.number < currentStep
                    ? "text-green-600"
                    : step.number === currentStep
                    ? "text-blue-600"
                    : "text-gray-500"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-16 h-1 mx-2 ${
                  step.number < currentStep ? "bg-green-600" : "bg-gray-300"
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
