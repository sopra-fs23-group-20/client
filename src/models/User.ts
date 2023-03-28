interface UserData {
  id: number | null;
  username: string | null;
  password: string | null;
  status: string | null;
  birthday: Date | null;
  creation_date: Date | null;
  profilePicture: string | null;
  nationality: string | null;
}

class User {
  id: number | null;
  username: string | null;
  password: string | null;
  status: string | null;
  birthday: Date | null;
  creation_date: Date | null;
  profilePicture: string | null;
  nationality: string | null;

  constructor(
    data: UserData = {
      id: null,
      username: null,
      password: null,
      status: null,
      birthday: null,
      creation_date: null,
      profilePicture: null,
      nationality: null,
    }
  ) {
    this.id = data.id ?? null;
    this.username = data.username ?? null;
    this.password = data.password ?? null;
    this.status = data.status ?? null;
    this.birthday = data.birthday ?? null;
    this.creation_date = data.creation_date ?? null;
    this.profilePicture = data.profilePicture ?? null;
    this.nationality = data.nationality ?? null;
  }
}

export default User;
