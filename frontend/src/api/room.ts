import api from "@/lib/api";
import type { User } from "./auth";

export interface CreateRoomPayload {
  name: string,
  password?: string,
  capacity?: number,
  requiresPassword?: boolean,
}

export interface UpdateRoomPayload {
  id: string
  name?: string
  password?: string
  capacity?: string
  requiresPassword: boolean
}

export interface Room {
  id: string,
  name: string,
  ownerID: string,
  roomCode: string,
  password?: string,
  requiresPassword: boolean
  members: string[],
  memberCount: number,
  capacity: number
}

export const roomApi = {

  create: (payload: CreateRoomPayload) => api.post<{message: string, data: Room}>("/rooms", payload),

  delete: (id: string) => api.delete(`/rooms/${id}`),

  search: () => api.get<{ message: string, data: Room[] }>("/rooms/search"),

  update: (id: string, payload: UpdateRoomPayload) => api.patch(`/rooms/${id}`, payload),

  getAll: () => api.get<{message: string, data: Room[]}>("/rooms"),


  join: (code: string) => api.post<{message: string, data: Room}>(`/rooms/${code}/members`),

  leave: (code: string) => api.get<{message: string }>(`/rooms/${code}/members`),

  getMembers: (id: string) => api.get<{message: string, data: User[]}>(`/rooms/${id}/members`),



  fetchMyRooms: () => api.get<{message: string, data: Room[]}>(`/rooms/mine`)
}
