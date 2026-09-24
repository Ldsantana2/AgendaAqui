import React from "react";
import { format } from "date-fns";

interface Appointment {
  id: string;
  date: string;
  time: string;
  patientName: string;
  specialty: string;
}

interface DoctorCalendarViewProps {
  appointments: Appointment[];
}

const DoctorAppointments: React.FC<DoctorCalendarViewProps> = ({
  appointments = [],
}) => {
  return (
    <div className="w-full overflow-x-auto">
      <h2 className="text-2xl font-bold text-[#2D39A6] mb-4">
        Consultas Agendadas
      </h2>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-[#2D39A6] text-white">
            <th className="px-4 py-2 text-left">Data</th>
            <th className="px-4 py-2 text-left">Horário</th>
            <th className="px-4 py-2 text-left">Paciente</th>
            <th className="px-4 py-2 text-left">Especialidade</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appt) => (
            <tr
              key={appt.id}
              className="border-b border-gray-100 hover:bg-gray-50"
            >
              <td className="px-4 py-2">
                {format(new Date(appt.date), "dd/MM/yyyy")}
              </td>
              <td className="px-4 py-2">{appt.time}</td>
              <td className="px-4 py-2">{appt.patientName}</td>
              <td className="px-4 py-2">{appt.specialty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorAppointments;

// This ensures the page can be prerendered without errors
export async function getStaticProps() {
  return {
    props: {
      appointments: [], // Default empty array for prerendering
    },
  };
}
