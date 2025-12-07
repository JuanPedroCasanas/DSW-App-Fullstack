import { HandleErrorResponse } from "./HandleErrorResponse";

export async function HandleUserControllerResponse(res: Response): Promise<{ message: string; type: "success" | "error" }> {
  if (res.ok) {
    const resJson = await res.json().catch(() => ({}));
    const successMessage = `${resJson.message} Id: ${resJson.user?.id}, Email: ${resJson.user?.mail}, Rol: ${resJson.user?.role}`;
    return { message: successMessage, type: "success" };
  } else {
    return HandleErrorResponse(res);
  }
}