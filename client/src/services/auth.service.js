import api from "./api";

const authService = {
  async register(userData) {
    const { data } = await api.post("/auth/register", userData);
    return data;
  },

  async login(credentials) {
    const { data } = await api.post("/auth/login", credentials);
    return data;
  },

  async getMe() {
    const { data } = await api.get("/auth/me");
    return data;
  },

  async updateProfile(profileData) {
    const { data } = await api.put("/auth/me", profileData);
    return data;
  },
};

export default authService;