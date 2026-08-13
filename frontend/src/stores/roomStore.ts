import { roomApi, type CreateRoomPayload, type Room } from "@/api/room";
import { create } from "zustand";

interface RoomState {
  currentRoom: Room | null
  myRooms: Room[]

  isCreating: boolean
  isJoining: boolean
  isFetching: boolean
  // setLoading: boolean

  setCurrentRoom: (room: Room | null) => void
  clearCurrentRoom: () => void
  createRoom: (payload: CreateRoomPayload) => Promise<Room>
  joinRoom: (code: string) => Promise<Room>
  leaveRoom: (code: string) => Promise<void>
  fetchMyRooms: () => Promise<void>

  // room card click
  setCurrentRoomByCode: (code: string) => Promise<void>
}


export const useRoomStore = create<RoomState>((set) => ({
  currentRoom: null,
  myRooms: [],

  isCreating: false,
  isFetching: true,
  isJoining: false,

  setCurrentRoom: (currentRoom) => set({currentRoom}),

  clearCurrentRoom: () => set({ currentRoom: null }),

  createRoom: async (payload: CreateRoomPayload) : Promise<Room> => {
    try {
      set({isCreating: true})
      const {data} = await roomApi.create(payload)
      set({currentRoom: data.data})
      return data.data
    } finally {
      set({isCreating: false})
    }
  },

  joinRoom: async (code: string) => {
    try {
      set({isJoining: true})
      const {data} = await roomApi.join(code)
      set({currentRoom: data.data})
      return data.data
    } finally {
      set({isJoining: false})
    }
  },

  leaveRoom: async () => { },

  fetchMyRooms: async () => {
    try {
      set({isFetching: true})
      const {data}= await roomApi.fetchMyRooms()
      set({myRooms: data.data})
    } finally {
      set({isFetching: false})
    }
  },

  setCurrentRoomByCode: async (code: string) => {
    try {
      set({isFetching: true})
      const {data} = await roomApi.getByCode(code)
      set({currentRoom: data.data})
    } finally {
      set({isFetching: false})
    }
  }

}))
