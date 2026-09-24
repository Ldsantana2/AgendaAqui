export default function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg relative min-w-[350px]">
        <button className="absolute top-2 right-3 text-xl" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
