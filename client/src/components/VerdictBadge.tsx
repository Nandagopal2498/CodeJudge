interface VerdictBadgeProps {
  verdict: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Compilation Error' | 'Runtime Error' | 'Pending';
  size?: 'sm' | 'md' | 'lg';
}

export function VerdictBadge({ verdict, size = 'sm' }: VerdictBadgeProps) {
  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm font-bold'
  }[size];

  switch (verdict) {
    case 'Accepted':
      return (
        <span className={`inline-flex items-center rounded-full font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 ${sizeClasses}`}>
          Accepted
        </span>
      );
    case 'Wrong Answer':
      return (
        <span className={`inline-flex items-center rounded-full font-semibold bg-rose-50 text-rose-700 border border-rose-200 ${sizeClasses}`}>
          Wrong Answer
        </span>
      );
    case 'Time Limit Exceeded':
      return (
        <span className={`inline-flex items-center rounded-full font-semibold bg-amber-50 text-amber-800 border border-amber-200 ${sizeClasses}`}>
          Time Limit Exceeded
        </span>
      );
    case 'Compilation Error':
      return (
        <span className={`inline-flex items-center rounded-full font-semibold bg-red-50 text-red-700 border border-red-200 ${sizeClasses}`}>
          Compile Error
        </span>
      );
    case 'Runtime Error':
      return (
        <span className={`inline-flex items-center rounded-full font-semibold bg-purple-50 text-purple-700 border border-purple-200 ${sizeClasses}`}>
          Runtime Error
        </span>
      );
    case 'Pending':
      return (
        <span className={`inline-flex items-center rounded-full font-semibold bg-blue-50 text-blue-700 border border-blue-200 ${sizeClasses}`}>
          Pending
        </span>
      );
  }
}
