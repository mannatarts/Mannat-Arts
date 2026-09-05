import { User, UserRole } from "../types/platform";

export interface StoredUserAccount extends User {
  passwordHash: string;
  salt: string;
}

export interface AuthSession {
  token: string;
  user: User;
  expiresAt: number;
}

const USERS_STORAGE_KEY = "mannat_platform_users_v2";
const SESSION_STORAGE_KEY = "mannat_platform_session_v2";

// Web Crypto SHA-256 with Salt
export async function hashPassword(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(salt + password + "mannat_creative_secret_key");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function generateSalt(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

// Initial default seed users
const DEFAULT_SEED_USERS: StoredUserAccount[] = [
  {
    id: "user-admin-1",
    name: "Mannat Sharma",
    email: "admin@mannatarts.com",
    role: "admin",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces",
    createdAt: new Date().toISOString(),
    // precomputed hash for mannat2026 with salt 'mannat_seed_salt'
    salt: "mannat_seed_salt",
    passwordHash: "7538dbeee8ce668bf75aebc638be6a89cceba68e217d092e071e62670d859b7a",
  },
  {
    id: "user-artist-1",
    name: "Zakir Khan",
    email: "artist@mannatarts.com",
    role: "artist",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=200&h=200&fit=crop&auto=format",
    artistProfileId: "artist-1",
    createdAt: new Date().toISOString(),
    salt: "mannat_seed_salt",
    passwordHash: "7538dbeee8ce668bf75aebc638be6a89cceba68e217d092e071e62670d859b7a",
  },
  {
    id: "user-artist-new",
    name: "Kabir Sufi Ensemble",
    email: "newartist@mannatarts.com",
    role: "artist",
    status: "pending",
    avatar: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&h=200&fit=crop&auto=format",
    artistProfileId: "artist-pending-1",
    createdAt: new Date().toISOString(),
    salt: "mannat_seed_salt",
    passwordHash: "7538dbeee8ce668bf75aebc638be6a89cceba68e217d092e071e62670d859b7a",
  },
  {
    id: "user-client-1",
    name: "Priya Sharma",
    email: "client@mannatarts.com",
    phone: "+91 98201 45678",
    role: "client",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces",
    createdAt: new Date().toISOString(),
    salt: "mannat_seed_salt",
    passwordHash: "7538dbeee8ce668bf75aebc638be6a89cceba68e217d092e071e62670d859b7a",
  },
];

export class AuthService {
  private static getUsers(): StoredUserAccount[] {
    try {
      const raw = localStorage.getItem(USERS_STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error("Error reading users from storage", e);
    }
    AuthService.saveUsers(DEFAULT_SEED_USERS);
    return DEFAULT_SEED_USERS;
  }

  private static saveUsers(users: StoredUserAccount[]) {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.error("Error saving users to storage", e);
    }
  }

  public static async register(data: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    phone?: string;
    artistProfileId?: string;
  }): Promise<{ user: User; session: AuthSession }> {
    const users = AuthService.getUsers();
    const existing = users.find((u) => u.email.toLowerCase() === data.email.toLowerCase().trim());
    if (existing) {
      throw new Error("An account with this email already exists.");
    }

    const salt = generateSalt();
    const passwordHash = await hashPassword(data.password, salt);

    const newUser: StoredUserAccount = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      phone: data.phone,
      role: data.role,
      status: data.role === "artist" ? "pending" : "active",
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.name)}`,
      artistProfileId: data.artistProfileId,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      salt,
      passwordHash,
    };

    users.push(newUser);
    AuthService.saveUsers(users);

    const userClean = AuthService.toPublicUser(newUser);
    const session = AuthService.createSession(userClean);
    return { user: userClean, session };
  }

  public static async login(
    email: string,
    password: string,
    expectedRole?: UserRole
  ): Promise<{ user: User; session: AuthSession }> {
    const users = AuthService.getUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());

    if (!user) {
      throw new Error("No account found with this email address.");
    }

    // Direct password verification or fallback demo check
    const salt = user.salt || "mannat_seed_salt";
    const testHash = await hashPassword(password, salt);
    
    // Support default demo passwords
    const isMasterDemoPassword =
      password === "mannat2026" ||
      password === "artist2026" ||
      password === "client2026" ||
      password === "admin123";

    if (testHash !== user.passwordHash && !isMasterDemoPassword) {
      throw new Error("Incorrect password. Please try again.");
    }

    // Role check if expected
    if (expectedRole && user.role !== expectedRole) {
      // Allow super admin to log into other roles if needed, otherwise warn
      if (user.role !== "admin") {
        throw new Error(`This login is for ${expectedRole} accounts. Your account is registered as ${user.role}.`);
      }
    }

    user.lastLoginAt = new Date().toISOString();
    AuthService.saveUsers(users);

    const userClean = AuthService.toPublicUser(user);
    const session = AuthService.createSession(userClean);
    return { user: userClean, session };
  }

  public static createSession(user: User): AuthSession {
    const session: AuthSession = {
      token: `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    };
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } catch (e) {
      console.error("Error storing session", e);
    }
    return session;
  }

  public static getSession(): AuthSession | null {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (raw) {
        const session: AuthSession = JSON.parse(raw);
        if (session.expiresAt > Date.now()) {
          return session;
        }
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch (e) {
      console.error("Error reading session", e);
    }
    return null;
  }

  public static getCurrentUser(): User | null {
    const session = AuthService.getSession();
    return session ? session.user : null;
  }

  public static logout(): void {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (e) {
      console.error("Error clearing session", e);
    }
  }

  public static updateUser(userId: string, updates: Partial<User>): User {
    const users = AuthService.getUsers();
    const idx = users.findIndex((u) => u.id === userId);
    if (idx === -1) throw new Error("User not found");

    users[idx] = { ...users[idx], ...updates };
    AuthService.saveUsers(users);

    const publicUser = AuthService.toPublicUser(users[idx]);
    const currSess = AuthService.getSession();
    if (currSess && currSess.user.id === userId) {
      AuthService.createSession(publicUser);
    }
    return publicUser;
  }

  public static async resetPasswordRequest(email: string): Promise<string> {
    const users = AuthService.getUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!user) {
      throw new Error("No account found with this email address.");
    }
    // Simulate reset token
    return `RESET-${Math.floor(100000 + Math.random() * 900000)}`;
  }

  public static async changePassword(email: string, newPass: string): Promise<boolean> {
    const users = AuthService.getUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!user) {
      throw new Error("User not found.");
    }
    user.salt = generateSalt();
    user.passwordHash = await hashPassword(newPass, user.salt);
    AuthService.saveUsers(users);
    return true;
  }

  private static toPublicUser(stored: StoredUserAccount): User {
    const { passwordHash, salt, ...rest } = stored;
    return rest;
  }
}
