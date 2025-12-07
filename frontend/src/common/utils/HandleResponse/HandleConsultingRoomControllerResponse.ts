import { HandleErrorResponse } from "./HandleErrorResponse";

export async function HandleConsultingRoomControllerResponse(res: Response): Promise<{ message: string; type: "success" | "error" }> {
  const resJson = await res.json().catch(() => ({}));
  if (res.ok) {
    const successMessage = `${resJson.message} Id: ${resJson.consultingRoom?.id}, Nombre: ${resJson.consultingRoom?.description}`;
    return { message: successMessage, type: "success" };
  } else {
    return HandleErrorResponse(res);
  }
}