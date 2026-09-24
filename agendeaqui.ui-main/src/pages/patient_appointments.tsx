import React from "react";
import { FaCalendarAlt, FaClock } from "react-icons/fa";

interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  location: string;
  status: "agendada" | "realizada";
}

interface Props {
  appointments: Appointment[];
}

const PatientAppointments: React.FC<Props> = ({ appointments = [] }) => {
  const future = appointments?.filter((a) => a.status === "agendada") || [];
  const past = appointments?.filter((a) => a.status === "realizada") || [];

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Consultas Agendadas
        </h2>
        <div className="space-y-4">
          {future.map((appt) => (
            <div
              key={appt.id}
              className="border border-gray-300 rounded p-4 bg-white shadow"
            >
              <h3 className="text-lg font-bold text-[#2D39A6]">
                {appt.doctorName}
              </h3>
              <p className="text-sm text-gray-600">{appt.specialty}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-700">
                <span className="flex items-center gap-1">
                  <FaCalendarAlt /> {appt.date}
                </span>
                <span className="flex items-center gap-1">
                  <FaClock /> {appt.time}
                </span>
              </div>
              <p className="mt-1 text-sm">Local: {appt.location}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Consultas Realizadas
        </h2>
        <div className="space-y-4">
          {past.map((appt) => (
            <div
              key={appt.id}
              className="border border-gray-300 rounded p-4 bg-white shadow"
            >
              <h3 className="text-lg font-bold text-gray-800">
                {appt.doctorName}
              </h3>
              <p className="text-sm text-gray-600">{appt.specialty}</p>
              <p className="text-sm text-gray-700">
                Data: {appt.date} - {appt.time}
              </p>
              <p className="text-sm">Local: {appt.location}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PatientAppointments;

// This ensures the page can be prerendered without errors
export async function getStaticProps() {
  return {
    props: {
      appointments: [], // Default empty array for prerendering
    },
  };
}
