export async function HandleAppointmentControllerResponse(res: Response): Promise<{ message: string; type: 'success' | 'error' }> {
  const resJson = await res.json().catch(() => ({}));

  if (res.ok) {
    const successMessage =
      `${resJson.message ?? 'Operación exitosa'}` +
      (resJson.consultingRoom
        ? ` Id: ${resJson.consultingRoom?.id}, Nombre: ${resJson.consultingRoom?.description}`
        : resJson.appointment
        ? ` Turno: ${resJson.appointment?.id ?? ''}`
        : '');
    return { message: successMessage.trim(), type: 'success' };
  } else {
    if (res.status === 500 || res.status === 400) {
      return { message: resJson.message ?? 'Error interno del servidor', type: 'error' };
    } else {
      const errorMessage = `Error: ${resJson.error ?? ''} Codigo: ${resJson.code ?? ''} ${resJson.message ?? ''}`;
      return { message: errorMessage.trim(), type: 'error' };
    }
  }
}
