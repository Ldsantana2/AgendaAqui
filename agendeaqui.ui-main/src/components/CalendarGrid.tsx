import React from "react";
import { format, isSameDay, parseISO } from "date-fns";
import { FaClock, FaCheck, FaTimes, FaClipboard } from "react-icons/fa";
import { Appointment } from "../services/appointmentService";

interface CalendarGridProps {
  dateRange: Date[];
  currentDate: Date;
  viewMode: "week" | "biweek" | "month";
  appointments: Appointment[];
  statusFilter: string | null;
  role: string | null;
  onOpenAppointment: (appointment: Appointment) => void;
}

export default function CalendarGrid({
  dateRange,
  currentDate,
  viewMode,
  appointments,
  statusFilter,
  role,
  onOpenAppointment,
}: CalendarGridProps) {
  const getAppointmentsForDay = (day: Date) =>
    appointments.filter((appointment) => {
      const appointmentDate = parseISO(appointment.date);
      const matchesDate = isSameDay(appointmentDate, day);
      if (!statusFilter) return matchesDate;
      return matchesDate && appointment.status === statusFilter;
    });

  const dayHeaders = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  return (
    <div className="grid grid-cols-7 gap-2">
      {dayHeaders.map((day, idx) => (
        <div key={idx} className="text-center font-medium p-2 bg-gray-100">
          {day}
        </div>
      ))}

      {dateRange.map((day, idx) => {
        const dayAppointments = getAppointmentsForDay(day);
        const isCurrentMonth =
          viewMode === "month" && day.getMonth() === currentDate.getMonth();
        const isOtherMonth =
          viewMode === "month" && day.getMonth() !== currentDate.getMonth();

        return (
          <div
            key={idx}
            className={`min-h-[100px] border p-2 ${
              isOtherMonth
                ? "bg-gray-50 text-gray-400"
                : isCurrentMonth || viewMode !== "month"
                  ? "bg-white"
                  : "bg-gray-50"
            }`}
          >
            <div className="text-right font-medium">{format(day, "d")}</div>
            <div className="mt-1">
              {dayAppointments.length > 0 ? (
                dayAppointments.map((appointment) => {
                  let bgColorClass = "bg-blue-100";
                  let textColorClass = "text-blue-800";
                  let hoverClass = "hover:bg-blue-200";
                  let StatusIcon = null;

                  switch (appointment.status) {
                    case "scheduled":
                      bgColorClass = "bg-yellow-100";
                      textColorClass = "text-yellow-800";
                      hoverClass = "hover:bg-yellow-200";
                      StatusIcon = FaClock;
                      break;
                    case "confirmed":
                      bgColorClass = "bg-green-100";
                      textColorClass = "text-green-800";
                      hoverClass = "hover:bg-green-200";
                      StatusIcon = FaCheck;
                      break;
                    case "canceled":
                      bgColorClass = "bg-red-100";
                      textColorClass = "text-red-800";
                      hoverClass = "hover:bg-red-200";
                      StatusIcon = FaTimes;
                      break;
                    case "completed":
                      bgColorClass = "bg-gray-100";
                      textColorClass = "text-gray-800";
                      hoverClass = "hover:bg-gray-200";
                      StatusIcon = FaClipboard;
                      break;
                    default:
                      StatusIcon = FaClock;
                      break;
                  }

                  return (
                    <div
                      key={appointment.id}
                      className={`text-xs p-1 mb-1 rounded ${bgColorClass} ${textColorClass} truncate cursor-pointer ${hoverClass} transition-colors flex items-center`}
                      onClick={() => onOpenAppointment(appointment)}
                    >
                      {StatusIcon && (
                        <StatusIcon className="mr-1 flex-shrink-0" size={10} />
                      )}
                      <span>
                        {appointment.time} -{" "}
                        {role === "DOCTOR"
                          ? appointment.patientName
                          : appointment.doctorName}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="text-xs text-gray-400">Sem consultas</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
