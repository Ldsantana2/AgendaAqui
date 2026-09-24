// components/CalendarSection.tsx
import { Calendar, Select } from "antd";
import locale from "antd/es/calendar/locale/pt_BR";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import React from "react";

type Props = {
  value: Dayjs | null;
  onSelect: (d: Dayjs) => void;
  availableSlots: any[];
};

export default function CalendarSection({
  value,
  onSelect,
  availableSlots,
}: Props) {
  const [currentMonth, setCurrentMonth] = React.useState(dayjs().month());
  const [currentYear, setCurrentYear] = React.useState(dayjs().year());

  const renderHeader = ({ value, onChange }: any) => {
    const now = dayjs();
    const years = Array.from({ length: 10 }, (_, i) => now.year() + i);
    const months = Array.from({ length: 12 }, (_, i) => i).filter(
      (m) => !(value.year() === now.year() && m < now.month()),
    );
    const monthNames = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];

    return (
      <div className="flex justify-center gap-2">
        <Select
          size="small"
          value={value.year()}
          onChange={(y) => {
            const newDate = value.clone().year(y);
            onChange(newDate);
            setCurrentYear(y);
          }}
          options={years.map((y) => ({ label: y, value: y }))}
        />
        <Select
          size="small"
          value={value.month()}
          onChange={(m) => {
            const newDate = value.clone().month(m);
            onChange(newDate);
            setCurrentMonth(m);
          }}
          options={months.map((m) => ({ label: monthNames[m], value: m }))}
        />
      </div>
    );
  };

  const disabledDate = (current: Dayjs) => {
    const today = dayjs().startOf("day");
    if (current.isBefore(today)) return true;
    return !availableSlots.some((slot) =>
      dayjs(slot.date).isSame(current, "day"),
    );
  };

  return (
    <Calendar
      fullscreen={false}
      locale={locale}
      value={value ?? undefined}
      headerRender={renderHeader}
      onSelect={onSelect}
      disabledDate={disabledDate}
      dateFullCellRender={(date) => {
        if (date.month() !== currentMonth || date.year() !== currentYear)
          return null;
        return <div className="ant-picker-cell-inner">{date.date()}</div>;
      }}
    />
  );
}
