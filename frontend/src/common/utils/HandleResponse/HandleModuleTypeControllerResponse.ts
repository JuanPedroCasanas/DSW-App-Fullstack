import { HandleErrorResponse } from "./HandleErrorResponse";

export async function HandleModuleTypeControllerResponse(res: Response): Promise<{ message: string; type: "success" | "error" }> {
  const resJson = await res.json().catch(() => ({}));
  if (res.ok) {
    const successMessage = `${resJson.message} Id: ${resJson.moduleType?.id}, Nombre: ${resJson.moduleType?.name}`;
    return { message: successMessage, type: "success" };
  } else {
    return await HandleErrorResponse(res);
  }
}