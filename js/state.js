/* ===========================
   GLOBAL PACKET STATE
   =========================== */

export const packetState = {
  applicationData: "",
  presentationData: "",

  session: {
    id: null,
    status: "inactive"
  },

  transport: {
    protocol: null,
    header: null,
    segments: []
  },

  network: {
    header: null,
    packets: []
  },

  datalink: {
    header: null,
    frames: [],
    encoding: null,
    errorControl: null
  },

  physical: {
    bits: [],
    encodedBits: [],
    modulation: null,
    signal: []
  }
};

/* ===========================
   SNAPSHOTS PER LAYER
   =========================== */

export const layerSnapshots = {};

/* ===========================
   RESET STATE
   =========================== */

export function resetState() {
  packetState.applicationData = "";
  packetState.presentationData = "";

  packetState.session = { id: null, status: "inactive" };

  packetState.transport = {
    protocol: null,
    header: null,
    segments: []
  };

  packetState.network = {
    header: null,
    packets: []
  };

  packetState.datalink = {
    header: null,
    frames: [],
    encoding: null,
    errorControl: null
  };

  packetState.physical = {
    bits: [],
    encodedBits: [],
    modulation: null,
    signal: []
  };

  // clear snapshots
  Object.keys(layerSnapshots).forEach(k => delete layerSnapshots[k]);
}
