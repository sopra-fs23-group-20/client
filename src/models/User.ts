interface UserData {
  id: number | null;
  name: string | null;
  username: string | null;
  token: string | null;
  status: string | null;
}

class User {
  id: number | null;
  name: string | null;
  username: string | null;
  token: string | null;
  status: string | null;

  constructor(data: UserData = { id: null, name: null, username: null, token: null, status: null }) {
    this.id = data.id ?? null;
    this.name = data.name ?? null;
    this.username = data.username ?? null;
    this.token = data.token ?? null;
    this.status = data.status ?? null;
  }
}

export default User;
