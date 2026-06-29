type AppointmentServiceItem = {
  service: {
    nome: string;
    durationMinutes: number;
  };
};

type AppointmentWithServices = {
  service: {
    nome: string;
    durationMinutes: number;
  };
  appointmentServices?: AppointmentServiceItem[];
};

export function getAppointmentServices(appointment: AppointmentWithServices) {
  const services = appointment.appointmentServices?.map((item) => item.service);

  return services?.length ? services : [appointment.service];
}

export function formatAppointmentServices(appointment: AppointmentWithServices) {
  return getAppointmentServices(appointment)
    .map((service) => service.nome)
    .join(" + ");
}

export function getAppointmentTotalDuration(appointment: AppointmentWithServices) {
  return getAppointmentServices(appointment).reduce(
    (total, service) => total + service.durationMinutes,
    0,
  );
}
