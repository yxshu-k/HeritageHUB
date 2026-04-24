export default function Loader({ message = 'Loading...' }) {
  return (
    <div className="fixed inset-0 bg-dark-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-heritage-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-heritage-600 font-semibold text-lg">{message}</p>
      </div>
    </div>
  );
}