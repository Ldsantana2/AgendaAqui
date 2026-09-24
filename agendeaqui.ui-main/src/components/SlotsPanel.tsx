// components/SlotsPanel.tsx
import dayjs from "dayjs";

type Props = {
  date: dayjs.Dayjs | null;
  slots: any[];
  selectedSlotId: string | null;
  onSlotSelect: (id: string) => void;
  onBook: () => void;
};

export default function SlotsPanel({
  date,
  slots,
  selectedSlotId,
  onSlotSelect,
  onBook,
}: Props) {
  if (!date) return <p className="text-gray-500">Selecione uma data.</p>;

  const forDate = slots.filter((s) => dayjs(s.date).isSame(date, "day"));
  const morning = forDate.filter((s) => Number(s.startTime.split(":")[0]) < 13);
  const afternoon = forDate.filter(
    (s) => Number(s.startTime.split(":")[0]) >= 13,
  );

  if (forDate.length === 0)
    return <p className="text-gray-500">Nenhum horário disponível.</p>;

  const renderGroup = (group: any[], label: string) =>
    group.length > 0 && (
      <div className="mb-4">
        <div className="font-semibold text-gray-600 mb-1">{label}</div>
        <div className="flex flex-wrap gap-2">
          {group.map((slot) => {
            const id = `${slot.date}-${slot.startTime}`;
            const busy = slot.appointments?.length > 0;
            return (
              <button
                key={id}
                onClick={() => !busy && onSlotSelect(id)}
                disabled={busy}
                className={`px-2 py-1 text-xs rounded shadow border ${
                  busy
                    ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                    : selectedSlotId === id
                      ? "bg-[#283277] text-white"
                      : "bg-gray-200 hover:bg-[#283277] hover:text-white"
                }`}
              >
                {slot.startTime}
              </button>
            );
          })}
        </div>
      </div>
    );

  return (
    <div className="flex flex-col flex-1 justify-between">
      <div>
        {renderGroup(morning, "Manhã")}
        {renderGroup(afternoon, "Tarde")}
      </div>
      <div className="mt-4 flex justify-end">
        <button
          onClick={onBook}
          className="bg-[#2D39A6] hover:bg-[#283277]-600 text-white px-4 py-2 rounded"
        >
          Agendar Consulta
        </button>
      </div>
    </div>
  );
}
