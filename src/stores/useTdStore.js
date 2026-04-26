import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const tdStore = create(
  persist(
    (set) => ({
      tdDetails: {
        _id: crypto.randomUUID(),
        applicantName: "",
        fathersName: "",
        address: "",
        range: "",
        beat: "",
        compartment: "",
        treeCount: 0,
        treeDetails: [],
        sizes: [],
        standingVolume: 0,
        totalSizes: 0,
        convertedVolume: 0,
        conversion: "",
        createdAt:""
      },
      sizes:[],
      setTdDetails: (data) =>
        set((state) => ({
          tdDetails: { ...state.tdDetails, ...data },
        })),
      resetTd: () =>
        set({
          tdDetails: {
            _id: crypto.randomUUID(),
            applicantName: "",
            fathersName: "",
            address: "",
            range: "Tikkar",
            beat: "Pharog",
            compartment: "C.no. 3 Pharog",
            treeCount: 0,
            treeDetails: [],
            sizes: [],
            standingVolume: 0,
            totalSizes: 0,
            convertedVolume: 0,
            conversion: "",
            createdAt:""
          },
        }),
    }),
    {
      name: "td-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default tdStore;
