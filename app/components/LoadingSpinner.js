export default function LoadingSpinner({ size = 'medium', color = 'blue' }) {
  const sizeClasses = {
    tiny: 'w-3 h-3 border-2',
    small: 'w-5 h-5 border-2',
    medium: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4'
  };
  
  const colorClasses = {
    blue: 'border-blue-600 dark:border-blue-400',
    indigo: 'border-indigo-600 dark:border-indigo-400',
    purple: 'border-purple-600 dark:border-purple-400',
    gradient: 'border-gradient-spinner'
  };
  
  const sizeClass = sizeClasses[size] || sizeClasses.medium;
  const colorClass = colorClasses[color] || colorClasses.blue;
  
  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizeClass} rounded-full ${colorClass} border-solid border-t-transparent animate-spin`}
        style={{
          animationTimingFunction: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)'
        }}
      ></div>
    </div>
  );
} 