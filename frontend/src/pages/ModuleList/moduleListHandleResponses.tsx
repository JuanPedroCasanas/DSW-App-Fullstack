
export async function handleErrorResponse(res: Response): Promise<{ message: string; type: "success" | "error" }> {
  const resJson = await res.json().catch(() => ({}));
    if (res.status === 500 || res.status === 400) {
      return { message: resJson.message ?? "Error interno del servidor", type: "error" };
    } else {
      const errorMessage = `Error: ${resJson.error} Codigo: ${resJson.code} ${resJson.message}`
      return { message: errorMessage.trim(), type: "error" };
    }
}

export async function handleModuleControllerResponse(res: Response): Promise<{ message: string; type: "success" | "error" }> {
  const resJson = await res.json().catch(() => ({}));
  if (res.ok) {
    const successMessage = `${resJson.message} Id turno: ${resJson.module?.id}`;
    return { message: successMessage, type: "success" };
  } else {
    return handleErrorResponse(res);
  }
}

export async function handleConsultingRoomControllerResponse(res: Response): Promise<{ message: string; type: "success" | "error" }> {
  const resJson = await res.json().catch(() => ({}));
  if (res.ok) {
    const successMessage = `${resJson.message} Id: ${resJson.consultingRoom?.id}, Nombre: ${resJson.consultingRoom?.description}`;
    return { message: successMessage, type: "success" };
  } else {
    return handleErrorResponse(res);
  }
}

export async function handleProfessionalControllerResponse(res: Response): Promise<{ message: string; type: "success" | "error" }> {
  const resJson = await res.json().catch(() => ({}));
  if (res.ok) {
    const successMessage = `${resJson.message} Id: ${resJson.professional?.id}, Nombre: ${resJson.professional?.lastName} ${resJson.professional?.firstName}`;
    return { message: successMessage, type: "success" };
  } else {
    return handleErrorResponse(res);
  }
}

export async function handleModuleTypeControllerResponse(res: Response): Promise<{ message: string; type: "success" | "error" }> {
  const resJson = await res.json().catch(() => ({}));
  if (res.ok) {
    const successMessage = `${resJson.message} Id: ${resJson.moduleType?.id}, Nombre: ${resJson.moduleType?.name}`;
    return { message: successMessage, type: "success" };
  } else {
    return handleErrorResponse(res);
  }
}