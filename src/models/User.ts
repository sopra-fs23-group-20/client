interface UserData {
  id: number | null;
  username: string | null;
  status: string | null;
  birthday: Date | null;
  creation_date: Date | null;
}

class User {
  id: number | null;
  username: string | null;
  status: string | null;
  birthday: Date | null;
  creation_date: Date | null;

  constructor(data: UserData = { id: null, username: null, status: null, birthday: null, creation_date: null }) {
    this.id = data.id ?? null;
    this.username = data.username ?? null;
    this.status = data.status ?? null;
    this.birthday = data.birthday ?? null;
    this.creation_date = data.creation_date ?? null;
  }
}

export default User;
