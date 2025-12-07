import { HandleErrorResponse } from "./HandleErrorResponse";

export async function HandleOccupationControllerResponse(res: Response): Promise<{ message: string; type: "success" | "error" }> {
  const resJson = await res.json().catch(() => ({}));

  if (res.ok) {
    const successMessage = `${resJson.message} Id: ${resJson.occupation?.id}, Nombre: ${resJson.occupation?.name}`;
    return { message: successMessage, type: "success" };
  } else {
      return await HandleErrorResponse(res);
  }
}